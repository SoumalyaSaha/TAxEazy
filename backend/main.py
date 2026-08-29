import os
import uuid
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI(title="Indian Tax Calculator API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("OPENROUTER_API_KEY"),
)

class TaxCalculationRequest(BaseModel):
    user_narrative: str
    gross_salary: int
    tds_deducted: int

class TaxCalculationResponse(BaseModel):
    taxable_income: int
    deduction_80c: int
    house_rent_allowance: int
    base_tax: int
    net_payable_tax: int
    refund_due: int
    receipt_token: str

def calculate_new_regime_tax(taxable_income: int) -> int:
    tax = 0
    remaining = taxable_income
    if remaining <= 300000: return 0
    remaining -= 300000
    slab = min(remaining, 300000); tax += slab * 0.05; remaining -= slab
    if remaining <= 0: return int(tax)
    slab = min(remaining, 300000); tax += slab * 0.10; remaining -= slab
    if remaining <= 0: return int(tax)
    slab = min(remaining, 300000); tax += slab * 0.15; remaining -= slab
    if remaining <= 0: return int(tax)
    tax += remaining * 0.20
    return int(tax)

def fallback_extract(narrative: str) -> dict:
    import re
    text = narrative.lower()
    deduction_80c = 0
    hra = 0
    for pattern in [r'(\d+\.?\d*)\s*lakh.*?(?:ppf|80c|elss|lic|epf)', r'(?:ppf|80c|elss|lic|epf).*?(\d+\.?\d*)\s*lakh']:
        m = re.search(pattern, text)
        if m:
            deduction_80c = min(int(float(m.group(1)) * 100000), 150000)
            break
    for pattern in [r'(\d{4,6})\s*(?:per month|monthly|/month)', r'(?:rent|rented).*?(\d{4,6})']:
        m = re.search(pattern, text)
        if m:
            hra = int(m.group(1)) * 12
            break
    print(f"Fallback: 80C={deduction_80c}, HRA={hra}")
    return {"deduction_80c": deduction_80c, "house_rent_allowance": hra}

async def extract_deductions_from_narrative(narrative: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": """You are an Indian income tax deduction extractor.
Extract ONLY these two values from the user message:
1. deduction_80c: 80C investments (PPF, ELSS, LIC, EPF). Cap at 150000.
2. house_rent_allowance: Annual HRA. If monthly rent mentioned, multiply by 12.

RULES:
- "1.2 lakhs" = 120000. "15000 monthly rent" = 180000 annual HRA.
- If mentioned, extract it. Never return 0 for something that is mentioned.
- Return ONLY raw JSON, no markdown, no explanation.

EXAMPLE: "invested 1.2 lakhs in PPF and pay 15000 rent monthly"
OUTPUT: {"deduction_80c": 120000, "house_rent_allowance": 180000}"""},
                {"role": "user", "content": narrative}
            ],
            temperature=0.0,
            max_tokens=100,
        )
        content = response.choices[0].message.content.strip()
        print(f"Groq response: {content}")
        if "```" in content:
            content = content.split("```")[1]
            if content.startswith("json"): content = content[4:]
        start = content.find('{'); end = content.rfind('}') + 1
        if start != -1 and end > start: content = content[start:end]
        d = json.loads(content.strip())
        result = {"deduction_80c": min(int(d.get("deduction_80c", 0)), 150000), "house_rent_allowance": int(d.get("house_rent_allowance", 0))}
        print(f"Extracted: {result}")
        return result
    except Exception as e:
        print(f"Groq failed: {e}, using fallback")
        return fallback_extract(narrative)

@app.post("/api/calculate-tax", response_model=TaxCalculationResponse)
async def calculate_tax(request: TaxCalculationRequest):
    deductions = await extract_deductions_from_narrative(request.user_narrative)
    deduction_80c = deductions["deduction_80c"]
    hra = deductions["house_rent_allowance"]
    taxable_income = max(0, request.gross_salary - 75000 - deduction_80c - hra)
    base_tax = calculate_new_regime_tax(taxable_income)
    net_payable = base_tax - request.tds_deducted
    refund_due = max(0, -net_payable)
    net_payable = max(0, net_payable)
    return TaxCalculationResponse(
        taxable_income=taxable_income, deduction_80c=deduction_80c,
        house_rent_allowance=hra, base_tax=base_tax,
        net_payable_tax=net_payable, refund_due=refund_due,
        receipt_token=f"ITR-{uuid.uuid4().hex[:12].upper()}"
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
