import os
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI(title="Indian Tax Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
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
    """Calculate tax under Indian New Tax Regime"""
    tax = 0
    remaining = taxable_income

    # 0 to 3L: 0%
    if remaining <= 300000:
        return 0

    remaining -= 300000

    # 3L to 6L: 5%
    slab = min(remaining, 300000)
    tax += slab * 0.05
    remaining -= slab

    if remaining <= 0:
        return int(tax)

    # 6L to 9L: 10%
    slab = min(remaining, 300000)
    tax += slab * 0.10
    remaining -= slab

    if remaining <= 0:
        return int(tax)

    # 9L to 12L: 15%
    slab = min(remaining, 300000)
    tax += slab * 0.15
    remaining -= slab

    if remaining <= 0:
        return int(tax)

    # Over 12L: 20%
    tax += remaining * 0.20

    return int(tax)

async def extract_deductions_from_narrative(narrative: str) -> dict:
    """Use OpenRouter to extract financial deductions from user narrative"""
    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3-8b-instruct:free",
            messages=[
                {
                    "role": "system",
                    "content": """You are a tax deduction extractor for Indian tax calculations.
Extract financial deduction variables from the user's narrative and return ONLY a valid JSON object with these exact keys:
- "deduction_80c": integer (maximum 150000, cap at 150000 if higher mentioned)
- "house_rent_allowance": integer

If a deduction is not mentioned, use 0. Return ONLY the JSON object, no extra text."""
                },
                {
                    "role": "user",
                    "content": narrative
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=200
        )

        content = response.choices[0].message.content
        import json
        deductions = json.loads(content)

        # Cap 80C at 150000
        deduction_80c = min(int(deductions.get("deduction_80c", 0)), 150000)
        hra = int(deductions.get("house_rent_allowance", 0))

        return {"deduction_80c": deduction_80c, "house_rent_allowance": hra}

    except Exception as e:
        print(f"OpenRouter extraction failed: {e}")
        return {"deduction_80c": 0, "house_rent_allowance": 0}

@app.post("/api/calculate-tax", response_model=TaxCalculationResponse)
async def calculate_tax(request: TaxCalculationRequest):
    # Extract deductions from narrative using AI
    deductions = await extract_deductions_from_narrative(request.user_narrative)
    deduction_80c = deductions["deduction_80c"]
    hra = deductions["house_rent_allowance"]

    # Standard deduction for new regime
    standard_deduction = 75000

    # Calculate taxable income
    taxable_income = request.gross_salary - standard_deduction - deduction_80c - hra
    taxable_income = max(0, taxable_income)

    # Calculate base tax
    base_tax = calculate_new_regime_tax(taxable_income)

    # Net payable tax or refund
    net_payable = base_tax - request.tds_deducted
    refund_due = max(0, -net_payable)
    net_payable = max(0, net_payable)

    receipt_token = f"ITR-{uuid.uuid4().hex[:12].upper()}"

    return TaxCalculationResponse(
        taxable_income=taxable_income,
        deduction_80c=deduction_80c,
        house_rent_allowance=hra,
        base_tax=base_tax,
        net_payable_tax=net_payable,
        refund_due=refund_due,
        receipt_token=receipt_token
    )

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)