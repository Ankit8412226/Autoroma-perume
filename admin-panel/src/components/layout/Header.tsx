import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, LogOut, ShieldCheck, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Company Owner',
  DIRECTOR: 'Director',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  EMPLOYEE: 'Employee'
};

export const Header: React.FC = () => {
  const { user, employee, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = !!user && ['ADMIN', 'DIRECTOR'].includes(user.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#0B4F3C]/15 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171A18]/60" />
        <input
          type="text"
          placeholder="Search plots, agents, projects..."
          className="w-full bg-[#EAF3EF]/60 border border-[#0B4F3C]/20 rounded-xl pl-9 pr-4 py-2 text-xs text-[#171A18] placeholder-[#171A18]/60 focus:outline-none focus:border-[#0B4F3C]"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Badge */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0B4F3C]"></span>
        </button>

        {/* Access-role Badge (Owner vs Agent) */}
        {user && (
          <div
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border ${
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
          <div className="px-3 py-1.5 rounded-full bg-[#EAF3EF] border border-[#0B4F3C]/30 flex items-center gap-1.5 text-xs text-[#0B4F3C] font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{employee.currentRank}</span>
          </div>
        )}

        {/* Profile Dropdown / User Details */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#0B4F3C]/15">
          <div className="w-9 h-9 rounded-full bg-[#0B4F3C] flex items-center justify-center font-bold text-sm text-white shadow-sm">
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
