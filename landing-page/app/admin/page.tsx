'use client'

import * as React from 'react'
import { Save, LayoutDashboard, Settings, Activity, Building2, Users, MapPin, IndianRupee, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getApiBaseUrl } from '@/utils/api'

export default function AdminStatsPanel() {
  const [stats, setStats] = React.useState({
    projectsCount: '',
    advisorsCount: '',
    locationsCount: '',
    revenue: ''
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [message, setMessage] = React.useState({ type: '', text: '' })

  React.useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const baseUrl = getApiBaseUrl()
      const res = await fetch(`${baseUrl}/public/frontend-stats`)
      if (res.ok) {
        const data = await res.json()
        setStats({
          projectsCount: data.projectsCount || '',
          advisorsCount: data.advisorsCount || '',
          locationsCount: data.locationsCount || '',
          revenue: data.revenue || ''
        })
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
      setMessage({ type: 'error', text: 'Failed to connect to backend API.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const baseUrl = getApiBaseUrl()
      // Making a POST request to update the stats
      const res = await fetch(`${baseUrl}/admin/frontend-stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Add if using auth
        },
        body: JSON.stringify(stats)
      })
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Homepage stats updated successfully!' })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving:', error)
      setMessage({ type: 'error', text: 'Backend endpoint /admin/frontend-stats is not ready yet. Please ensure your backend is running and accepts this POST request.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <div className="w-64 bg-brand-dark text-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-bold tracking-wider">H&S Admin</span>
        </div>
        
        <nav className="space-y-2 text-sm font-medium">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl transition-colors">
            <Activity className="w-4 h-4" />
            Homepage Stats
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors w-full text-left cursor-not-allowed">
            <Settings className="w-4 h-4" />
            Site Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10">
        <div className="max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-serif font-bold text-brand-charcoal">Manage Homepage Statistics</h1>
            <p className="text-sm text-brand-charcoal/60 mt-1">Update the four dynamic metric blocks displayed on the main landing page.</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-brand-green">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSave} noValidate className="space-y-6">
                
                {/* Stat 1 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-green" /> Township Developments
                  </label>
                  <p className="text-[11px] text-gray-400">Default fallback: &apos;6 Projects&apos; (auto-counts if empty)</p>
                  <input
                    type="text"
                    value={stats.projectsCount}
                    onChange={e => setStats({...stats, projectsCount: e.target.value})}
                    placeholder="e.g. 12 Projects"
                    className="input-base"
                  />
                </div>

                {/* Stat 2 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-green" /> Community Advisors
                  </label>
                  <p className="text-[11px] text-gray-400">Default fallback: &apos;45+ Team&apos;</p>
                  <input
                    type="text"
                    value={stats.advisorsCount}
                    onChange={e => setStats({...stats, advisorsCount: e.target.value})}
                    placeholder="e.g. 50+ Team"
                    className="input-base"
                  />
                </div>

                {/* Stat 3 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-green" /> Prime Locations
                  </label>
                  <p className="text-[11px] text-gray-400">Default fallback: &apos;6 Enclaves&apos;</p>
                  <input
                    type="text"
                    value={stats.locationsCount}
                    onChange={e => setStats({...stats, locationsCount: e.target.value})}
                    placeholder="e.g. 8 Enclaves"
                    className="input-base"
                  />
                </div>

                {/* Stat 4 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-brand-green" /> Demarcated Land Manifest
                  </label>
                  <p className="text-[11px] text-gray-400">Default fallback: &apos;₹1,200 Cr+&apos;</p>
                  <input
                    type="text"
                    value={stats.revenue}
                    onChange={e => setStats({...stats, revenue: e.target.value})}
                    placeholder="e.g. ₹1,500 Cr+"
                    className="input-base"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="hs-btn-primary"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
