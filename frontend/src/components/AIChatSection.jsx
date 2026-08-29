import { useState } from 'react'
import { Send, Bot, User, Sparkles, Receipt } from 'lucide-react'

const INITIAL_FORM = {
  fullName: 'Rahul Sharma',
  pan: 'ABCDE1234F',
  grossSalary: 0,
  standardDeduction: 75000,
  deduction80C: 0,
  hra: 0,
  taxableIncome: 0,
  baseTax: 0,
  netPayable: 0,
  refundDue: 0,
  receiptToken: '—',
}

// Conversation steps
const STEPS = ['salary', '80c', 'rent', 'tds', 'done']

const QUESTIONS = {
  salary: "Namaste! I am your AI Tax Assistant 🙏\n\nLet's calculate your tax step by step.\n\nWhat is your **gross annual salary**? (e.g. '12 lakhs', '4500000')",
  '80c': "Got it! Have you made any **80C investments** this year?\n(PPF, ELSS, LIC, EPF, NSC etc.)\n\nReply with the amount (e.g. '1.2 lakhs') or say **'No'** if none.",
  rent: "Noted! Do you pay **house rent**?\n\nIf yes, how much per month? (e.g. '15000')\nIf no, say **'No'**.",
  tds: "Almost done! How much **TDS has your employer deducted** this year?\n(e.g. '80000' or '1.2 lakhs')",
}

function parseLakhAmount(text) {
  const lower = text.toLowerCase().trim()
  if (lower === 'no' || lower === 'none' || lower === '0') return 0
  const lakhMatch = lower.match(/(\d+\.?\d*)\s*lakh/)
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000)
  const croreMatch = lower.match(/(\d+\.?\d*)\s*crore/)
  if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000)
  const plainMatch = lower.match(/(\d[\d,]*)/)
  if (plainMatch) return parseInt(plainMatch[1].replace(/,/g, ''))
  return 0
}

