import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Building, Lock, Mail, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'AGENT' | 'MANAGER'>('ADMIN');
  const [email, setEmail] = useState<string>('ankit@houseandsky.com');
  const [password, setPassword] = useState<string>('Password123!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'ADMIN' | 'AGENT' | 'MANAGER') => {
    setSelectedRole(role);
    if (role === 'ADMIN') setEmail('ankit@houseandsky.com');
    else if (role === 'AGENT') setEmail('agent@houseandsky.com');
    else if (role === 'MANAGER') setEmail('manager@houseandsky.com');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');

      const response = await api.post('/auth/login', { email, password });
      const { token, user, employee } = response.data;

      login(token, user, employee);
      const isAdmin = ['ADMIN', 'DIRECTOR'].includes(user.role);
      navigate(isAdmin ? '/dashboard' : '/mlm-tree');
    } catch (err: any) {
      console.error(err);
      setError(err.friendlyMessage || err.response?.data?.message || 'Invalid authentication credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-[#0B4F3C]/15 w-full max-w-md space-y-6 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0B4F3C] flex items-center justify-center mx-auto shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#171A18] tracking-tight">
            House & <span className="text-[#0B4F3C] italic">Sky</span>
          </h1>
          <p className="text-xs text-[#171A18]/70">Enterprise Advisory & Multi-Role CRM</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/15">
          <button
            type="button"
            onClick={() => handleRoleSelect('ADMIN')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              selectedRole === 'ADMIN'
                ? 'bg-[#0B4F3C] text-white shadow-md'
                : 'text-[#171A18]/70 hover:text-[#0B4F3C]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('AGENT')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              selectedRole === 'AGENT'
                ? 'bg-[#0B4F3C] text-white shadow-md'
                : 'text-[#171A18]/70 hover:text-[#0B4F3C]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Agent</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('MANAGER')}
            className={`py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
              selectedRole === 'MANAGER'
                ? 'bg-[#0B4F3C] text-white shadow-md'
                : 'text-[#171A18]/70 hover:text-[#0B4F3C]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#171A18]/70 font-semibold">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171A18]/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#171A18] placeholder-[#171A18]/50 focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#171A18]/70 font-semibold">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171A18]/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#171A18] placeholder-[#171A18]/50 focus:outline-none focus:border-[#0B4F3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center cursor-pointer border border-[#0B4F3C]"
          >
            {isLoading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/15 text-[11px] text-[#171A18]/70 space-y-1">
          <p className="font-bold text-[#0B4F3C]">Default Demo Credentials:</p>
          <p>Email: <span className="text-[#0B4F3C] font-mono font-bold">{email}</span></p>
          <p>Password: <span className="text-[#0B4F3C] font-mono font-bold">Password123!</span></p>
        </div>
      </div>
    </div>
  );
};
