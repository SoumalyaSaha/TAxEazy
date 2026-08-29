import { Globe, Key, Bell, Save, CreditCard } from 'lucide-react'
import { useState } from 'react'

export default function Preferences({ lang, setLang }) {
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const t = {
    en: {
      title: 'Preferences', subtitle: 'Customize your portal experience',
      langTitle: 'Language & Region',
      notifTitle: 'Notifications', notifLabel: 'Email & Push Alerts',
      notifSub: 'Filing deadlines, refund updates, and reminders',
      secTitle: 'Security', changePass: 'Change Password', twoFa: 'Two-Factor Authentication',
      save: 'Save Preferences', saved: 'Saved!',
    },
    hi: {
      title: 'प्राथमिकताएं', subtitle: 'अपना पोर्टल अनुभव कस्टमाइज़ करें',
      langTitle: 'भाषा और क्षेत्र',
      notifTitle: 'सूचनाएं', notifLabel: 'ईमेल और पुश अलर्ट',
      notifSub: 'फाइलिंग समय-सीमा, रिफंड अपडेट और रिमाइंडर',
      secTitle: 'सुरक्षा', changePass: 'पासवर्ड बदलें', twoFa: 'दो-कारक प्रमाणीकरण',
      save: 'प्राथमिकताएं सहेजें', saved: 'सहेजा गया!',
    },
  }[lang]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f9] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="font-head text-2xl font-bold text-navy mb-1">{t.title}</h2>
          <p className="text-sm font-body text-gray-400">{t.subtitle}</p>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-navy" />
            <h3 className="font-head font-bold text-navy">{t.langTitle}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLang('en')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                lang === 'en' ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-body font-semibold text-navy">English</p>
              <p className="text-xs text-gray-400 mt-1">Primary language</p>
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                lang === 'hi' ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-body font-semibold text-navy">हिंदी (Hindi)</p>
              <p className="text-xs text-gray-400 mt-1">प्राथमिक भाषा</p>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-navy" />
            <h3 className="font-head font-bold text-navy">{t.notifTitle}</h3>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-body text-sm text-navy">{t.notifLabel}</p>
              <p className="text-xs text-gray-400">{t.notifSub}</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 rounded border-navy text-accent focus:ring-accent accent-accent"
            />
          </label>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key size={20} className="text-navy" />
            <h3 className="font-head font-bold text-navy">{t.secTitle}</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="font-body text-sm text-navy">{t.changePass}</span>
              <Key size={16} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="font-body text-sm text-navy">{t.twoFa}</span>
              <CreditCard size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-navy hover:bg-navy/90 text-white py-3 rounded-xl font-body font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {saved ? t.saved : t.save}
        </button>
      </div>
    </div>
  )
}
