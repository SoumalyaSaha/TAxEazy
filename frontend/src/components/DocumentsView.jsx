import { FileCheck, Link2, BadgeCheck, CloudUpload } from 'lucide-react'

export default function DocumentsView() {
  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f9] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-head text-2xl font-bold text-navy mb-1">Documents</h2>
        <p className="text-sm font-body text-gray-400 mb-6">Manage your identity and tax documents</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Aadhaar Card */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BadgeCheck size={20} className="text-accent" />
                <h3 className="font-head font-bold text-navy">Aadhaar Card</h3>
              </div>
              <span className="text-[11px] font-semibold bg-green-50 text-accent px-2 py-1 rounded-full">Linked</span>
            </div>
            <div className="space-y-2 font-body text-sm">
              <Row label="Aadhaar No." value="XXXX XXXX 9876" mono />
              <Row label="Name" value="Rahul Sharma" />
              <Row label="Status" value="Verified ✓" />
              <Row label="Last Updated" value="12 Mar 2026" />
            </div>
          </div>

          {/* Form 16 */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCheck size={20} className="text-navy" />
                <h3 className="font-head font-bold text-navy">Form 16</h3>
              </div>
              <span className="text-[11px] font-semibold bg-blue-50 text-navy px-2 py-1 rounded-full">Pre-filled</span>
            </div>
            <div className="space-y-2 font-body text-sm">
              <Row label="Employer" value="Infosys Ltd." />
              <Row label="PAN (Emp)" value="AABCI1234C" mono />
              <Row label="FY" value="2025-26" />
              <Row label="Gross Salary" value="₹ 12,00,000" />
              <Row label="TDS Deducted" value="₹ 80,000" />
            </div>
          </div>

          {/* PAN Card */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BadgeCheck size={20} className="text-accent" />
                <h3 className="font-head font-bold text-navy">PAN Card</h3>
              </div>
              <span className="text-[11px] font-semibold bg-green-50 text-accent px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="space-y-2 font-body text-sm">
              <Row label="PAN" value="ABCDE1234F" mono />
              <Row label="Holder" value="Rahul Sharma" />
              <Row label="Type" value="Individual" />
              <Row label="Status" value="Validated ✓" />
            </div>
          </div>

          {/* Upload New */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <CloudUpload size={32} className="text-gray-300 mb-2" />
            <p className="font-body text-sm text-gray-500">Upload Bank Statement</p>
            <p className="text-xs text-gray-400 mt-1">PDF / JPG up to 5MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-50 pb-1">
      <span className="text-gray-500 text-[13px]">{label}</span>
      <span className={`text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}