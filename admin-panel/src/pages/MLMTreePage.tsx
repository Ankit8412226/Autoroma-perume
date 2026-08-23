import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { MLMTreeNode, Employee } from '../types';
import { MLMTreeVisualizer } from '../components/mlm/MLMTreeVisualizer';
import { Award, ShieldCheck } from 'lucide-react';

export const MLMTreePage: React.FC = () => {
  const [treeData, setTreeData] = useState<MLMTreeNode | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRootId, setSelectedRootId] = useState<string>('');
  const [rankRules, setRankRules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [treeRes, rulesRes, empRes] = await Promise.all([
        api.get('/mlm/tree'),
        api.get('/mlm/rank-rules'),
        api.get('/employees')
      ]);

      setTreeData(treeRes.data);
      setRankRules(rulesRes.data);
      setEmployees(empRes.data);

      if (treeRes.data && treeRes.data.id) {
        setSelectedRootId(treeRes.data.id);
      }
    } catch (error) {
      console.error('Failed to load MLM network data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRootChange = async (rootId: string) => {
    if (!rootId) return;
    setSelectedRootId(rootId);
    try {
      setIsLoading(true);
      const treeRes = await api.get(`/mlm/tree?rootId=${rootId}`);
      setTreeData(treeRes.data);
    } catch (error) {
      console.error('Failed to fetch tree for root ID', error);
    } finally {
      setIsLoading(false);
    }
  };

  const salesDirectors = employees.filter(
    (e) => e.currentRank === 'Director Sales' || e.currentRank === 'Associate Sales Director'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Leader Root Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">Multi-Level Network Hierarchy</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Unlimited depth downline sponsor visualizer & Sales Director network trees</p>
        </div>

        {/* Tree Root Leader Selector Dropdown */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#0B4F3C]/15 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#0B4F3C]" />
          <div>
            <label className="text-[10px] text-[#0B4F3C] font-bold uppercase tracking-wider block">Focus Tree Root Leader</label>
            <select
              value={selectedRootId}
              onChange={(e) => handleRootChange(e.target.value)}
              className="bg-[#FAF9F6] border border-[#0B4F3C]/20 rounded-xl px-3 py-1 text-xs font-bold text-[#171A18] focus:outline-none focus:border-[#0B4F3C]"
            >
              {employees.map((emp) => {
                const empId = (emp as any)._id || emp.id;
                const empName = emp.userId ? emp.userId.fullName : emp.employeeCode;
                return (
                  <option key={empId} value={empId}>
                    {empName} ({emp.employeeCode} - {emp.currentRank})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Qualified Sales Directors Highlight Bar */}
      {salesDirectors.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-[#0B4F3C]/15 flex items-center gap-4 flex-wrap shadow-sm">
          <span className="text-xs font-serif font-bold text-[#0B4F3C] uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#0B4F3C]" /> Top Sales Directors ({salesDirectors.length}):
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {salesDirectors.map((dir) => {
              const dirId = (dir as any)._id || dir.id;
              const dirName = dir.userId ? dir.userId.fullName : dir.employeeCode;
              return (
                <button
                  key={dirId}
                  onClick={() => handleRootChange(dirId)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    selectedRootId === dirId
                      ? 'bg-[#0B4F3C] text-white border-[#0B4F3C] shadow-md'
                      : 'bg-[#FAF9F6] text-[#0B4F3C] hover:bg-[#EAF3EF] border-[#0B4F3C]/20'
                  }`}
                >
                  ⭐ {dirName} ({dir.currentRank})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Rank Qualification Rules Matrix */}
      <div className="bg-white p-5 rounded-2xl border border-[#0B4F3C]/15 shadow-sm">
        <h3 className="text-sm font-serif font-bold text-[#171A18] mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#0B4F3C]" /> Business Plan Qualification Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {rankRules.map((rule, idx) => (
            <div key={idx} className="bg-[#EAF3EF] p-3 rounded-xl border border-[#0B4F3C]/20 hover:border-[#0B4F3C]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#171A18]">{rule.rank}</span>
                <span className="text-[#0B4F3C] font-extrabold">{rule.commissionPercent}%</span>
              </div>
              <div className="mt-2 text-[10px] text-[#171A18]/70 space-y-1">
                <p>Self Sales: <span className="text-[#171A18] font-bold">{rule.minSelfSales}</span></p>
                <p>Team Sales: <span className="text-[#171A18] font-bold">{rule.minTeamSales}</span></p>
                <p>Min Legs: <span className="text-[#171A18] font-bold">{rule.minLegs}</span></p>
                {rule.timeLimitDays && (
                  <p className="text-amber-700 font-semibold">Time Window: 2 Months</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Tree Graph Component */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#0B4F3C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : treeData ? (
        <MLMTreeVisualizer treeData={treeData} />
      ) : (
        <div className="text-center p-8 bg-white rounded-2xl border border-[#0B4F3C]/15 text-[#171A18]/70">No hierarchy data available</div>
      )}
    </div>
  );
};
