import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { PhaseType } from '../../types';
import { 
  Building2, 
  Search, 
  MapPin, 
  Award, 
  Users, 
  ChevronRight, 
  SlidersHorizontal,
  Layers,
  GraduationCap
} from 'lucide-react';

export const CollegeListScreen: React.FC = () => {
  const { navigateTo, activePhase, setActivePhase } = useApp();
  const [query, setQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  const colleges = useMemo(() => {
    return dataRepository.getAllColleges();
  }, []);

  const districts = useMemo(() => {
    const set = new Set(colleges.map(c => c.district));
    return Array.from(set);
  }, [colleges]);

  const filteredColleges = useMemo(() => {
    const q = query.trim().toLowerCase();
    return colleges.filter(c => {
      if (q) {
        const matchesName = c.collegeName.toLowerCase().includes(q);
        const matchesCode = c.collegeCode.toLowerCase().includes(q);
        const matchesLoc = c.location.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesLoc) return false;
      }

      if (districtFilter !== 'ALL' && c.district !== districtFilter) {
        return false;
      }

      return true;
    });
  }, [colleges, query, districtFilter]);

  const phases: { id: PhaseType; label: string }[] = [
    { id: 'PHASE_1', label: 'Phase 1 Records' },
    { id: 'PHASE_2', label: 'Phase 2 Records' },
    { id: 'FINAL', label: 'Final / Combined' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 size={13} className="text-emerald-600" />
            Institutional Allotment Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            College-Wise Allotments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse participating engineering institutes, intake counts, and active branch allocations.
          </p>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80 self-start md:self-auto">
          {phases.map((p) => (
            <button
              key={p.id}
              id={`college-phase-tab-${p.id.toLowerCase()}`}
              type="button"
              onClick={() => setActivePhase(p.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                activePhase === p.id
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full flex items-center bg-slate-50 border border-slate-200 focus-within:border-emerald-600 focus-within:bg-white rounded-2xl transition-all">
          <div className="pl-3.5 text-slate-400">
            <Search size={18} />
          </div>
          <input
            id="search-college-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search college by name, code (e.g. ABCE, JNTU, CBIT), or location..."
            className="w-full py-3 pl-2.5 pr-4 text-xs sm:text-sm font-medium text-slate-900 bg-transparent rounded-2xl outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-3 text-xs bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-slate-300"
            >
              ×
            </button>
          )}
        </div>

        {/* District selector */}
        <div className="w-full sm:w-56 shrink-0">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* College Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredColleges.map((college) => {
          const allottedCount = activePhase === 'PHASE_1' 
            ? college.phase1Allotted 
            : activePhase === 'PHASE_2' 
            ? college.phase2Allotted 
            : college.finalAllotted;

          return (
            <div
              key={college.collegeCode}
              id={`college-card-${college.collegeCode}`}
              onClick={() => navigateTo(`/college/${college.collegeCode}`, { collegeCode: college.collegeCode })}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header: Code & Type */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {college.collegeCode}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {college.naacGrade && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        NAAC {college.naacGrade}
                      </span>
                    )}
                    {college.nirfRank && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        NIRF #{college.nirfRank}
                      </span>
                    )}
                  </div>
                </div>

                {/* College Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {college.collegeName}
                </h3>

                {/* Location */}
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span>{college.location}</span>
                </p>

                {/* Branch Badges */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                    Branches:
                  </span>
                  {college.branches.map((b) => (
                    <span
                      key={b.branchCode}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold"
                    >
                      {b.branchCode}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Allotments Metric */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Users size={14} className="text-emerald-600" />
                  <span className="text-slate-600 font-medium">Allotments:</span>
                  <span className="font-extrabold text-slate-900">
                    {allottedCount} / {college.totalIntake} seats
                  </span>
                </div>

                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>View Branch Lists</span>
                  <ChevronRight size={15} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
