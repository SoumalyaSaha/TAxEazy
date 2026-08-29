import { FileText, CheckCircle, AlertCircle } from 'lucide-react'

// SmartForm — standalone form view for manual ITR editing
export default function SmartForm() {
  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f9] p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-8">
        <div className="flex items-center gap-2 mb-6">
          <FileText size={20} className="text-navy" />
          <h2 className="font-head text-2xl font-bold text-navy">Smart ITR Form</h2>
        </div>

        <div className="space-y-5 font-body">
          <div>
            <label className="block text-[13px] font-semibold text-gray-500 mb-1">Full Name</label>
            <input
              defaultValue="Rahul Sharma"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-500 mb-1">PAN</label>
            <input
              defaultValue="ABCDE1234F"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:border-navy focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-gray-500 mb-1">Gross Salary (₹)</label>
            <input
              defaultValue="1200000"
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={16} className="text-accent" />
            <span className="text-xs font-body text-accent">Aadhaar linked successfully</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
            <AlertCircle size={16} className="text-amber-600" />
            <span className="text-xs font-body text-amber-700">Form 16 pending bank verification</span>
          </div>
        </div>
      </div>
    </div>
  )
}