import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GitMerge,
  Building2,
  MapPin,
  Map,
  DollarSign,
  CreditCard,
  ScanText,
  FileBarChart,
  Bell,
  Settings,
  Building,
  Bot,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, adminOnly: true },
  { name: 'Customer Inquiries', path: '/inquiries', icon: MessageSquare },
  { name: 'Employees & Agents', path: '/employees', icon: Users },
  { name: 'MLM Network Tree', path: '/mlm-tree', icon: GitMerge },
  { name: 'Projects', path: '/projects', icon: Building2, adminOnly: true },
  { name: 'Plot Management', path: '/plots', icon: MapPin },
  { name: 'Plot Maps', path: '/plot-maps', icon: Map, adminOnly: true },
  { name: 'Commissions', path: '/commissions', icon: DollarSign },
  { name: 'Payouts', path: '/payouts', icon: CreditCard },
  { name: 'AI Knowledge Base', path: '/ai-knowledge', icon: Bot, adminOnly: true },
  { name: 'OCR Analyzer', path: '/ocr-analyzer', icon: ScanText, adminOnly: true },
  { name: 'Reports', path: '/reports', icon: FileBarChart, adminOnly: true },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings, adminOnly: true },
];

const ADMIN_ROLES = ['ADMIN', 'DIRECTOR'];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);
  const visibleItems = navigationItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-white border-r border-[#0B4F3C]/15 flex flex-col h-screen sticky top-0 z-30 select-none shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#0B4F3C]/15 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] flex items-center justify-center shadow-md">
          <Building className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg text-[#171A18] tracking-tight leading-none">
            House & <span className="text-[#0B4F3C] italic font-serif">Sky</span>
          </h1>
          <p className="text-[9px] text-[#0B4F3C] font-bold tracking-widest uppercase mt-1">Enterprise Advisory & CRM</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0B4F3C] text-white shadow-md'
                    : 'text-[#171A18]/70 hover:bg-[#EAF3EF] hover:text-[#0B4F3C]'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Enterprise Footer */}
      <div className="p-4 border-t border-[#0B4F3C]/15 bg-[#EAF3EF]/50">
        <div className="flex items-center gap-2 text-xs text-[#0B4F3C] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#0B4F3C]" />
          <span>House & Sky Network v1.0</span>
        </div>
      </div>
    </aside>
  );
};
