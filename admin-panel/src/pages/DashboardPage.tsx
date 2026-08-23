import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { DashboardStats } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { PlotStatusDistribution } from '../components/dashboard/PlotStatusDistribution';
import { DollarSign, Users, Building2, MapPin, Award, CreditCard, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-[#0B4F3C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { kpi, charts } = stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#171A18]">Executive CRM Dashboard</h2>
          <p className="text-xs text-[#171A18]/70 mt-1">Real-time financial performance, plot inventory & MLM downline metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#EAF3EF] border border-[#0B4F3C]/30 text-[#0B4F3C] text-xs font-bold">
            ● System Active
          </span>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Sales Revenue"
          value={`₹${(kpi.totalRevenue / 10000000).toFixed(2)} Cr`}
          subtitle="Lifetime Gross Transaction Volume"
          icon={DollarSign}
          color="from-[#0B4F3C] to-[#063B2D]"
          trend="+18.4% MoM"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${(kpi.monthlyRevenue / 100000).toFixed(2)} Lakh`}
          subtitle="Current Billing Cycle"
          icon={TrendingUp}
          color="from-[#0B4F3C] to-[#063B2D]"
          trend="+12.2% vs target"
        />
        <StatCard
          title="Active MLM Agents"
          value={kpi.totalEmployees}
          subtitle="Across 7 Qualification Tiers"
          icon={Users}
          color="from-[#0B4F3C] to-[#063B2D]"
        />
        <StatCard
          title="Total Real Estate Plots"
          value={kpi.totalPlots}
          subtitle={`${kpi.availablePlots} Available • ${kpi.soldPlots} Sold`}
          icon={MapPin}
          color="from-[#0B4F3C] to-[#063B2D]"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={charts.revenueTrend} />
        </div>
        <div>
          <PlotStatusDistribution data={charts.plotStatusDistribution} />
        </div>
      </div>

      {/* Bottom Performance Leaderboard */}
      <div className="bg-white p-6 rounded-2xl border border-[#0B4F3C]/15 shadow-sm space-y-4">
        <h3 className="text-base font-serif font-bold text-[#171A18]">Top Performing MLM Sales Executives</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#171A18]">
            <thead className="bg-[#EAF3EF] text-[#0B4F3C] uppercase text-[10px] font-bold border-b border-[#0B4F3C]/15">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Executive Name</th>
                <th className="p-3">Current MLM Tier</th>
                <th className="p-3">Self Sales</th>
                <th className="p-3">Team Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B4F3C]/10">
              {charts.topEmployees.map((emp, index) => (
                <tr key={index} className="hover:bg-[#EAF3EF]/40 transition-colors">
                  <td className="p-3 font-bold text-[#0B4F3C]">#{index + 1}</td>
                  <td className="p-3 font-bold">{emp.name}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3EF] text-[#0B4F3C] text-[10px] font-bold border border-[#0B4F3C]/20">
                      {emp.rank}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#171A18]">{emp.sales}</td>
                  <td className="p-3 font-bold text-[#0B4F3C]">{emp.teamSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
