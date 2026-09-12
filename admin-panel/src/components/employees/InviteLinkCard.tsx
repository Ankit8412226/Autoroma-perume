import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Link2, Copy, Check } from 'lucide-react';

export const InviteLinkCard: React.FC = () => {
  const toast = useToast();
  const [inviteUrl, setInviteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const buildInviteUrl = (code: string) => `${window.location.origin}/join/${code}`;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/employees/me/invite-link');
      const code = res.data?.inviteCode;
      if (!code) {
        toast.error('Could not generate invite link');
        return;
      }
      const url = buildInviteUrl(code);
      setInviteUrl(url);
      toast.success('Invite link ready. Share it with the new agent.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate invite link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success('Link copied');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-[#0B4F3C]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-[#171A18] flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#0B4F3C]" />
          Invite an agent under you
        </p>
        <p className="text-[11px] text-[#171A18]/60 mt-0.5">
          Admin, Manager, Director, Agent — koi bhi login karke link bana sakta hai. Jo is link se join karega woh aapke downline mein aayega.
        </p>
        {inviteUrl ? (
          <p className="mt-2 text-[11px] font-mono break-all text-[#0B4F3C] bg-[#EAF3EF] rounded-lg px-2 py-1.5">{inviteUrl}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-[#0B4F3C] text-white text-xs font-bold disabled:opacity-60"
        >
          {isLoading ? 'Generating…' : inviteUrl ? 'Refresh link' : 'Generate link'}
        </button>
        {inviteUrl ? (
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl border border-[#0B4F3C]/20 bg-[#EAF3EF] text-[#0B4F3C] text-xs font-bold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : null}
      </div>
    </div>
  );
};
