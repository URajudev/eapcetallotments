import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Building2, 
  Search, 
  FileSpreadsheet, 
  TrendingUp, 
  Award, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  UserCheck,
  FileDown
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeScreen: React.FC = () => {
  const { currentStudent, currentDerivedAllotment, navigateTo, activePhase, setActivePhase } = useApp();

  if (!currentStudent || !currentDerivedAllotment) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">No candidate profile selected.</p>
        <button
          onClick={() => navigateTo('/welcome')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold"
        >
          Select Candidate
        </button>
      </div>
    );
  }

  const { status, finalCollege, finalBranch, previousCollege, previousBranch, phase1Record, phase2Record } = currentDerivedAllotment;

  const quickActions = [
    {
      title: 'Search Student',
      subtitle: 'Find any candidate by Name or Hall Ticket',
      icon: Search,
      route: '/search',
      color: 'from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-indigo-600',
      border: 'hover:border-indigo-300',
    },
    {
      title: 'College Allotments',
      subtitle: 'Explore branch-wise allotments for 10+ colleges',
      icon: Building2,
      route: '/colleges',
      color: 'from-emerald-500/10 to-teal-500/10',
      iconColor: 'text-emerald-600',
      border: 'hover:border-emerald-300',
    },
    {
      title: 'Seat Availability',
      subtitle: 'Real-time Phase 2 vacancies & intake matrix',
      icon: FileSpreadsheet,
      route: '/seat-availability',
      color: 'from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-600',
      border: 'hover:border-amber-300',
    },
    {
      title: 'Cutoff Analytics',
      subtitle: 'Highest & Lowest ranks by Category & Gender',
      icon: TrendingUp,
      route: '/cutoffs',
      color: 'from-purple-500/10 to-violet-500/10',
      iconColor: 'text-purple-600',
      border: 'hover:border-purple-300',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-indigo-600" />
            EAPCET 2026 Admissions Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Welcome, {currentStudent.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your Phase 1 & 2 transition result, college verification dates, and seat analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="view-full-profile-btn"
            type="button"
            onClick={() => navigateTo('/profile')}
            className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-2"
          >
            <UserCheck size={15} className="text-indigo-600" />
            <span>Complete Profile</span>
          </button>

          <button
            id="explore-search-btn"
            type="button"
            onClick={() => navigateTo('/search')}
            className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <Search size={14} />
            <span>Search Students</span>
          </button>
        </div>
      </div>

      {/* Primary Card: "Your Allotment" */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_-6px_rgba(20,30,60,0.06)] border border-slate-200/80 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/60 to-purple-50/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Allotment Summary
              </span>
              <StatusBadge status={status} size="md" />
            </div>

            {status === 'NO_SEAT' ? (
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-['Outfit']">
                  No Seat Allotted
                </h2>
                <p className="text-sm text-slate-500">
                  You have not been allotted a seat in Phase 1 or Phase 2 counseling. You may participate in the upcoming Special Round / Spot Admissions.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] leading-tight">
                  {finalCollege}
                </h2>
                <div className="flex items-center gap-2 text-indigo-700 font-semibold text-base sm:text-lg">
                  <Award size={18} className="text-indigo-600 shrink-0" />
                  <span>{finalBranch}</span>
                </div>

                {/* Sub-status contextual guidance */}
                {status === 'TRANSFERRED' && previousCollege && (
                  <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-bold">Transfer Note:</span>
                    <span>Transferred from <strong>{previousCollege}</strong> ({previousBranch}). Previous seat is canceled and re-allotted.</span>
                  </div>
                )}

                {status === 'UPGRADED_BRANCH' && previousBranch && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-bold">Branch Upgrade:</span>
                    <span>Upgraded within {finalCollege} from <strong>{previousBranch}</strong> to <strong>{finalBranch}</strong>.</span>
                  </div>
                )}

                {status === 'NEW_SEAT' && (
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-bold">Fresh Allotment:</span>
                    <span>Successfully secured seat in Phase 2 counseling. Complete tuition payment and report by Aug 28, 2026.</span>
                  </div>
                )}

                {status === 'RETAINED' && (
                  <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-100 text-sky-900 text-xs sm:text-sm flex items-center gap-2">
                    <span className="font-bold">Seat Retained:</span>
                    <span>Your Phase 1 allotment at {finalCollege} has been confirmed as your final allotment.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Metrics Pillar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 shrink-0 md:w-72">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hall Ticket</span>
              <span className="block text-sm font-extrabold text-slate-900 font-mono mt-0.5">{currentStudent.hallTicket}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">State Rank</span>
              <span className="block text-sm font-extrabold text-indigo-700 mt-0.5">#{currentStudent.rank.toLocaleString()}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
              <span className="block text-sm font-extrabold text-slate-900 mt-0.5">{currentStudent.category} ({currentStudent.gender})</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Local Region</span>
              <span className="block text-sm font-extrabold text-slate-900 mt-0.5">{currentStudent.region || 'OU'}</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Official EAPCET 2026 Counseling Authority Data</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/profile')}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 group"
          >
            <span>View Allotment Order & History</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* Quick Action Navigation Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
            Admission Intelligence & Tools
          </h3>
          <span className="text-xs text-slate-500">Instant access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <div
                key={action.title}
                id={`card-action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigateTo(action.route)}
                className={`bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md ${action.border} cursor-pointer transition-all duration-200 group flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center ${action.iconColor} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {action.title}
                  </h4>
                  
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {action.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Comparison Highlights */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Your Phase Transition Journey
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic comparison between Phase 1 and Phase 2 allotments
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/profile')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Detailed Breakdown →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1 Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold uppercase">
                PHASE 1 ALLOTMENT
              </span>
              <span className="text-xs text-slate-400">July 2026</span>
            </div>

            {phase1Record && phase1Record.allotted ? (
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {phase1Record.collegeName}
                </h4>
                <p className="text-xs font-medium text-slate-600">
                  {phase1Record.branchName} ({phase1Record.branchCode})
                </p>
                <div className="text-[11px] text-slate-500 pt-2">
                  College Code: <span className="font-mono font-bold text-slate-700">{phase1Record.collegeCode}</span>
                </div>
              </div>
            ) : (
              <div className="py-3 text-center">
                <span className="text-xs text-slate-400 font-medium">No seat allotted in Phase 1</span>
              </div>
            )}
          </div>

          {/* Phase 2 Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase">
                PHASE 2 ALLOTMENT
              </span>
              <span className="text-xs text-indigo-400">August 2026</span>
            </div>

            {phase2Record && phase2Record.allotted ? (
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {phase2Record.collegeName}
                </h4>
                <p className="text-xs font-medium text-indigo-700">
                  {phase2Record.branchName} ({phase2Record.branchCode})
                </p>
                <div className="text-[11px] text-slate-500 pt-2">
                  College Code: <span className="font-mono font-bold text-slate-700">{phase2Record.collegeCode}</span>
                </div>
              </div>
            ) : (
              <div className="py-3 text-center">
                <span className="text-xs text-slate-400 font-medium">No seat allotted in Phase 2</span>
              </div>
            )}
          </div>

          {/* Final Combined Result */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white relative shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-extrabold uppercase">
                FINAL / CURRENT
              </span>
              <StatusBadge status={status} size="sm" />
            </div>

            {status !== 'NO_SEAT' ? (
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white leading-snug">
                  {finalCollege}
                </h4>
                <p className="text-xs font-medium text-indigo-300">
                  {finalBranch}
                </p>
                <div className="text-[11px] text-slate-400 pt-2">
                  Status: <span className="font-bold text-emerald-400">{status.replace('_', ' ')}</span>
                </div>
              </div>
            ) : (
              <div className="py-3 text-center">
                <span className="text-xs text-slate-400 font-medium">No Final Seat</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
