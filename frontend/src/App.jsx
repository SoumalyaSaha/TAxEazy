import { useState } from 'react'
import { MessageSquare, FileText, History, Settings } from 'lucide-react'
import AIChatSection from './components/AIChatSection'
import DocumentsView from './components/DocumentsView'
import ReturnsHistory from './components/ReturnsHistory'
import Preferences from './components/Preferences'

const NAV = {
  en: [
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'returns', label: 'Returns', icon: History },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ],
  hi: [
    { id: 'assistant', label: 'AI सहायक', icon: MessageSquare },
    { id: 'documents', label: 'दस्तावेज़', icon: FileText },
    { id: 'returns', label: 'रिटर्न', icon: History },
    { id: 'preferences', label: 'प्राथमिकताएं', icon: Settings },
  ],
}

export default function App() {
  const [activeTab, setActiveTab] = useState('assistant')
  const [lang, setLang] = useState('en')

  const navItems = NAV[lang]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f9f9f9]">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-navy text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-head text-xl font-bold tracking-tight">
            {lang === 'en' ? 'Tax Portal' : 'कर पोर्टल'}
          </h1>
          <p className="text-[11px] text-white/50 mt-1 font-body">
            {lang === 'en' ? 'AI-Assisted ITR Filing' : 'AI-सहायता प्राप्त ITR दाखिल'}
          </p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left text-sm font-body transition-colors ${
                  active ? 'bg-white/10 border-l-2 border-accent' : 'hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={active ? 'text-accent' : 'text-white/60'} />
                <span className={active ? 'text-white' : 'text-white/70'}>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
              RS
            </div>
            <div>
              <p className="text-xs font-body text-white/90">Rahul Sharma</p>
              <p className="text-[10px] text-white/50 font-body">ABCDE1234F</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden">
        {activeTab === 'assistant' && <AIChatSection lang={lang} />}
        {activeTab === 'documents' && <DocumentsView lang={lang} />}
        {activeTab === 'returns' && <ReturnsHistory lang={lang} />}
        {activeTab === 'preferences' && <Preferences lang={lang} setLang={setLang} />}
      </main>
    </div>
  )
}
