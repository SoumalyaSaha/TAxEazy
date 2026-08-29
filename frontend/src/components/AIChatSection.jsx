import { useState } from 'react'
import { Send, Bot, User, Sparkles, Receipt } from 'lucide-react'

const INITIAL_FORM = {
  fullName: 'Rahul Sharma',
  pan: 'ABCDE1234F',
  grossSalary: 1200000,
  standardDeduction: 75000,
  deduction80C: 0,
  hra: 0,
  taxableIncome: 1200000 - 75000,
  baseTax: 0,
  netPayable: 0,
  refundDue: 0,
  receiptToken: '—',
}

const PRELOADED_NARRATIVE = `I earn a gross salary of 12 lakhs per year. I have made PPF investments of 1.2 lakhs under 80C. I also pay monthly rent of 15000 in Mumbai where I live in a rented flat. My employer deducted TDS of 80000 this year.`

export default function AIChatSection() {
  const [narrative, setNarrative] = useState(PRELOADED_NARRATIVE)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaste! I am your AI Tax Assistant. Tell me about your income, investments, and deductions, and I will auto-fill your ITR-V form on the right.' },
  ])
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!narrative.trim() || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: narrative }])
    setLoading(true)

    try {
      const res = await fetch('/api/calculate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_narrative: narrative,
          gross_salary: form.grossSalary,
          tds_deducted: 80000,
        }),
      })

      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()

      setForm({
        ...form,
        deduction80C: data.deduction_80c,
        hra: data.house_rent_allowance,
        taxableIncome: data.taxable_income,
        baseTax: data.base_tax,
        netPayable: data.net_payable_tax,
        refundDue: data.refund_due,
        receiptToken: data.receipt_token,
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `Calculation complete. I extracted ₹${data.deduction_80c.toLocaleString()} under 80C and ₹${data.house_rent_allowance.toLocaleString()} as HRA. Your taxable income is ₹${data.taxable_income.toLocaleString()} with a net ${data.refund_due > 0 ? `refund of ₹${data.refund_due.toLocaleString()}` : `payable tax of ₹${data.net_payable_tax.toLocaleString()}`}. Receipt: ${data.receipt_token}`,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ Could not connect to the tax calculation service. Please ensure the backend is running.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full">
      {/* Dark Chat Panel (Left) */}
      <div className="w-1/2 h-full bg-navy flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
          <Bot size={20} className="text-accent" />
          <h2 className="font-head text-lg font-semibold text-white">AI Tax Assistant</h2>
        </div>

        <div className="flex-1 overflow-y-auto chat-scroll px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-accent" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg text-sm font-body leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-white/10 text-white/90'
                    : 'bg-white text-navy'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
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
          <div className="flex items-end gap-2">
            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={3}
              placeholder="Describe your income, investments, and deductions…"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-body text-white placeholder-white/40 resize-none focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white px-4 py-3 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ITR-V Form Card (Right) */}
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
            <Field label="Gross Salary (₹)" value={form.grossSalary.toLocaleString()} />
            <Field label="Standard Deduction (₹)" value={form.standardDeduction.toLocaleString()} />
            <Field label="80C Deduction (₹)" value={form.deduction80C.toLocaleString()} highlight />
            <Field label="HRA Exemption (₹)" value={form.hra.toLocaleString()} highlight />
            <div className="border-t border-gray-100 pt-4">
              <Field label="Taxable Income (₹)" value={form.taxableIncome.toLocaleString()} strong />
              <Field label="Base Tax (₹)" value={form.baseTax.toLocaleString()} strong />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 ${form.netPayable > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Net Payable</p>
                <p className={`font-head text-xl font-bold ${form.netPayable > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  ₹{form.netPayable.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-lg p-4 ${form.refundDue > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Refund Due</p>
                <p className={`font-head text-xl font-bold ${form.refundDue > 0 ? 'text-accent' : 'text-gray-400'}`}>
                  ₹{form.refundDue.toLocaleString()}
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
      <span
        className={`text-sm ${mono ? 'font-mono' : 'font-body'} ${
          strong ? 'font-bold text-navy' : 'text-gray-800'
        } ${highlight ? 'px-2 py-0.5 bg-blue-50 rounded text-navy font-semibold' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}