import React, { useState } from 'react'
import { Bookmark, Calendar, Lock, ShieldCheck, PhoneCall, CheckCircle2, User, Key } from 'lucide-react'

export function App() {
  const [activeTab, setActiveTab] = useState<'vault' | 'tours' | 'offmarket'>('vault')

  const savedEstates = [
    {
      id: '1',
      title: 'The Solitaire Sky Villa',
      location: 'Bandra West, Mumbai',
      price: '₹28.50 Cr',
      specs: '4 Beds · 4 Baths · 5,800 sq ft',
      status: 'Available for Tour',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    },
    {
      id: '2',
      title: 'Casa de Assagao Villa',
      location: 'Assagao, North Goa',
      price: '₹14.20 Cr',
      specs: '5 Beds · 5 Baths · 6,200 sq ft',
      status: 'Off-Market Access',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    },
  ]

  const scheduledTours = [
    {
      id: 't-1',
      estate: 'The Solitaire Sky Villa',
      date: 'Aug 26, 2026',
      time: '11:00 AM IST',
      advisor: 'Vikramaditya Singhania',
      status: 'Confirmed',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between">
      {/* Header Bar */}
      <header className="border-b border-white/10 bg-[#121212] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gold-300 text-black flex items-center justify-center font-bold text-xs">
            AV
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-300 font-bold block">
              AURA VÉLOCE
            </span>
            <h1 className="text-sm font-semibold text-white">Client Private Vault</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs">
            <User className="w-3.5 h-3.5 text-gold-300" />
            <span>Vikramaditya S.</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-1 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'vault'
                ? 'bg-gold-300 text-black border-gold-300 shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
            }`}
          >
            Saved Vault ({savedEstates.length})
          </button>

          <button
            onClick={() => setActiveTab('tours')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'tours'
                ? 'bg-gold-300 text-black border-gold-300 shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
            }`}
          >
            Private Tours ({scheduledTours.length})
          </button>

          <button
            onClick={() => setActiveTab('offmarket')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === 'offmarket'
                ? 'bg-gold-300 text-black border-gold-300 shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30'
            }`}
          >
            Off-Market Access (NDA)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedEstates.map((est) => (
              <div key={est.id} className="bg-[#121212] border border-white/10 p-5 space-y-4">
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/10">
                  <img src={est.img} alt={est.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 text-[10px] font-bold text-gold-300 uppercase tracking-wider">
                    {est.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xl font-bold font-sans text-white block">{est.price}</span>
                  <h3 className="text-lg font-serif text-white">{est.title}</h3>
                  <p className="text-xs text-white/60">{est.location}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-white/70">{est.specs}</span>
                  <button className="px-3 py-1.5 bg-gold-300 text-black font-bold uppercase text-[10px]">
                    Schedule Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tours' && (
          <div className="space-y-4">
            {scheduledTours.map((t) => (
              <div key={t.id} className="bg-[#121212] border border-white/10 p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                    {t.status}
                  </span>
                  <h4 className="text-lg font-serif text-white">{t.estate}</h4>
                  <p className="text-xs text-white/60">Assigned Advisor: {t.advisor}</p>
                </div>

                <div className="text-right space-y-1 font-mono text-xs text-white/80">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-gold-300" />
                    <span>{t.date}</span>
                  </div>
                  <span className="text-gold-300 font-bold block">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'offmarket' && (
          <div className="bg-[#121212] border border-white/10 p-8 text-center space-y-4">
            <Lock className="w-10 h-10 text-gold-300 mx-auto" />
            <h3 className="text-2xl font-serif text-white">Confidential Off-Market Access</h3>
            <p className="text-xs text-white/70 max-w-md mx-auto">
              You are cleared for level-2 NDA access. Contact your senior estate manager to unlock unlisted penthouses in Bandra & Worli.
            </p>
            <button className="px-6 py-3 bg-gold-300 text-black font-bold uppercase text-xs tracking-widest">
              Request Vault Key
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40 font-light">
        Aura Véloce Client Vault · Shared API Integration Mode
      </footer>
    </div>
  )
}
export default App
