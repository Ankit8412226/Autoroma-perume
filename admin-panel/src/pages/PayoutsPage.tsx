import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Payout, Employee } from '../types';
import { RequestPayoutModal } from '../components/commissions/RequestPayoutModal';
import { Plus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const PayoutsPage: React.FC = () => {
  const toast = useToast();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchPayoutsAndAgents();
  }, []);

  const fetchPayoutsAndAgents = async () => {
    try {
      setIsLoading(true);
      const [payRes, empRes] = await Promise.all([
        api.get('/payouts'),
        api.get('/employees')
      ]);
      setPayouts(payRes.data);
      setEmployees(empRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/payouts/${id}/approve`);
      toast.success('Payout approved & processed! Multi-channel WhatsApp notification sent to agent.');
      fetchPayoutsAndAgents();
    } catch (e) {
      console.error(e);
      toast.error('Failed to approve payout');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">Agent Earnings Payouts & Disbursements</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Disburse calculated commissions and send multi-channel notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayoutsAndAgents}
            className="p-2.5 rounded-xl bg-[#EAF3EF] border border-[#0B4F3C]/20 text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer border border-[#0B4F3C]"
          >
            <Plus className="w-4 h-4" /> Request Payout
          </button>
        </div>
      </div>

      {/* Payouts Directory Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#0B4F3C]/15 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-[#0B4F3C] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#171A18]">
              <thead className="bg-[#EAF3EF] text-[#0B4F3C] uppercase text-[10px] font-bold border-b border-[#0B4F3C]/15">
                <tr>
                  <th className="p-3">Reference No</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Payout Amount</th>
                  <th className="p-3">Request Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B4F3C]/10">
                {payouts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#EAF3EF]/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0B4F3C]">{p.referenceNo}</td>
                    <td className="p-3 font-bold text-[#171A18]">{p.employeeId?.userId?.fullName || 'Agent'}</td>
                    <td className="p-3 font-extrabold text-[#0B4F3C]">₹{p.amount.toLocaleString()}</td>
                    <td className="p-3 text-[#171A18]/70">{new Date(p.payoutDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-800 border-emerald-500/30' : 'bg-amber-500/20 text-amber-800 border-amber-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.status === 'PENDING' ? (
                        <button
                          onClick={() => handleApprove(p._id)}
                          className="px-3 py-1 bg-[#0B4F3C] hover:bg-[#063B2D] text-white font-bold rounded-lg text-xs shadow-md flex items-center gap-1 cursor-pointer border border-[#0B4F3C]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Pay
                        </button>
                      ) : (
                        <span className="text-[#0B4F3C] text-[10px] font-bold">✔ Disbursed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Payout Modal */}
      {isRequestModalOpen && (
        <RequestPayoutModal
          employees={employees}
          onClose={() => setIsRequestModalOpen(false)}
          onSuccess={fetchPayoutsAndAgents}
        />
      )}
    </div>
  );
};
