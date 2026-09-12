import React, { useState, useEffect } from 'react';
import { Settings, Bell, Save, CheckCircle, Megaphone, Loader2 } from 'lucide-react';
import api from '../services/api';

export const SettingsPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('House & Sky Enterprise Advisory');
  const [currency, setCurrency] = useState('INR (₹)');
  const [enableWhatsapp, setEnableWhatsapp] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  
  // Announcement Ticker state
  const [announcementText, setAnnouncementText] = useState('महत्वपूर्ण सूचना: धोलरा SIR एवं नोएडा स्मार्ट सिटी टाउनशिप में नए प्लॉट्स की रजिस्ट्री चालू है। साइट विज़िट बुक करने के लिए संपर्क करें: +91 93112 27789 | व्हाट्सएप: +91 92899 27527');
  const [isTickerActive, setIsTickerActive] = useState(true);
  const [isLoadingTicker, setIsLoadingTicker] = useState(true);
  const [isSavingTicker, setIsSavingTicker] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetchAnnouncementTicker();
  }, []);

  const fetchAnnouncementTicker = async () => {
    try {
      setIsLoadingTicker(true);
      const res = await api.get('/public/announcement');
      if (res.data) {
        setAnnouncementText(res.data.announcement || '');
        setIsTickerActive(res.data.isActive !== false);
      }
    } catch (err) {
      console.error('Failed to fetch announcement ticker', err);
    } finally {
      setIsLoadingTicker(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingTicker(true);
      await api.put('/admin/announcement', {
        value: announcementText,
        isActive: isTickerActive
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save announcement ticker', err);
    } finally {
      setIsSavingTicker(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">System &amp; Security Settings</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Website announcement ribbon, SaaS organization preferences, and configurations</p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B4F3C] bg-[#EAF3EF] px-3 py-1.5 rounded-xl border border-[#0B4F3C]/20 shadow-sm animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Ticker &amp; Settings Saved Live!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#0B4F3C]/15 space-y-7 max-w-3xl shadow-sm">
        
        {/* Announcement Ticker Section */}
        <div className="space-y-4 bg-[#FAF9F6] p-5 rounded-2xl border border-[#0B4F3C]/15">
          <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-3">
            <h3 className="font-serif font-bold text-[#171A18] text-base flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-600" /> Landing Page Announcement Ribbon (महत्वपूर्ण सूचना Ticker)
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B4F3C]">
              <input
                type="checkbox"
                checked={isTickerActive}
                onChange={(e) => setIsTickerActive(e.target.checked)}
                className="w-4 h-4 accent-[#0B4F3C] rounded"
              />
              <span>{isTickerActive ? 'Ribbon Active (ON)' : 'Ribbon Hidden (OFF)'}</span>
            </label>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-[#171A18]/80 font-bold block">
              Marquee Ticker Text (This text scrolls right-to-left under the Navbar):
            </label>
            {isLoadingTicker ? (
              <div className="py-4 flex items-center justify-center text-[#0B4F3C]">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Type important announcement, e.g. महत्वपूर्ण सूचना: धोलरा SIR प्रोजेक्ट बुकिंग चालू है..."
                className="w-full bg-white border border-[#0B4F3C]/25 rounded-xl p-3 text-xs text-[#171A18] font-medium focus:outline-none focus:border-[#0B4F3C]"
              />
            )}
            <p className="text-[11px] text-[#171A18]/60 italic">
              💡 Tip: Changes saved here will immediately reflect on the public website home page marquee bar between Navbar and Hero Section.
            </p>
          </div>
        </div>

        {/* Organization Identity */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-[#171A18] text-base border-b border-[#0B4F3C]/15 pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#0B4F3C]" /> Organization Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

        {/* Multi-Channel Dispatch Options */}
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
              <span>Enable Email Payout Alerts &amp; Invoices</span>
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
            disabled={isSavingTicker}
            className="px-6 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer border border-[#0B4F3C] disabled:opacity-50"
          >
            {isSavingTicker ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save System Settings &amp; Ticker</span>
          </button>
        </div>
      </form>
    </div>
  );
};
