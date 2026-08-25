import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { StatusBadge } from '../common/StatusBadge';
import { DerivedAllotment, AllotmentStatus, Category, Gender } from '../../types';
import { 
  Search, 
  Filter, 
  User, 
  Award, 
  Building2, 
  ArrowRight, 
  SlidersHorizontal, 
  X, 
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SearchScreen: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchMode, setSearchMode] = useState<'NAME' | 'HALL_TICKET'>('NAME');
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all derived allotments
  const allAllotments = useMemo(() => {
    return dataRepository.getAllDerivedAllotments();
  }, []);

  // Filtered Results
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    return allAllotments.filter((item) => {
      // Query filter
      if (q) {
        if (searchMode === 'NAME') {
          const matchesName = item.student.name.toLowerCase().includes(q);
          const matchesCollege = item.finalCollege?.toLowerCase().includes(q) || item.phase1Record?.collegeName.toLowerCase().includes(q);
          const matchesBranch = item.finalBranch?.toLowerCase().includes(q);
          if (!matchesName && !matchesCollege && !matchesBranch) return false;
        } else {
          // Hall Ticket mode (exact or prefix)
          if (!item.student.hallTicket.toLowerCase().includes(q)) return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && item.student.category !== selectedCategory) {
        return false;
      }

      // Gender filter
      if (selectedGender !== 'ALL' && item.student.gender !== selectedGender) {
        return false;
      }

      return true;
    });
  }, [allAllotments, query, searchMode, selectedStatus, selectedCategory, selectedGender]);

  const categories: Category[] = ['OC', 'EWS', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST'];
  const statuses: { label: string; value: string }[] = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'New Seat', value: 'NEW_SEAT' },
    { label: 'Transferred', value: 'TRANSFERRED' },
    { label: 'Upgraded Branch', value: 'UPGRADED_BRANCH' },
    { label: 'Retained', value: 'RETAINED' },
    { label: 'No Seat', value: 'NO_SEAT' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Search size={13} className="text-indigo-600" />
          Master Allotment Records Search
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Search Allotment Records
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search real registered candidates, check Phase 1 & 2 transitions, and view official allotment history.
        </p>
      </div>

      {/* Main Search Controls Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xs border border-slate-200/80 space-y-4">
        
        {/* Toggle Mode: [ NAME ] vs [ HALL TICKET ] */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="inline-flex bg-slate-100 p-1 rounded-full border border-slate-200/80">
            <button
              type="button"
              id="search-mode-name"
              onClick={() => {
                setSearchMode('NAME');
                setQuery('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                searchMode === 'NAME'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Name Search
            </button>
            <button
              type="button"
              id="search-mode-ht"
              onClick={() => {
                setSearchMode('HALL_TICKET');
                setQuery('');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
                searchMode === 'HALL_TICKET'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hall Ticket Search
            </button>
          </div>

          {/* Toggle Filter Panel */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
              showFilters || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedGender !== 'ALL'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {(selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedGender !== 'ALL') && (
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl transition-all">
          <div className="pl-4 text-slate-400">
            <Search size={19} className="text-slate-400" />
          </div>
          <input
            id="search-candidate-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              searchMode === 'NAME'
                ? 'Type student name (e.g. Prasanth, Praveen, Sneha, Sai)...'
                : 'Enter 10-digit Hall Ticket number (e.g. 2601011245)...'
            }
            className="w-full py-3.5 pl-3 pr-4 text-sm sm:text-base font-medium text-slate-900 bg-transparent rounded-2xl outline-none placeholder:text-slate-400"
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

        {/* Expandable Filter Bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {/* Status Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Allotment Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Social Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                >
                  <option value="ALL">All Genders</option>
                  <option value="Male">Boys / Male</option>
                  <option value="Female">Girls / Female</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Found {filteredResults.length} Candidate Records
        </span>
        
        {(query || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedGender !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedStatus('ALL');
              setSelectedCategory('ALL');
              setSelectedGender('ALL');
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Matching Candidate Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or clearing active filters to browse the complete 2026 allotment dataset.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResults.map((item) => {
            const { student, status, finalCollege, finalBranch } = item;

            return (
              <div
                key={student.id}
                id={`student-card-${student.hallTicket}`}
                onClick={() => navigateTo(`/student/${student.hallTicket}`, { hallTicket: student.hallTicket })}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Student Name & Status Badge directly below name */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {student.name}
                      </h3>
                      {/* CRITICAL: Status badge appears DIRECTLY BELOW name */}
                      <div className="mt-1">
                        <StatusBadge status={status} size="sm" />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                        Rank #{student.rank.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Identification Attributes */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                    <span className="font-mono text-slate-700 font-semibold">{student.hallTicket}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {student.category}
                    </span>
                    <span>•</span>
                    <span>{student.gender}</span>
                    <span>•</span>
                    <span>Region: {student.region || 'OU'}</span>
                  </div>

                  {/* Allotment Details */}
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Current Allotment
                    </span>
                    {status === 'NO_SEAT' ? (
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">
                        No seat allotted in Phase 1 or 2
                      </span>
                    ) : (
                      <div className="mt-0.5">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {finalCollege}
                        </span>
                        <span className="text-xs font-medium text-indigo-600 block truncate">
                          {finalBranch}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>View Complete Allotment Order</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
