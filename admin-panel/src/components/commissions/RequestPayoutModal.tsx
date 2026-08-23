import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { Employee } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface RequestPayoutModalProps {
  employees: Employee[];
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  employees,
  onClose,
  onSuccess
}) => {
  const { employee: loggedInEmployee } = useAuth();
  const toast = useToast();

  const [employeeId, setEmployeeId] = useState<string>(loggedInEmployee ? loggedInEmployee.id : '');
  const [amount, setAmount] = useState<number>(50000);
  const [accountNumber, setAccountNumber] = useState<string>('918273645019');
  const [ifscCode, setIfscCode] = useState<string>('HDFC0001234');
  const [bankName, setBankName] = useState<string>('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/payouts/request', {
        employeeId: employeeId || (loggedInEmployee ? loggedInEmployee.id : null),
        amount,
        bankDetails: {
          accountNumber,
          ifscCode,
          bankName
        }
      });

      toast.success('Payout request submitted successfully! Pending admin approval.');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit payout request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#0B4F3C]/20 w-full max-w-md rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#0B4F3C]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4F3C] text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#171A18]">Request Commission Payout</h3>
              <p className="text-xs text-[#171A18]/70">Disburse earned MLM sales commissions to bank account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#EAF3EF] text-[#0B4F3C] hover:bg-[#0B4F3C] hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[#171A18]/70 font-semibold">Select Beneficiary Agent</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#171A18] font-bold focus:outline-none focus:border-[#0B4F3C]"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.userId ? emp.userId.fullName : emp.employeeCode} ({emp.employeeCode} - {emp.currentRank})
                  {loggedInEmployee && emp.id === loggedInEmployee.id ? ' [YOU]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#171A18]/70 font-semibold">Payout Amount (₹)</label>
            <input
              type="number"
              required
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1 bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-2 text-[#0B4F3C] font-extrabold text-sm focus:outline-none focus:border-[#0B4F3C]"
            />
          </div>

          <div className="p-3 bg-[#EAF3EF] rounded-xl border border-[#0B4F3C]/20 space-y-3">
            <p className="font-bold text-[#0B4F3C] text-[11px]">Bank Account Details:</p>
            
            <div>
              <label className="text-[#171A18]/70 font-semibold">Bank Name</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full mt-1 bg-white border border-[#0B4F3C]/20 rounded-xl px-3 py-1.5 text-[#171A18] font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#171A18]/70 font-semibold">Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full mt-1 bg-white border border-[#0B4F3C]/20 rounded-xl px-3 py-1.5 text-[#171A18] font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[#171A18]/70 font-semibold">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full mt-1 bg-white border border-[#0B4F3C]/20 rounded-xl px-3 py-1.5 text-[#171A18] font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#0B4F3C]/15 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#0B4F3C]/20 font-bold text-xs text-[#171A18]/70 hover:text-[#171A18]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-[#0B4F3C] hover:bg-[#063B2D] font-bold text-xs text-white shadow-md cursor-pointer border border-[#0B4F3C]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
