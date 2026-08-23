import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Commission } from '../types';
import { CheckCircle2, Clock } from 'lucide-react';

export const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const [listRes, sumRes] = await Promise.all([
        api.get('/commissions'),
        api.get('/commissions/summary')
      ]);
      setCommissions(listRes.data);
      setSummary(sumRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">Differential Commission Ledger</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Multi-tier commission distribution logs generated from plot sales</p>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-[#0B4F3C]/15 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-[#171A18]/70 font-semibold">Total Commissions Paid</p>
              <h3 className="text-2xl font-serif font-bold text-[#0B4F3C] mt-1">₹{summary.totalPaid.toLocaleString()}</h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-[#0B4F3C]" />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#0B4F3C]/15 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-[#171A18]/70 font-semibold">Commissions Pending Payout</p>
              <h3 className="text-2xl font-serif font-bold text-amber-700 mt-1">₹{summary.totalPending.toLocaleString()}</h3>
            </div>
            <Clock className="w-8 h-8 text-amber-700" />
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-[#0B4F3C]/15 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#171A18]">
            <thead className="bg-[#EAF3EF] text-[#0B4F3C] uppercase text-[10px] font-bold border-b border-[#0B4F3C]/15">
              <tr>
                <th className="p-3">Agent</th>
                <th className="p-3">Rank at Sale</th>
                <th className="p-3">Plot</th>
                <th className="p-3">Sale Amount</th>
                <th className="p-3">Rank Rate</th>
                <th className="p-3">Diff Rate</th>
                <th className="p-3">Commission Earned</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B4F3C]/10">
              {commissions.map((comm) => (
                <tr key={comm._id} className="hover:bg-[#EAF3EF]/40 transition-colors">
                  <td className="p-3 font-bold text-[#171A18]">{comm.employeeId?.userId?.fullName || 'Agent'}</td>
                  <td className="p-3 text-[#0B4F3C] font-semibold">{comm.rankAtSale}</td>
                  <td className="p-3 font-mono font-bold text-[#0B4F3C]">{comm.plotId ? comm.plotId.plotNo : 'Plot'}</td>
                  <td className="p-3">₹{comm.saleAmount.toLocaleString()}</td>
                  <td className="p-3">{comm.commissionRate}%</td>
                  <td className="p-3 font-bold text-amber-700">{comm.differentialRate}%</td>
                  <td className="p-3 font-extrabold text-[#0B4F3C]">₹{comm.commissionAmount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      comm.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30' : 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                    }`}>
                      {comm.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
