import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, LogOut, ShieldCheck, Award, Menu, ChevronRight, Sparkles, Building2, Users, MapPin, ScanText, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Company Owner',
  DIRECTOR: 'Director',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  EMPLOYEE: 'Employee'
};

const ROUTE_NAMES: Record<string, string> = {
  '/dashboard': 'Executive Dashboard',
  '/inquiries': 'Customer Inquiries & Leads',
  '/projects': 'Real Estate Projects',
  '/plots': 'Plot Inventory',
  '/plot-maps': 'Plot Map Canvas',
  '/ocr-analyzer': 'Naksa Vision AI OCR',
  '/employees': 'Employees & Agents',
  '/mlm-tree': 'Downline MLM Tree',
  '/commissions': 'Commissions Ledger',
  '/payouts': 'Payout Requests',
  '/reports': 'Financial Reports',
  '/ai-knowledge': 'AI Knowledge Base',
  '/notifications': 'Notifications Center',
  '/settings': 'System Settings'
};

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { user, employee, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showQuickActions, setShowQuickActions] = useState(false);

  const isAdmin = !!user && ['ADMIN', 'DIRECTOR'].includes(user.role);
  const currentRouteName = ROUTE_NAMES[location.pathname] || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#0B4F3C]/15 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors md:hidden cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumb Bar */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#171A18]/70">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-[#C9A96E]/50 bg-[#0B241C] shrink-0">
            <img src="/logo.png" alt="House & Sky" className="w-full h-full object-cover" />
          </div>
          <span className="text-[#0B4F3C] font-extrabold">House & Sky</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[#171A18] font-extrabold text-sm font-serif">{currentRouteName}</span>
        </div>
      </div>

      {/* Center/Search Bar */}
      <div className="hidden lg:block relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171A18]/60" />
        <input
          type="text"
          placeholder="Search plots, agents, projects..."
          className="w-full bg-[#EAF3EF]/60 border border-[#0B4F3C]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#171A18] placeholder-[#171A18]/60 focus:outline-none focus:border-[#0B4F3C]"
        />
      </div>

      {/* Right User Actions & Quick Menu */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0B4F3C] to-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {/* Dropdown Menu */}
          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#0B4F3C]/20 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <p className="px-3 py-1 text-[10px] font-extrabold text-[#0B4F3C] uppercase tracking-wider">Fast Navigation & Tasks</p>
              <button
                onClick={() => { navigate('/projects'); setShowQuickActions(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 hover:bg-[#EAF3EF] text-[#171A18] cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#0B4F3C]" /> Create New Project
              </button>
              <button
                onClick={() => { navigate('/employees'); setShowQuickActions(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 hover:bg-[#EAF3EF] text-[#171A18] cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#0B4F3C]" /> Onboard Agent / Employee
              </button>
              <button
                onClick={() => { navigate('/plots'); setShowQuickActions(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 hover:bg-[#EAF3EF] text-[#171A18] cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#0B4F3C]" /> Plot Inventory & Naksa
              </button>
              <button
                onClick={() => { navigate('/ocr-analyzer'); setShowQuickActions(false); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center gap-2 hover:bg-[#EAF3EF] text-[#171A18] cursor-pointer"
              >
                <ScanText className="w-4 h-4 text-emerald-600" /> Naksa AI OCR Scanner
              </button>
            </div>
          )}
        </div>

        {/* Notification Bell Badge */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0B4F3C]"></span>
        </button>

        {/* Access-role Badge (Owner vs Agent) */}
        {user && (
          <div
            className={`hidden md:flex px-3 py-1.5 rounded-full items-center gap-1.5 text-xs font-bold border ${
              isAdmin
                ? 'bg-[#0B4F3C] text-white border-[#0B4F3C]'
                : 'bg-[#EAF3EF] border-[#0B4F3C]/30 text-[#0B4F3C]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{ROLE_LABEL[user.role] || user.role}</span>
          </div>
        )}

        {/* Current MLM Rank Badge */}
        {employee && (
          <div className="hidden xl:flex px-3 py-1.5 rounded-full bg-[#EAF3EF] border border-[#0B4F3C]/30 items-center gap-1.5 text-xs text-[#0B4F3C] font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{employee.currentRank}</span>
          </div>
        )}

        {/* Profile Dropdown / User Details */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#0B4F3C]/15">
          <div className="w-9 h-9 rounded-full bg-[#0B4F3C] flex items-center justify-center font-bold text-sm text-white shadow-sm border border-emerald-400/30">
            {user ? user.fullName.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-[#171A18] leading-none">{user ? user.fullName : 'Ankit Kumar'}</p>
            <p className="text-[10px] text-[#171A18]/60 font-semibold mt-0.5">{user ? user.role : 'ADMIN'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-[#171A18]/60 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

