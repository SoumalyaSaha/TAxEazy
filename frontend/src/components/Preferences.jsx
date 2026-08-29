import { Globe, Key, Bell, Save, CreditCard } from 'lucide-react'
import { useState } from 'react'

export default function Preferences() {
  const [lang, setLang] = useState('en')
  const [notifications, setNotifications] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f9f9f9] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="font-head text-2xl font-bold text-navy mb-1">Preferences</h2>
          <p className="text-sm font-body text-gray-400">Customize your portal experience</p>
        </div>

        {/* Language */}
        <div className="bg-white rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-navy" />
            <h3 className="font-head font-bold text-navy">Language & Region</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLang('en')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                lang === 'en'
                  ? 'border-navy bg-navy/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-body font-semibold text-navy">English</p>
              <p className="text-xs text-gray-400 mt-1">Primary language</p>
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                lang === 'hi'
                  ? 'border-navy bg-navy/5'
                  : 'border-gray-200 hover:border-gray-300'
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
            <h3 className="font-head font-bold text-navy">Notifications</h3>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-body text-sm text-navy">Email & Push Alerts</p>
              <p className="text-xs text-gray-400">Filing deadlines, refund updates, and reminders</p>
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
            <h3 className="font-head font-bold text-navy">Security</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="font-body text-sm text-navy">Change Password</span>
              <Key size={16} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="font-body text-sm text-navy">Two-Factor Authentication</span>
              <CreditCard size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-navy hover:bg-navy/90 text-white py-3 rounded-xl font-body font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}