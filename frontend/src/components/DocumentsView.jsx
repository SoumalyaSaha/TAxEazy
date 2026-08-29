import { useState, useRef } from 'react'
import { FileCheck, BadgeCheck, CloudUpload, CheckCircle2, X, File } from 'lucide-react'

export default function DocumentsView({ lang = 'en' }) {
  const [bankFile, setBankFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const fileInputRef = useRef(null)

  const t = {
    en: {
      title: 'Documents',
      subtitle: 'Manage your identity and tax documents',
      aadhaar: 'Aadhaar Card', linked: 'Linked', name: 'Name', status: 'Status',
      verified: 'Verified ✓', lastUpdated: 'Last Updated', aadhaarNo: 'Aadhaar No.',
      form16: 'Form 16', preFilled: 'Pre-filled', employer: 'Employer',
      panEmp: 'PAN (Emp)', fy: 'FY', grossSalary: 'Gross Salary', tds: 'TDS Deducted',
      pan: 'PAN Card', active: 'Active', holder: 'Holder', type: 'Type',
      validated: 'Validated ✓', panLabel: 'PAN',
      uploadTitle: 'Upload Bank Statement',
      uploadSub: 'PDF / JPG up to 5MB',
      uploadBtn: 'Choose File',
      uploading: 'Uploading…',
      uploadDone: 'Uploaded Successfully!',
      remove: 'Remove',
    },
    hi: {
      title: 'दस्तावेज़',
      subtitle: 'अपनी पहचान और कर दस्तावेज़ प्रबंधित करें',
      aadhaar: 'आधार कार्ड', linked: 'जुड़ा हुआ', name: 'नाम', status: 'स्थिति',
      verified: 'सत्यापित ✓', lastUpdated: 'अंतिम अपडेट', aadhaarNo: 'आधार नं.',
      form16: 'फॉर्म 16', preFilled: 'पूर्व-भरा', employer: 'नियोक्ता',
      panEmp: 'पैन (नियोक्ता)', fy: 'वित्तीय वर्ष', grossSalary: 'सकल वेतन', tds: 'काटा गया TDS',
      pan: 'पैन कार्ड', active: 'सक्रिय', holder: 'धारक', type: 'प्रकार',
      validated: 'मान्य ✓', panLabel: 'पैन',
      uploadTitle: 'बैंक स्टेटमेंट अपलोड करें',
      uploadSub: 'PDF / JPG 5MB तक',
      uploadBtn: 'फ़ाइल चुनें',
      uploading: 'अपलोड हो रहा है…',
      uploadDone: 'सफलतापूर्वक अपलोड!',
      remove: 'हटाएं',
    },
  }[lang]

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be under 5MB')
      return
    }
    setBankFile(file)
    setUploading(true)
    setUploaded(false)
    // Simulate upload
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
    }, 1500)
  }

  function handleRemove() {
    setBankFile(null)
    setUploaded(false)
    setUploading(false)
    fileInputRef.current.value = ''
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f9] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-head text-2xl font-bold text-navy mb-1">{t.title}</h2>
        <p className="text-sm font-body text-gray-400 mb-6">{t.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Aadhaar Card */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BadgeCheck size={20} className="text-accent" />
                <h3 className="font-head font-bold text-navy">{t.aadhaar}</h3>
              </div>
              <span className="text-[11px] font-semibold bg-green-50 text-accent px-2 py-1 rounded-full">{t.linked}</span>
            </div>
            <div className="space-y-2 font-body text-sm">
              <Row label={t.aadhaarNo} value="XXXX XXXX 9876" mono />
              <Row label={t.name} value="Rahul Sharma" />
              <Row label={t.status} value={t.verified} />
              <Row label={t.lastUpdated} value="12 Mar 2026" />
            </div>
          </div>

          {/* Form 16 */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCheck size={20} className="text-navy" />
                <h3 className="font-head font-bold text-navy">{t.form16}</h3>
              </div>
              <span className="text-[11px] font-semibold bg-blue-50 text-navy px-2 py-1 rounded-full">{t.preFilled}</span>
            </div>
            <div className="space-y-2 font-body text-sm">
              <Row label={t.employer} value="Infosys Ltd." />
              <Row label={t.panEmp} value="AABCI1234C" mono />
              <Row label={t.fy} value="2025-26" />
              <Row label={t.grossSalary} value="₹ 12,00,000" />
              <Row label={t.tds} value="₹ 80,000" />
            </div>
          </div>

          {/* PAN Card */}
          <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BadgeCheck size={20} className="text-accent" />
                <h3 className="font-head font-bold text-navy">{t.pan}</h3>
              </div>
              <span className="text-[11px] font-semibold bg-green-50 text-accent px-2 py-1 rounded-full">{t.active}</span>
            </div>
            <div className="space-y-2 font-body text-sm">
              <Row label={t.panLabel} value="ABCDE1234F" mono />
              <Row label={t.holder} value="Rahul Sharma" />
              <Row label={t.type} value="Individual" />
              <Row label={t.status} value={t.validated} />
            </div>
          </div>

          {/* Bank Statement Upload */}
          <div
            onClick={() => !bankFile && fileInputRef.current.click()}
            className={`bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center gap-2
              ${uploaded ? 'border-accent bg-green-50' : 'border-gray-200 hover:border-navy cursor-pointer hover:bg-gray-50'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            {!bankFile && !uploading && (
              <>
                <CloudUpload size={32} className="text-gray-300" />
                <p className="font-body text-sm font-semibold text-gray-600">{t.uploadTitle}</p>
                <p className="text-xs text-gray-400">{t.uploadSub}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current.click() }}
                  className="mt-2 px-4 py-1.5 bg-navy text-white text-xs rounded-lg font-semibold hover:bg-navy/90 transition-colors"
                >
                  {t.uploadBtn}
                </button>
              </>
            )}

            {uploading && (
              <>
                <div className="w-8 h-8 border-4 border-navy border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-navy font-semibold">{t.uploading}</p>
              </>
            )}

            {uploaded && bankFile && (
              <>
                <CheckCircle2 size={32} className="text-accent" />
                <p className="text-sm font-semibold text-accent">{t.uploadDone}</p>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 mt-1">
                  <File size={14} className="text-navy" />
                  <span className="text-xs text-navy font-body truncate max-w-[140px]">{bankFile.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove() }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  <X size={12} /> {t.remove}
                </button>
              </>
            )}
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
