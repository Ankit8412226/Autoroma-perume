import React, { useState } from 'react';
import { Settings, Bell, Save, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('House & Sky Enterprise Advisory');
  const [currency, setCurrency] = useState('INR (₹)');
  const [enableWhatsapp, setEnableWhatsapp] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">System & Security Settings</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">SaaS organization preferences, API keys, and RBAC permissions</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F3C] bg-[#EAF3EF] px-3 py-1.5 rounded-xl border border-[#0B4F3C]/20">
            <CheckCircle className="w-4 h-4" /> Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-[#0B4F3C]/15 space-y-6 max-w-3xl shadow-sm">
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-[#171A18] text-base border-b border-[#0B4F3C]/15 pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#0B4F3C]" /> Organization Identity
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#171A18]/70 font-semibold">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold"
              />
            </div>
            <div>
              <label className="text-[#171A18]/70 font-semibold">Default Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif font-bold text-[#171A18] text-base border-b border-[#0B4F3C]/15 pb-2 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0B4F3C]" /> Multi-Channel Dispatch Options
          </h3>
          <div className="space-y-3 text-xs text-[#171A18]/70 font-semibold">
            <div className="flex items-center justify-between">
              <span>Enable Automated WhatsApp Payout Alerts</span>
              <input
                type="checkbox"
                checked={enableWhatsapp}
                onChange={(e) => setEnableWhatsapp(e.target.checked)}
                className="w-4 h-4 accent-[#0B4F3C]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Enable Email Payout Alerts & Invoices</span>
              <input
                type="checkbox"
                checked={enableEmail}
                onChange={(e) => setEnableEmail(e.target.checked)}
                className="w-4 h-4 accent-[#0B4F3C]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#0B4F3C]/15 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer border border-[#0B4F3C]"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
