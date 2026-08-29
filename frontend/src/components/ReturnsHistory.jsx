
// ✅ New
import { History, CheckCircle, Clock, Download } from 'lucide-react'

const RETURNS = [
  { ay: '2025-26', filedOn: '28 Jul 2025', status: 'Verified', refund: '₹ 12,400', type: 'ITR-1' },
  { ay: '2024-25', filedOn: '15 Aug 2024', status: 'Processed', refund: '₹ 8,200', type: 'ITR-1' },
  { ay: '2023-24', filedOn: '20 Jul 2023', status: 'Processed', refund: '₹ 5,100', type: 'ITR-1' },
  { ay: '2022-23', filedOn: '31 Aug 2022', status: 'Verified', refund: '₹ 0', type: 'ITR-1' },
]

export default function ReturnsHistory() {
  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f9] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-head text-2xl font-bold text-navy mb-1">Returns History</h2>
        <p className="text-sm font-body text-gray-400 mb-6">Past Assessment Years filed</p>

        <div className="space-y-4">
          {RETURNS.map((r) => (
            <div
              key={r.ay}
              className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                  <History size={20} className="text-navy" />
                </div>
                <div>
                  <h3 className="font-head font-bold text-navy">AY {r.ay}</h3>
                  <p className="text-xs font-body text-gray-400">{r.type} · Filed {r.filedOn}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Refund</p>
                  <p className="font-head font-bold text-navy">{r.refund}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {r.status === 'Verified' ? (
                    <Clock size={14} className="text-amber-500" />
                  ) : (
                    <CheckCircle size={14} className="text-accent" />
                  )}
                  <span className={`text-xs font-semibold ${r.status === 'Verified' ? 'text-amber-600' : 'text-accent'}`}>
                    {r.status}
                  </span>
                </div>
                <button className="text-navy hover:text-accent transition-colors">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
