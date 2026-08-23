import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Home,
  CreditCard,
  UserCheck,
  Bookmark,
  MessageSquare,
  FileText,
  User,
  Settings,
  ShieldCheck,
  Building,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Lock,
  Download,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  LogOut,
  KeyRound,
  RefreshCw,
  X,
  FileSpreadsheet,
  Award,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react'

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)
  const [loginEmail, setLoginEmail] = useState<string>('')
  const [loginPassword, setLoginPassword] = useState<string>('')
  const [isLoadingBackend, setIsLoadingBackend] = useState<boolean>(false)
  const [selectedLandDossier, setSelectedLandDossier] = useState<any | null>(null)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false)
  const [forgotEmail, setForgotEmail] = useState<string>('')
  const [forgotMessage, setForgotMessage] = useState<string>('')

  const [activeSection, setActiveSection] = useState<
    'overview' | 'properties' | 'transactions' | 'agents' | 'saved' | 'inquiries' | 'documents' | 'profile' | 'settings'
  >('overview')

  const [propertySubTab, setPropertySubTab] = useState<'owned' | 'process' | 'history'>('owned')

  const userCustomer = {
    fullName: loginEmail ? loginEmail.split('@')[0].toUpperCase() : 'VIKRAMADITYA SINGHANIA',
    email: loginEmail || 'vikramaditya@singhania.com',
    phone: '+91 98200 11223',
    city: 'Mumbai, India',
    tier: 'Platinum Private Client',
    totalPortfolioValue: '₹42.70 Cr',
    ownedCount: 1,
    bookingCount: 1,
  }

  const defaultMilestones = [
    { title: '1st Token Booking Advance', amount: '₹5.00 Cr', dueDate: 'Aug 14, 2026', status: 'RECEIVED', paymentMode: 'Net Banking' },
    { title: '2nd Demarcation Installment', amount: '₹4.20 Cr', dueDate: 'Sep 15, 2026', status: 'PENDING', paymentMode: 'RTGS Wire' },
    { title: 'Final Registry & Conveyance Settlement', amount: '₹5.00 Cr', dueDate: 'Oct 30, 2026', status: 'PENDING', paymentMode: 'Bank Cheque' },
  ]

  const [ownedProperties, setOwnedProperties] = useState([
    {
      id: 'est-1',
      plotNo: 'E5-104',
      block: 'Sector E5',
      title: 'The Solitaire Sky Villa — Land Plot E5-104',
      location: 'Bandra West, Mumbai',
      purchasePrice: '₹28.50 Cr',
      paidAmount: '₹28.50 Cr',
      dueBalance: '₹0.00',
      status: 'OWNED',
      purchaseType: 'AGENT_ASSISTED',
      agentName: 'Kabir Merchant',
      agentPhone: '+91 98201 44556',
      agentEmail: 'kabir.m@houseandsky.com',
      purchaseDate: 'Aug 14, 2026',
      transactionId: 'TXN-884920',
      specs: '201.28 Sellable Sq Yrd · 104.48 Carpet Sq Yrd',
      sellableSqYrd: '201.28',
      carpetSqYrd: '104.48',
      surveyNo: 'MH-BND-448/2B',
      plc12m: 'Yes (12 Meter Main Boulevard)',
      plcCorner: 'Yes (Corner Facing)',
      plcPark: 'Yes (Central Park View)',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      registryStatus: 'REGISTERED & TITLE CONVEYED',
      milestones: [
        { title: '1st Token Booking Advance', amount: '₹10.00 Cr', dueDate: 'Aug 01, 2026', status: 'RECEIVED', paymentMode: 'RTGS Wire' },
        { title: '2nd Demarcation Installment', amount: '₹18.50 Cr', dueDate: 'Aug 14, 2026', status: 'RECEIVED', paymentMode: 'Bank Cheque' },
      ]
    },
  ])

  const [processProperties, setProcessProperties] = useState([
    {
      id: 'est-2',
      plotNo: 'GA-208',
      block: 'Assagao Enclave',
      title: 'Casa de Assagao Land Plot GA-208',
      location: 'Assagao, North Goa',
      purchasePrice: '₹14.20 Cr',
      paidAmount: '₹5.00 Cr',
      dueBalance: '₹9.20 Cr',
      status: 'UNDER_PROCESS',
      purchaseType: 'DIRECT',
      agentName: null,
      purchaseDate: 'Aug 20, 2026',
      transactionId: 'TXN-912048',
      specs: '310.50 Sellable Sq Yrd · 185.20 Carpet Sq Yrd',
      sellableSqYrd: '310.50',
      carpetSqYrd: '185.20',
      surveyNo: 'GA-ASG-102/4A',
      plc12m: 'Yes (9 Meter Road Access)',
      plcCorner: 'Standard Facing',
      plcPark: 'Garden Facing',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      registryStatus: 'PENDING REGISTRATION SCHEDULE',
      milestones: defaultMilestones
    },
  ])

  const [transactionsLedger, setTransactionsLedger] = useState([
    {
      id: 'tx-1',
      transactionId: 'TXN-884920',
      estate: 'The Solitaire Sky Villa — Land Plot E5-104',
      amount: '₹28.50 Cr',
      paymentMode: 'Bank Wire (RTGS)',
      date: 'Aug 14, 2026',
      status: 'SUCCESS',
      type: 'Full Land Settlement',
    },
    {
      id: 'tx-2',
      transactionId: 'TXN-912048',
      estate: 'Casa de Assagao Land Plot GA-208',
      amount: '₹5.00 Cr',
      paymentMode: 'Net Banking',
      date: 'Aug 20, 2026',
      status: 'SUCCESS',
      type: 'Booking Token Advance',
    },
  ])

  useEffect(() => {
    if (loginEmail) {
      fetchBackendUserData()
    }
  }, [loginEmail])

  const fetchBackendUserData = async () => {
    try {
      setIsLoadingBackend(true)
      const res = await fetch(`/api/user/my-properties?email=${encodeURIComponent(loginEmail || 'vikramaditya@singhania.com')}`)
      if (res.ok) {
        const data = await res.json()
        if (data.plots && data.plots.length > 0) {
          const apiOwned: any[] = []
          const apiProcess: any[] = []

          data.plots.forEach((p: any, idx: number) => {
            const sellable = p.sellableSqYrd || (p.sizeSqft ? (p.sizeSqft / 9).toFixed(2) : '201.28')
            const carpet = p.carpetSqYrd || (p.sizeSqft ? (p.sizeSqft / 18).toFixed(2) : '104.48')
            
            const milestonesList = p.paymentMilestones && p.paymentMilestones.length > 0 
              ? p.paymentMilestones.map((m: any) => ({
                  title: m.title || 'Installment Milestone',
                  amount: `₹${(m.amount || 0).toLocaleString('en-IN')}`,
                  dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'Pending',
                  status: m.status || 'PENDING',
                  paymentMode: m.paymentMode || 'Net Banking'
                }))
              : defaultMilestones

            const item = {
              id: p._id || `api-plot-${idx}`,
              plotNo: p.plotNo || `E5-${idx + 101}`,
              block: p.block || 'Main Sector',
              title: p.plotNo ? `Land Plot ${p.plotNo} — ${p.block || 'Main Sector'}` : 'House & Sky Land Asset',
              location: p.projectId ? (p.projectId.location || p.projectId.name) : 'Bandra West, Mumbai',
              purchasePrice: `₹${(p.totalCost || p.price || 1367510).toLocaleString('en-IN')}`,
              paidAmount: `₹${(p.paidAmount || 0).toLocaleString('en-IN')}`,
              dueBalance: `₹${(p.dueBalance || 0).toLocaleString('en-IN')}`,
              status: p.status === 'SOLD' ? 'OWNED' : 'UNDER_PROCESS',
              purchaseType: p.sellerEmployeeId ? 'AGENT_ASSISTED' : 'DIRECT',
              agentName: p.sellerEmployeeId ? (p.sellerEmployeeId.employeeCode || 'Senior Advisor') : null,
              purchaseDate: p.bookingDate ? new Date(p.bookingDate).toLocaleDateString() : 'Aug 14, 2026',
              transactionId: `TXN-${(p._id || '999').slice(-6).toUpperCase()}`,
              specs: `${sellable} Sellable Sq Yrd · ${carpet} Carpet Sq Yrd`,
              sellableSqYrd: sellable,
              carpetSqYrd: carpet,
              surveyNo: `MH-BND-${Math.floor(100 + Math.random() * 800)}/4`,
              plc12m: p.plc12mtr ? `₹${p.plc12mtr} PLC` : '12 Meter Access Road',
              plcCorner: p.plcCorner ? 'Corner Facing' : 'Standard Facing',
              plcPark: p.plcParkFacing ? 'Park View' : 'East Facing',
              img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
              registryStatus: p.registryStatus || (p.status === 'SOLD' ? 'REGISTERED & TITLE CONVEYED' : 'PENDING REGISTRATION SCHEDULE'),
              milestones: milestonesList
            }
            if (p.status === 'SOLD') apiOwned.push(item)
            else apiProcess.push(item)
          })

          if (apiOwned.length > 0) setOwnedProperties(apiOwned)
          if (apiProcess.length > 0) setProcessProperties(apiProcess)
        }

        if (data.transactions && data.transactions.length > 0) {
          const apiTx = data.transactions.map((tx: any, idx: number) => ({
            id: tx._id || `tx-api-${idx}`,
            transactionId: `TXN-${(tx._id || '884').slice(-6).toUpperCase()}`,
            estate: tx.plotId ? `Land Plot ${tx.plotId.plotNo || 'Asset'}` : 'House & Sky Land Plot',
            amount: `₹${(tx.amount || 0).toLocaleString('en-IN')}`,
            paymentMode: tx.paymentMode || 'Net Banking',
            date: new Date(tx.transactionDate || Date.now()).toLocaleDateString(),
            status: tx.status === 'COMPLETED' ? 'SUCCESS' : tx.status,
            type: tx.sellerEmployeeId ? 'Agent-Assisted Sale' : 'Direct Customer Purchase',
          }))
          setTransactionsLedger(apiTx)
        }
      }
    } catch (e) {
      console.log('Backend sync fallback', e)
    } finally {
      setIsLoadingBackend(false)
    }
  }

  const savedVault = [
    {
      id: 's-1',
      title: 'Golf Course Credenza Land Plot',
      location: 'Golf Course Road, Gurgaon',
      price: '₹18.40 Cr',
      specs: '450 Sellable Sq Yrd · Sector 54',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    },
  ]

  const inquiries = [
    {
      id: 'inq-1',
      title: 'Site Visit — Golf Course Credenza Land Plot',
      date: 'Aug 28, 2026 at 03:00 PM IST',
      advisor: 'Natasha Roy',
      status: 'Confirmed',
    },
  ]

  const documents = [
    { id: 'doc-1', name: 'Deed of Conveyance — Land Plot E5-104.pdf', date: 'Aug 15, 2026', size: '4.2 MB' },
    { id: 'doc-2', name: 'Land Plot Allotment & Demarcation Certificate.pdf', date: 'Aug 21, 2026', size: '2.8 MB' },
    { id: 'doc-3', name: '7/12 Extract & Legal Lineage Certificate.pdf', date: 'Aug 12, 2026', size: '6.1 MB' },
  ]

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'My Properties', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'agents', label: 'My Agents', icon: UserCheck },
    { id: 'saved', label: 'Saved Properties', icon: Bookmark },
    { id: 'inquiries', label: 'Inquiries & Requests', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  const handleAutoFillDemo = () => {
    setLoginEmail('vikramaditya@singhania.com')
    setLoginPassword('Password123!')
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      const data = await res.json()
      setForgotMessage(data.message || 'Reset instructions sent!')
    } catch (e) {
      setForgotMessage('If account exists, password reset link has been dispatched.')
    }
  }

  // 1. RENDER LOGIN PAGE IF LOGGED OUT
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#171A18] flex flex-col justify-between font-sans">
        <header className="h-16 bg-white border-b border-[#0B4F3C]/15 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center font-bold text-xs shadow-md">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-[#171A18] tracking-tight leading-none">
                House & <span className="text-[#0B4F3C] italic font-serif">Sky</span>
              </h1>
              <p className="text-[9px] text-[#0B4F3C] font-bold tracking-widest uppercase mt-1">Client Private Vault</p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl border border-[#0B4F3C]/15 w-full max-w-md space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#0B4F3C] flex items-center justify-center mx-auto shadow-lg">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#171A18] tracking-tight">
                Client Vault Sign In
              </h2>
              <p className="text-xs text-[#171A18]/70">Enter your email and password to access your land plot holdings & title deeds</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#171A18]/70 font-semibold">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171A18]/50" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your customer email..."
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#171A18]/70 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-[11px] font-bold text-[#0B4F3C] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171A18]/50" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center cursor-pointer border border-[#0B4F3C]"
              >
                Sign In to Private Vault
              </button>

              <button
                type="button"
                onClick={handleAutoFillDemo}
                className="w-full py-2 bg-[#EAF3EF] text-[#0B4F3C] font-bold text-xs rounded-xl hover:bg-[#0B4F3C] hover:text-white transition-all cursor-pointer border border-[#0B4F3C]/20"
              >
                Auto-fill Demo Credentials
              </button>
            </form>
          </div>
        </main>

        {/* FORGOT PASSWORD MODAL */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#171A18]">Forgot Password Reset</h3>
                <button onClick={() => setShowForgotPasswordModal(false)} className="p-1 text-[#171A18]/60 hover:text-[#171A18]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotMessage ? (
                <div className="p-3 bg-[#EAF3EF] rounded-xl text-xs font-bold text-[#0B4F3C] text-center">
                  {forgotMessage}
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-[#171A18]/70">Enter your registered customer email to receive a password reset token.</p>
                  <div>
                    <label className="text-xs text-[#171A18]/70 font-semibold">Registered Email</label>
                    <input
                      type="email"
                      required
                      placeholder="customer@singhania.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl p-2.5 text-xs text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#0B4F3C] text-white font-bold text-xs rounded-xl shadow-md">
                    Send Password Reset Token
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <footer className="border-t border-[#0B4F3C]/15 py-4 text-center text-xs text-[#171A18]/60 font-light bg-white">
          House & Sky Client Vault · Enterprise Platform Mode
        </footer>
      </div>
    )
  }

  // 2. RENDER LOGGED IN PORTAL
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#171A18] flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-[#0B4F3C]/15 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center font-bold text-xs shadow-md">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#171A18] tracking-tight leading-none">
              House & <span className="text-[#0B4F3C] italic font-serif">Sky</span>
            </h1>
            <p className="text-[9px] text-[#0B4F3C] font-bold tracking-widest uppercase mt-1">Client Private Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={fetchBackendUserData}
            title="Sync with Express Backend API"
            className="p-2 text-[#0B4F3C] bg-[#EAF3EF] border border-[#0B4F3C]/20 rounded-lg hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingBackend ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center space-x-2 bg-[#EAF3EF] border border-[#0B4F3C]/20 px-3.5 py-1.5 rounded-full text-xs text-[#0B4F3C] font-bold">
            <User className="w-3.5 h-3.5 text-[#0B4F3C]" />
            <span>{userCustomer.fullName}</span>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            title="Log Out"
            className="p-2 text-[#171A18]/60 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full min-h-0 overflow-x-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-[#0B4F3C]/15 p-4 hidden md:flex flex-col justify-between shrink-0 shadow-sm">
          <nav className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#0B4F3C] px-3 py-2">
              PORTAL NAVIGATION
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#0B4F3C] text-white shadow-md'
                      : 'text-[#171A18]/80 hover:bg-[#EAF3EF] hover:text-[#0B4F3C]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          <div className="p-4 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/15 text-xs text-[#0B4F3C] space-y-1">
            <p className="font-bold">{userCustomer.tier}</p>
            <p className="text-[10px] text-[#171A18]/70">Verified Account · Level 2 NDA</p>
          </div>
        </aside>

        {/* Mobile Navigation Header Tabs */}
        <div className="md:hidden w-full bg-white border-b border-[#0B4F3C]/15 p-3 flex overflow-x-auto gap-2 shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg shrink-0 ${
                activeSection === item.id ? 'bg-[#0B4F3C] text-white' : 'bg-[#EAF3EF] text-[#0B4F3C]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content View Container */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto w-full min-w-0">
          {/* 1. OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#171A18]">Portfolio Executive Overview</h2>
                  <p className="text-xs text-[#171A18]/70">Real estate land plot holdings, pending bookings & financial ledger</p>
                </div>
                <span className="px-3 py-1 bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] font-bold text-xs rounded-full">
                  ● Express API Connected
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0B4F3C] tracking-wider block">TOTAL PORTFOLIO</span>
                  <span className="text-2xl font-serif font-bold text-[#171A18] block">{userCustomer.totalPortfolioValue}</span>
                  <span className="text-xs text-[#171A18]/70 font-mono">Combined Land Plot Value</span>
                </div>

                <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0B4F3C] tracking-wider block">OWNED LAND PLOTS</span>
                  <span className="text-2xl font-serif font-bold text-[#0B4F3C] block">{ownedProperties.length} Plot</span>
                  <span className="text-xs text-[#171A18]/70 font-mono">Title Conveyed & Registered</span>
                </div>

                <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0B4F3C] tracking-wider block">ACTIVE BOOKINGS</span>
                  <span className="text-2xl font-serif font-bold text-[#171A18] block">{processProperties.length} Plot</span>
                  <span className="text-xs text-[#171A18]/70 font-mono">Under Installment Process</span>
                </div>

                <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider block">OUTSTANDING DUES</span>
                  <span className="text-2xl font-serif font-bold text-red-600 block">₹9.20 Cr</span>
                  <span className="text-xs text-[#171A18]/70 font-mono">Scheduled Milestone Balance</span>
                </div>
              </div>

              {/* Owned & Under Process Summary Cards */}
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#171A18]">Active Land Plot Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownedProperties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedLandDossier(p)}
                      className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 space-y-4 shadow-sm cursor-pointer hover:border-[#0B4F3C]/40 transition-all group"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#0B4F3C]/15">
                        <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-[#0B4F3C] text-white text-[10px] font-bold uppercase rounded shadow-sm">
                          OWNED & REGISTERED
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xl font-bold font-sans text-[#0B4F3C] block">{p.purchasePrice}</span>
                        <h4 className="font-serif text-lg font-bold text-[#171A18] group-hover:text-[#0B4F3C] transition-colors">{p.title}</h4>
                        <p className="text-xs text-[#171A18]/70">{p.location} · {p.specs}</p>
                      </div>
                      <button className="w-full py-2 bg-[#EAF3EF] hover:bg-[#0B4F3C] hover:text-white text-[#0B4F3C] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 border border-[#0B4F3C]/20">
                        <span>Click to Open Land Dossier & Milestones</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {processProperties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedLandDossier(p)}
                      className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 space-y-4 shadow-sm cursor-pointer hover:border-[#0B4F3C]/40 transition-all group"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#0B4F3C]/15">
                        <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-[10px] font-bold uppercase rounded shadow-sm">
                          UNDER PROCESS (BOOKED)
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xl font-bold font-sans text-[#0B4F3C] block">{p.purchasePrice}</span>
                        <h4 className="font-serif text-lg font-bold text-[#171A18] group-hover:text-[#0B4F3C] transition-colors">{p.title}</h4>
                        <p className="text-xs text-[#171A18]/70">{p.location} · {p.specs}</p>
                      </div>
                      <button className="w-full py-2 bg-[#EAF3EF] hover:bg-[#0B4F3C] hover:text-white text-[#0B4F3C] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 border border-[#0B4F3C]/20">
                        <span>Click to Open Land Dossier & Milestones</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. MY PROPERTIES SECTION */}
          {activeSection === 'properties' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#171A18]">My Land Holdings</h2>
                  <p className="text-xs text-[#171A18]/70">Click any plot card to view survey certificates, part payment schedules & title dossier</p>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex items-center gap-2 border-b border-[#0B4F3C]/15 pb-3">
                <button
                  onClick={() => setPropertySubTab('owned')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md ${
                    propertySubTab === 'owned' ? 'bg-[#0B4F3C] text-white' : 'bg-[#EAF3EF] text-[#0B4F3C]'
                  }`}
                >
                  Owned ({ownedProperties.length})
                </button>

                <button
                  onClick={() => setPropertySubTab('process')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md ${
                    propertySubTab === 'process' ? 'bg-[#0B4F3C] text-white' : 'bg-[#EAF3EF] text-[#0B4F3C]'
                  }`}
                >
                  Under Process ({processProperties.length})
                </button>

                <button
                  onClick={() => setPropertySubTab('history')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md ${
                    propertySubTab === 'history' ? 'bg-[#0B4F3C] text-white' : 'bg-[#EAF3EF] text-[#0B4F3C]'
                  }`}
                >
                  Previous / Cancelled (0)
                </button>
              </div>

              {propertySubTab === 'owned' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownedProperties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedLandDossier(p)}
                      className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 space-y-4 shadow-sm cursor-pointer hover:border-[#0B4F3C]/40 transition-all group"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#0B4F3C]/15">
                        <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-[#0B4F3C] text-white text-[10px] font-bold uppercase rounded">
                          {p.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xl font-bold font-sans text-[#0B4F3C] block">{p.purchasePrice}</span>
                        <h3 className="font-serif text-lg font-bold text-[#171A18] group-hover:text-[#0B4F3C] transition-colors">{p.title}</h3>
                        <p className="text-xs text-[#171A18]/70">{p.location}</p>
                      </div>

                      <div className="p-3 bg-[#EAF3EF] rounded-lg border border-[#0B4F3C]/20 text-xs space-y-1">
                        <p className="flex items-center justify-between text-[#171A18]">
                          <span className="text-[#171A18]/70">Sales Relationship:</span>
                          <span className="font-bold text-[#0B4F3C]">Handled by {p.agentName}</span>
                        </p>
                        <p className="flex items-center justify-between text-[#171A18]">
                          <span className="text-[#171A18]/70">Registry Status:</span>
                          <span className="font-bold text-[#0B4F3C]">{p.registryStatus}</span>
                        </p>
                      </div>

                      <button className="w-full py-2 bg-[#0B4F3C] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm">
                        <span>View Part Payment Schedule & Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {propertySubTab === 'process' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {processProperties.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedLandDossier(p)}
                      className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 space-y-4 shadow-sm cursor-pointer hover:border-[#0B4F3C]/40 transition-all group"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#0B4F3C]/15">
                        <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-amber-600 text-white text-[10px] font-bold uppercase rounded">
                          {p.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xl font-bold font-sans text-[#0B4F3C] block">{p.purchasePrice}</span>
                        <h3 className="font-serif text-lg font-bold text-[#171A18] group-hover:text-[#0B4F3C] transition-colors">{p.title}</h3>
                        <p className="text-xs text-[#171A18]/70">{p.location}</p>
                      </div>

                      <div className="p-3 bg-[#EAF3EF] rounded-lg border border-[#0B4F3C]/20 text-xs space-y-1">
                        <p className="flex items-center justify-between text-[#171A18]">
                          <span className="text-[#171A18]/70">Sales Relationship:</span>
                          <span className="font-bold text-sky-700">Direct Purchase (No Agent)</span>
                        </p>
                        <p className="flex items-center justify-between text-[#171A18]">
                          <span className="text-[#171A18]/70">Due Balance:</span>
                          <span className="font-bold text-red-600">{p.dueBalance}</span>
                        </p>
                      </div>

                      <button className="w-full py-2 bg-[#0B4F3C] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm">
                        <span>View Part Payment Schedule & Dossier</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {propertySubTab === 'history' && (
                <div className="p-8 bg-white border border-[#0B4F3C]/15 rounded-xl text-center space-y-2">
                  <p className="text-xs text-[#171A18]/70">No previous or cancelled property transactions recorded.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. TRANSACTIONS SECTION */}
          {activeSection === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">Transactions & Part Payment Ledger</h2>
                <p className="text-xs text-[#171A18]/70">Verified payment receipts, bank settlements & installment schedules</p>
              </div>

              <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#0B4F3C]/15 text-[#171A18]/70 font-bold uppercase text-[10px]">
                        <th className="py-3 px-4">Txn ID</th>
                        <th className="py-3 px-4">Estate</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0B4F3C]/10">
                      {transactionsLedger.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#EAF3EF]/50">
                          <td className="py-3 px-4 font-mono font-bold text-[#0B4F3C]">{tx.transactionId}</td>
                          <td className="py-3 px-4 font-bold text-[#171A18]">{tx.estate}</td>
                          <td className="py-3 px-4 text-[#171A18]/70">{tx.type}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#0B4F3C]">{tx.amount}</td>
                          <td className="py-3 px-4 text-[#171A18]/70">{tx.paymentMode}</td>
                          <td className="py-3 px-4 font-mono text-[#171A18]/70">{tx.date}</td>
                          <td className="py-3 px-4">
                            <button className="px-2.5 py-1 bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] text-[10px] font-bold rounded flex items-center gap-1">
                              <Download className="w-3 h-3" /> Voucher
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. MY AGENTS SECTION */}
          {activeSection === 'agents' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">My Assigned Senior Advisors</h2>
                <p className="text-xs text-[#171A18]/70">Advisors who assisted your real estate land plot acquisitions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#0B4F3C] text-white flex items-center justify-center font-bold text-lg shadow-md">
                      KM
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#0B4F3C]">SENIOR ESTATE MANAGER</span>
                      <h3 className="font-serif font-bold text-lg text-[#171A18]">Kabir Merchant</h3>
                      <p className="text-xs text-[#171A18]/70">Bandra West & Worli Specialist</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#EAF3EF] rounded-lg border border-[#0B4F3C]/20 text-xs space-y-1">
                    <p className="flex items-center justify-between">
                      <span className="text-[#171A18]/70">Assisted Estate:</span>
                      <span className="font-bold text-[#0B4F3C]">The Solitaire Sky Villa</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-[#171A18]/70">Direct Line:</span>
                      <span className="font-bold text-[#171A18]">+91 98201 44556</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 space-y-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      HS
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-sky-700">DIRECT ACQUISITION DESK</span>
                      <h3 className="font-serif font-bold text-lg text-[#171A18]">House & Sky Corporate Advisory</h3>
                      <p className="text-xs text-[#171A18]/70">Direct Customer Purchase (No External Agent)</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#EAF3EF] rounded-lg border border-[#0B4F3C]/20 text-xs space-y-1">
                    <p className="flex items-center justify-between">
                      <span className="text-[#171A18]/70">Assisted Estate:</span>
                      <span className="font-bold text-[#0B4F3C]">Casa de Assagao Villa</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-[#171A18]/70">Support Email:</span>
                      <span className="font-bold text-[#171A18]">advisory@houseandsky.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. SAVED PROPERTIES SECTION */}
          {activeSection === 'saved' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">Saved Private Vault</h2>
                <p className="text-xs text-[#171A18]/70">Bookmarked land plots and confidential properties</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedVault.map((s) => (
                  <div key={s.id} className="bg-white border border-[#0B4F3C]/15 rounded-xl p-5 space-y-4 shadow-sm">
                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-[#0B4F3C]/15">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xl font-bold text-[#0B4F3C] font-sans">{s.price}</span>
                      <h3 className="font-serif text-lg font-bold text-[#171A18]">{s.title}</h3>
                      <p className="text-xs text-[#171A18]/70">{s.location} · {s.specs}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. INQUIRIES SECTION */}
          {activeSection === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">Inquiries & Private Tour Requests</h2>
                <p className="text-xs text-[#171A18]/70">Scheduled land site viewings and advisory desk communications</p>
              </div>

              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-[#EAF3EF] text-[#0B4F3C] text-[10px] font-bold uppercase rounded border border-[#0B4F3C]/20">
                        {inq.status}
                      </span>
                      <h4 className="text-lg font-serif font-bold text-[#171A18]">{inq.title}</h4>
                      <p className="text-xs text-[#171A18]/70">Assigned Advisor: {inq.advisor}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0B4F3C]">{inq.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. DOCUMENTS SECTION */}
          {activeSection === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">Title Deeds & Legal Land Documents</h2>
                <p className="text-xs text-[#171A18]/70">Conveyance deeds, allotment certificates & legal lineage documents</p>
              </div>

              <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 space-y-4 shadow-sm">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-[#FAF9F6] rounded-xl border border-[#0B4F3C]/15 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#0B4F3C]" />
                      <div>
                        <h4 className="font-bold text-xs text-[#171A18]">{doc.name}</h4>
                        <span className="text-[10px] text-[#171A18]/60">{doc.date} · {doc.size}</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-[#0B4F3C] text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-sm">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. PROFILE SECTION */}
          {activeSection === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">Customer Profile Information</h2>
                <p className="text-xs text-[#171A18]/70">Personal details and confidential contact information</p>
              </div>

              <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 space-y-4 shadow-sm max-w-xl">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[#171A18]/70 font-semibold">Full Name</label>
                    <input
                      type="text"
                      readOnly
                      value={userCustomer.fullName}
                      className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl p-2.5 text-xs text-[#171A18] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#171A18]/70 font-semibold">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      value={userCustomer.email}
                      className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl p-2.5 text-xs text-[#171A18] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[#171A18]/70 font-semibold">Phone Number</label>
                    <input
                      type="text"
                      readOnly
                      value={userCustomer.phone}
                      className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl p-2.5 text-xs text-[#171A18] font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. SETTINGS SECTION */}
          {activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#171A18]">Account Settings & Security</h2>
                <p className="text-xs text-[#171A18]/70">Security settings and communication preferences</p>
              </div>

              <div className="bg-white border border-[#0B4F3C]/15 rounded-xl p-6 space-y-4 shadow-sm max-w-xl">
                <h4 className="font-bold text-xs text-[#0B4F3C]">Security & Password</h4>
                <p className="text-xs text-[#171A18]/70">Your password was last updated 14 days ago.</p>
                <button className="px-4 py-2 bg-[#0B4F3C] text-white text-xs font-bold rounded-md shadow-sm">
                  Change Password
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* LAND PLOT DOSSIER DETAIL MODAL WITH PART PAYMENT MILESTONES */}
      {selectedLandDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#0B4F3C] text-white text-[10px] font-bold uppercase">
                    {selectedLandDossier.status}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0B4F3C]">{selectedLandDossier.transactionId}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#171A18] mt-1">{selectedLandDossier.title}</h3>
                <p className="text-xs text-[#171A18]/70 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0B4F3C]" />
                  <span>{selectedLandDossier.location}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedLandDossier(null)}
                className="p-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Land Dimensions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/20">
                <span className="text-[#171A18]/70 text-[10px] uppercase font-bold block">Sellable Area</span>
                <span className="text-[#0B4F3C] font-mono font-bold text-sm">{selectedLandDossier.sellableSqYrd || '201.28'} Sq Yrd</span>
              </div>
              <div className="p-3 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/20">
                <span className="text-[#171A18]/70 text-[10px] uppercase font-bold block">Carpet Area</span>
                <span className="text-[#0B4F3C] font-mono font-bold text-sm">{selectedLandDossier.carpetSqYrd || '104.48'} Sq Yrd</span>
              </div>
              <div className="p-3 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/20 col-span-2 sm:col-span-1">
                <span className="text-[#171A18]/70 text-[10px] uppercase font-bold block">Survey / Plot No</span>
                <span className="text-[#171A18] font-mono font-bold text-sm">{selectedLandDossier.plotNo || 'E5-104'}</span>
              </div>
            </div>

            {/* PART PAYMENT MILESTONE INSTALLMENT SCHEDULE */}
            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#0B4F3C]/15 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#0B4F3C] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> Customer Part Payment Milestone Schedule
                </h4>
                <span className="text-[10px] font-bold text-[#0B4F3C]">
                  {selectedLandDossier.paidAmount} Paid / {selectedLandDossier.dueBalance} Remaining
                </span>
              </div>

              <div className="space-y-2">
                {(selectedLandDossier.milestones || defaultMilestones).map((m: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-[#0B4F3C]/15 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#171A18]">{m.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          m.status === 'RECEIVED' ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-800 border border-amber-500/30'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#171A18]/70">Due Date: {m.dueDate} · Mode: {m.paymentMode}</p>
                    </div>
                    <span className="font-mono font-bold text-[#0B4F3C] text-sm">{m.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PLC & Survey Features */}
            <div className="p-4 bg-white rounded-2xl border border-[#0B4F3C]/15 space-y-2.5 text-xs">
              <h4 className="font-bold text-[#171A18] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0B4F3C]" /> PLC & Preferential Land Attributes
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[#171A18]/80 text-[11px]">
                <div className="flex items-center gap-2 p-2 bg-[#FAF9F6] rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4F3C]" />
                  <span>Road Access: <strong>{selectedLandDossier.plc12m || '12 Meter Main Road'}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF9F6] rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4F3C]" />
                  <span>Corner Location: <strong>{selectedLandDossier.plcCorner || 'Standard Facing'}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF9F6] rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4F3C]" />
                  <span>Park Facing: <strong>{selectedLandDossier.plcPark || 'Garden Facing'}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-[#FAF9F6] rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4F3C]" />
                  <span>Govt Survey Ref: <strong>{selectedLandDossier.surveyNo || 'MH-BND-448/2B'}</strong></span>
                </div>
              </div>
            </div>

            {/* Sales Relationship */}
            <div className="p-3.5 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/20 flex items-center justify-between text-xs">
              <span className="text-[#171A18]/70">Acquisition Desk:</span>
              {selectedLandDossier.agentName ? (
                <span className="font-bold text-[#0B4F3C] flex items-center gap-1">
                  <UserCheck className="w-4 h-4" /> Handled by Senior Advisor: {selectedLandDossier.agentName}
                </span>
              ) : (
                <span className="font-bold text-sky-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Direct Customer Purchase (Corporate Desk)
                </span>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedLandDossier(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] text-xs font-bold text-[#171A18]/70 hover:text-[#171A18] border border-[#0B4F3C]/20"
              >
                Close Dossier
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-xs font-bold text-white shadow-md flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Title Deed PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#0B4F3C]/15 py-4 text-center text-xs text-[#171A18]/60 font-light bg-white">
        House & Sky Client Vault · Confidential Customer Portal Mode
      </footer>
    </div>
  )
}
export default App