export default function AIChatSection({ lang = 'en' }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: QUESTIONS.salary },
  ])
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('salary')
  const [collected, setCollected] = useState({
    grossSalary: 0,
    deduction80C: 0,
    monthlyRent: 0,
    tds: 0,
  })

  function addMessage(role, text) {
    setMessages(prev => [...prev, { role, text }])
  }

  async function runCalculation(data) {
    setLoading(true)
    const hra = data.monthlyRent * 12

    try {
      const res = await fetch('/api/calculate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_narrative: `Gross salary ${data.grossSalary}, 80C ${data.deduction80C}, monthly rent ${data.monthlyRent}, TDS ${data.tds}`,
          gross_salary: data.grossSalary,
          tds_deducted: data.tds,
        }),
      })

      if (!res.ok) throw new Error('Failed')
      const result = await res.json()

      setForm({
        ...form,
        grossSalary: data.grossSalary,
        deduction80C: result.deduction_80c,
        hra: result.house_rent_allowance,
        taxableIncome: result.taxable_income,
        baseTax: result.base_tax,
        netPayable: result.net_payable_tax,
        refundDue: result.refund_due,
        receiptToken: result.receipt_token,
      })

      const summary = [
        `✅ Calculation complete! Here's your summary:`,
        ``,
        `• Gross Salary: ₹${data.grossSalary.toLocaleString()}`,
        `• Standard Deduction: ₹75,000`,
        `• 80C Deduction: ₹${result.deduction_80c.toLocaleString()}`,
        `• HRA Exemption: ₹${result.house_rent_allowance.toLocaleString()}`,
        `• **Taxable Income: ₹${result.taxable_income.toLocaleString()}**`,
        `• Base Tax: ₹${result.base_tax.toLocaleString()}`,
        `• TDS Paid: ₹${data.tds.toLocaleString()}`,
        ``,
        result.refund_due > 0
          ? `🟢 **Refund Due: ₹${result.refund_due.toLocaleString()}**`
          : `🔴 **Net Payable: ₹${result.net_payable_tax.toLocaleString()}**`,
        ``,
        `Receipt: ${result.receipt_token}`,
        ``,
        `Your ITR-V form on the right has been auto-filled! Want to calculate again? Just type 'restart'.`,
      ].join('\n')

      addMessage('bot', summary)

    } catch {
      addMessage('bot', '⚠️ Could not connect to the tax service. Please check backend.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    addMessage('user', text)

    if (text.toLowerCase() === 'restart') {
      setStep('salary')
      setCollected({ grossSalary: 0, deduction80C: 0, monthlyRent: 0, tds: 0 })
      setTimeout(() => addMessage('bot', QUESTIONS.salary), 300)
      return
    }

    if (step === 'salary') {
      const salary = parseLakhAmount(text)
      if (salary === 0) {
        addMessage('bot', "I couldn't understand that. Please enter your salary (e.g. '12 lakhs' or '1200000').")
        return
      }
      const updated = { ...collected, grossSalary: salary }
      setCollected(updated)
      setStep('80c')
      setTimeout(() => addMessage('bot', QUESTIONS['80c']), 300)

    } else if (step === '80c') {
      const amount = parseLakhAmount(text)
      const updated = { ...collected, deduction80C: Math.min(amount, 150000) }
      setCollected(updated)
      setStep('rent')
      const msg = amount > 0
        ? `Got it — ₹${Math.min(amount, 150000).toLocaleString()} under 80C.\n\n${QUESTIONS.rent}`
        : `No 80C investments — noted.\n\n${QUESTIONS.rent}`
      setTimeout(() => addMessage('bot', msg), 300)

    } else if (step === 'rent') {
      const lower = text.toLowerCase()
      const noRent = lower === 'no' || lower === 'none' || lower === '0'
      const monthlyRent = noRent ? 0 : parseLakhAmount(text)
      const updated = { ...collected, monthlyRent }
      setCollected(updated)
      setStep('tds')
      const msg = monthlyRent > 0
        ? `Got it — ₹${monthlyRent.toLocaleString()}/month rent.\n\n${QUESTIONS.tds}`
        : `No rent — noted.\n\n${QUESTIONS.tds}`
      setTimeout(() => addMessage('bot', msg), 300)

    } else if (step === 'tds') {
      const tds = parseLakhAmount(text)
      const updated = { ...collected, tds }
      setCollected(updated)
      setStep('done')
      setTimeout(() => {
        addMessage('bot', `TDS of ₹${tds.toLocaleString()} noted. Calculating your tax now...`)
        runCalculation(updated)
      }, 300)

    } else if (step === 'done') {
      if (text.toLowerCase().includes('restart') || text.toLowerCase().includes('again')) {
        setStep('salary')
        setCollected({ grossSalary: 0, deduction80C: 0, monthlyRent: 0, tds: 0 })
        setTimeout(() => addMessage('bot', QUESTIONS.salary), 300)
      } else {
        addMessage('bot', "Your ITR-V is filled! Type 'restart' to calculate for a different salary.")
      }
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Progress indicator
  const stepIndex = STEPS.indexOf(step)
  const progress = Math.round((stepIndex / (STEPS.length - 1)) * 100)

  return (
    <div className="flex h-full w-full">
      {/* Dark Chat Panel */}
      <div className="w-1/2 h-full bg-navy flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-accent" />
            <h2 className="font-head text-lg font-semibold text-white">AI Tax Assistant</h2>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-white/40">{stepIndex}/{STEPS.length - 1}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto chat-scroll px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-accent" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg text-sm font-body leading-relaxed whitespace-pre-line ${
                  msg.role === 'bot' ? 'bg-white/10 text-white/90' : 'bg-white text-navy'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-1">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-accent animate-pulse" />
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-body text-white/70">
                Calculating…
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                step === 'salary' ? "Enter your salary (e.g. 12 lakhs)…" :
                step === '80c' ? "Enter 80C amount or 'No'…" :
                step === 'rent' ? "Enter monthly rent or 'No'…" :
                step === 'tds' ? "Enter TDS amount…" :
                "Type 'restart' to calculate again…"
              }
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm font-body text-white placeholder-white/40 focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ITR-V Form Card */}
      <div className="w-1/2 h-full overflow-y-auto bg-[#f9f9f9] p-8">
        <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div>
              <h2 className="font-head text-2xl font-bold text-navy">ITR-V Form</h2>
              <p className="text-xs font-body text-gray-400 mt-1">Income Tax Return — Verification</p>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <Sparkles size={16} />
              <span className="text-xs font-body font-semibold">AI-Filled</span>
            </div>
          </div>

          <div className="space-y-5 font-body">
            <Field label="Full Name" value={form.fullName} />
            <Field label="PAN" value={form.pan} mono />
            <Field label="Gross Salary (₹)" value={form.grossSalary > 0 ? form.grossSalary.toLocaleString() : '—'} />
            <Field label="Standard Deduction (₹)" value="75,000" />
            <Field label="80C Deduction (₹)" value={form.deduction80C > 0 ? form.deduction80C.toLocaleString() : '—'} highlight />
            <Field label="HRA Exemption (₹)" value={form.hra > 0 ? form.hra.toLocaleString() : '—'} highlight />
            <div className="border-t border-gray-100 pt-4">
              <Field label="Taxable Income (₹)" value={form.taxableIncome > 0 ? form.taxableIncome.toLocaleString() : '—'} strong />
              <Field label="Base Tax (₹)" value={form.baseTax > 0 ? form.baseTax.toLocaleString() : '—'} strong />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 ${form.netPayable > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Net Payable</p>
                <p className={`font-head text-xl font-bold ${form.netPayable > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  {form.receiptToken !== '—' ? `₹${form.netPayable.toLocaleString()}` : '—'}
                </p>
              </div>
              <div className={`rounded-lg p-4 ${form.refundDue > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Refund Due</p>
                <p className={`font-head text-xl font-bold ${form.refundDue > 0 ? 'text-accent' : 'text-gray-400'}`}>
                  {form.receiptToken !== '—' ? `₹${form.refundDue.toLocaleString()}` : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <Receipt size={16} className="text-gray-400" />
              <span className="text-xs font-body text-gray-500">
                Receipt Token: <span className="font-mono text-navy">{form.receiptToken}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, strong, mono, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <label className="text-[13px] font-semibold text-gray-500">{label}</label>
      <span className={`text-sm ${mono ? 'font-mono' : 'font-body'} ${strong ? 'font-bold text-navy' : 'text-gray-800'} ${highlight ? 'px-2 py-0.5 bg-blue-50 rounded text-navy font-semibold' : ''}`}>
        {value}
      </span>
    </div>
  )
}
