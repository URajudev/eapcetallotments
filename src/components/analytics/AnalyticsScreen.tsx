import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { 
  BarChart3, 
  Users, 
  Sparkles, 
  ArrowRightLeft, 
  ArrowUpCircle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  GraduationCap,
  PieChart,
  Layers
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const summary = useMemo(() => dataRepository.getAnalyticsSummary(), []);

  const statusCards = [
    {
      title: 'Total Retained',
      count: summary.retainedCount,
      percentage: Math.round((summary.retainedCount / summary.totalStudents) * 100),
      icon: CheckCircle2,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      description: 'Retained original Phase 1 seat with zero disruption.',
    },
    {
      title: 'Transferred Colleges',
      count: summary.transferredCount,
      percentage: Math.round((summary.transferredCount / summary.totalStudents) * 100),
      icon: ArrowRightLeft,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Successfully migrated to higher priority institution in Phase 2.',
    },
    {
      title: 'Upgraded Branches',
      count: summary.upgradedBranchCount,
      percentage: Math.round((summary.upgradedBranchCount / summary.totalStudents) * 100),
      icon: ArrowUpCircle,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Upgraded to premium branch within the same college campus.',
    },
    {
      title: 'New Phase 2 Seats',
      count: summary.newSeatCount,
      percentage: Math.round((summary.newSeatCount / summary.totalStudents) * 100),
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Fresh allotments for candidates unplaced during Phase 1.',
    },
    {
      title: 'No Seat Allotted',
      count: summary.noSeatCount,
      percentage: Math.round((summary.noSeatCount / summary.totalStudents) * 100),
      icon: XCircle,
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      description: 'Candidates eligible for Special Stray & Spot rounds.',
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
          <BarChart3 size={13} className="text-indigo-600" />
          Admission Trends & Allotment Metrics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          EAPCET 2026 Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quantitative breakdown of Phase 1 vs Phase 2 movements, institutional distributions, and social reservations.
        </p>
      </div>

      {/* Top Level Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered</span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
            {summary.totalStudents.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Candidates in dataset</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Admitted</span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600 font-['Outfit'] mt-1">
            {summary.totalAllotted.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {Math.round((summary.totalAllotted / summary.totalStudents) * 100)}% Placement rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Colleges</span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-700 font-['Outfit'] mt-1">
            {summary.totalColleges}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Participating institutes</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engineering Streams</span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
            {summary.totalBranches}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Accredited branches</span>
        </div>
      </div>

      {/* Transition Status Distribution */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-3">
          Phase 1 to Phase 2 Transition Matrix
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statusCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`p-2 rounded-2xl border ${card.color}`}>
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {card.percentage}% of total
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{card.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Candidates:</span>
                  <span className="text-lg font-extrabold text-slate-900 font-['Outfit']">
                    {card.count} Students
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Institutional Distribution & Category Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Colleges by Admitted Candidates */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Admitted Candidates by College
            </h3>
            <span className="text-xs text-slate-400">Final Allocation</span>
          </div>

          <div className="space-y-3">
            {summary.collegeDistribution.map((col) => (
              <div key={col.code} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[240px]">
                    {col.code} - {col.name}
                  </span>
                  <span className="font-bold text-slate-900">{col.count} students</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${Math.max(10, (col.count / summary.totalStudents) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Category Representation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Reservation Category Demographics
            </h3>
            <span className="text-xs text-slate-400">EWS & Social Quotas</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {summary.categoryDistribution.map((cat) => (
              <div key={cat.category} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">{cat.category}</span>
                  <span className="text-xs font-extrabold text-indigo-700">{cat.count}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${Math.max(15, (cat.count / summary.totalStudents) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
