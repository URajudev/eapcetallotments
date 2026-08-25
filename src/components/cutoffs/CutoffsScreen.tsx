import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { PhaseType, Category, CutoffRecord } from '../../types';
import { 
  TrendingUp, 
  Search, 
  Building2, 
  Award, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

export const CutoffsScreen: React.FC = () => {
  const { activePhase, setActivePhase } = useApp();
  const [genderTab, setGenderTab] = useState<'BOYS' | 'GIRLS'>('BOYS');
  const [selectedCollege, setSelectedCollege] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  const colleges = useMemo(() => dataRepository.getAllColleges(), []);

  // Public category list: Standard regular categories + EWS (special categories excluded)
  const regularCategories: Category[] = ['OC', 'EWS', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST'];

  // Fetch cutoffs dynamically from repo
  const cutoffs = useMemo(() => {
    return dataRepository.getCutoffs(
      activePhase,
      selectedCollege === 'ALL' ? undefined : selectedCollege,
      selectedBranch === 'ALL' ? undefined : selectedBranch,
      selectedCategory === 'ALL' ? undefined : (selectedCategory as Category),
      genderTab
    );
  }, [activePhase, selectedCollege, selectedBranch, selectedCategory, genderTab]);

  const filteredCutoffs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cutoffs;

    return cutoffs.filter(co =>
      co.collegeName.toLowerCase().includes(q) ||
      co.collegeCode.toLowerCase().includes(q) ||
      co.branchName.toLowerCase().includes(q) ||
      co.branchCode.toLowerCase().includes(q)
    );
  }, [cutoffs, query]);

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp size={13} className="text-purple-600" />
            Closing & Opening Rank Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Cutoff Ranks Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Opening (Highest) and Closing (Lowest) allotment ranks calculated across categories and genders.
          </p>
        </div>

        {/* Boys / Girls Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200/80 self-start md:self-auto">
          <button
            id="cutoff-tab-boys"
            type="button"
            onClick={() => setGenderTab('BOYS')}
            className={`px-5 py-2 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all ${
              genderTab === 'BOYS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Boys Cutoffs
          </button>
          <button
            id="cutoff-tab-girls"
            type="button"
            onClick={() => setGenderTab('GIRLS')}
            className={`px-5 py-2 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all ${
              genderTab === 'GIRLS'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Girls Cutoffs
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        
        {/* Search Input */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-purple-500 focus-within:bg-white rounded-2xl transition-all">
          <div className="pl-3.5 text-slate-400">
            <Search size={18} />
          </div>
          <input
            id="search-cutoffs-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cutoff by college (e.g. ABCE, JNTU, CBIT) or branch..."
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

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* College Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              College Institute
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-500"
            >
              <option value="ALL">All Colleges</option>
              {colleges.map((c) => (
                <option key={c.collegeCode} value={c.collegeCode}>
                  {c.collegeCode} - {c.collegeName}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Engineering Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-500"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE - Computer Science</option>
              <option value="CSM">CSM - Artificial Intelligence</option>
              <option value="INF">INF - Information Technology</option>
              <option value="ECE">ECE - Electronics & Comm</option>
              <option value="EEE">EEE - Electrical & Electronics</option>
              <option value="MEC">MEC - Mechanical Engg</option>
              <option value="CIV">CIV - Civil Engg</option>
            </select>
          </div>

          {/* Category Dropdown (EWS + Regular categories) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Category (EWS + Regular)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-500"
            >
              <option value="ALL">All Regular & EWS Categories</option>
              {regularCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Ranks Calculation Logic Clarification Pill */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
        <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Cutoff Calculation Standard: </span>
          <span>
            <strong>Highest Rank</strong> is the best/lowest numeric rank (e.g. #125), and <strong>Lowest Rank</strong> is the closing rank (e.g. #3,489). Calculated across {genderTab} quota.
          </span>
        </div>
      </div>

      {/* Cutoff Results Table / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {genderTab} Cutoff Records ({filteredCutoffs.length})
          </span>

          {(selectedCollege !== 'ALL' || selectedBranch !== 'ALL' || selectedCategory !== 'ALL' || query) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCollege('ALL');
                setSelectedBranch('ALL');
                setSelectedCategory('ALL');
                setQuery('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredCutoffs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs space-y-2">
            <Info size={28} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No cutoff data available for this selection.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your category or selecting "All Branches" to view existing opening & closing ranks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCutoffs.map((co) => (
              <div
                key={co.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header: Code & Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-full uppercase">
                      {co.collegeCode}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold">
                        {co.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        {co.gender}
                      </span>
                    </div>
                  </div>

                  {/* College & Branch */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {co.collegeName}
                  </h3>
                  <p className="text-xs font-semibold text-purple-700 mt-1">
                    {co.branchName} ({co.branchCode})
                  </p>

                  {/* Highest & Lowest Rank Highlight Boxes */}
                  <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-slate-100">
                    
                    {/* Highest Rank (Minimum Numeric Rank) */}
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        <ArrowUpRight size={13} />
                        <span>Highest Rank</span>
                      </div>
                      <span className="block text-base font-extrabold text-emerald-900 font-mono mt-0.5">
                        #{co.highestRank.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-emerald-600 block">Opening Rank</span>
                    </div>

                    {/* Lowest Rank (Maximum Numeric Rank / Closing Rank) */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        <ArrowDownRight size={13} />
                        <span>Lowest Rank</span>
                      </div>
                      <span className="block text-base font-extrabold text-slate-900 font-mono mt-0.5">
                        #{co.lowestRank.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-slate-500 block">Closing Rank</span>
                    </div>

                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Admitted Count: {co.totalAdmitted} candidates</span>
                  <span className="font-semibold">{co.isDerived ? 'Derived from Allotments' : 'Official Table'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
