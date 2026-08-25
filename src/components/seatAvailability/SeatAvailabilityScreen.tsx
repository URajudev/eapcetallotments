import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { PhaseType, Category, GenderCategory } from '../../types';
import { 
  FileSpreadsheet, 
  Search, 
  Building2, 
  Award, 
  Users, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

export const SeatAvailabilityScreen: React.FC = () => {
  const { activePhase, setActivePhase } = useApp();
  const [selectedCollege, setSelectedCollege] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<GenderCategory>('ALL');
  const [query, setQuery] = useState('');

  const colleges = useMemo(() => dataRepository.getAllColleges(), []);

  // Public category list: Standard regular categories + EWS (special categories removed per instruction)
  const regularCategories: Category[] = ['OC', 'EWS', 'BC-A', 'BC-B', 'BC-C', 'BC-D', 'BC-E', 'SC', 'ST'];

  const allSeats = useMemo(() => {
    return dataRepository.getSeatAvailability(
      activePhase,
      selectedCollege === 'ALL' ? undefined : selectedCollege,
      selectedBranch === 'ALL' ? undefined : selectedBranch,
      selectedCategory === 'ALL' ? undefined : (selectedCategory as Category),
      selectedGender
    );
  }, [activePhase, selectedCollege, selectedBranch, selectedCategory, selectedGender]);

  const filteredSeats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSeats;

    return allSeats.filter(s => 
      s.collegeName.toLowerCase().includes(q) ||
      s.collegeCode.toLowerCase().includes(q) ||
      s.branchName.toLowerCase().includes(q) ||
      s.branchCode.toLowerCase().includes(q)
    );
  }, [allSeats, query]);

  const totalVacantSeats = useMemo(() => {
    return filteredSeats.reduce((acc, curr) => acc + curr.availableSeats, 0);
  }, [filteredSeats]);

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileSpreadsheet size={13} className="text-amber-600" />
            Institutional Vacancy Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Seat Availability Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time vacancy tracking across engineering institutions, branches, and quota reservations.
          </p>
        </div>

        {/* Total Metric Card */}
        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4 self-start md:self-auto">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Vacancies Found
            </span>
            <span className="block text-xl font-extrabold text-amber-600 font-['Outfit']">
              {totalVacantSeats.toLocaleString()} Seats
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        
        {/* Search Input */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white rounded-2xl transition-all">
          <div className="pl-3.5 text-slate-400">
            <Search size={18} />
          </div>
          <input
            id="search-seat-matrix-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by college name, code, or engineering branch..."
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

        {/* 4 Multi-Select Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* College Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              College Institute
            </label>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Colleges</option>
              {colleges.map((c) => (
                <option key={c.collegeCode} value={c.collegeCode}>
                  {c.collegeCode} - {c.collegeName}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Branch Stream
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Branches</option>
              <option value="CSE">CSE - Computer Science</option>
              <option value="CSM">CSM - AI & Machine Learning</option>
              <option value="INF">INF - Information Tech</option>
              <option value="ECE">ECE - Electronics & Comm</option>
              <option value="EEE">EEE - Electrical & Electronics</option>
              <option value="MEC">MEC - Mechanical Engg</option>
              <option value="CIV">CIV - Civil Engg</option>
            </select>
          </div>

          {/* Category Filter (Regular + EWS, special removed) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Reservation Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Regular + EWS</option>
              {regularCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Gender Quota
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as GenderCategory)}
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500"
            >
              <option value="ALL">All Genders (Boys & Girls)</option>
              <option value="BOYS">Boys / General Quota</option>
              <option value="GIRLS">Girls Reservation Quota</option>
            </select>
          </div>

        </div>

      </div>

      {/* Seat Cards Grid (Card view on mobile, responsive grid on desktop) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {filteredSeats.length} Vacancy Records
          </span>

          {(selectedCollege !== 'ALL' || selectedBranch !== 'ALL' || selectedCategory !== 'ALL' || selectedGender !== 'ALL' || query) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCollege('ALL');
                setSelectedBranch('ALL');
                setSelectedCategory('ALL');
                setSelectedGender('ALL');
                setQuery('');
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredSeats.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs space-y-2">
            <Info size={28} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Seat Matrix Data for Selection</h3>
            <p className="text-xs text-slate-500">
              No matching vacancies found for the selected quota and branch filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSeats.map((seat) => {
              const vacancyPercentage = seat.totalIntake > 0 
                ? Math.round((seat.availableSeats / seat.totalIntake) * 100) 
                : 0;

              return (
                <div
                  key={seat.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Code & Category */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase">
                        {seat.collegeCode}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold">
                          {seat.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {seat.gender}
                        </span>
                      </div>
                    </div>

                    {/* College & Branch */}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {seat.collegeName}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-700 mt-1">
                      {seat.branchName} ({seat.branchCode})
                    </p>

                    {/* Vacancy Progress Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Available Seats:</span>
                        <span className="font-extrabold text-amber-600 text-sm">
                          {seat.availableSeats} <span className="text-xs font-normal text-slate-400">/ {seat.totalIntake} total</span>
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            seat.availableSeats === 0
                              ? 'bg-slate-300'
                              : seat.availableSeats > 5
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, (seat.filledSeats / seat.totalIntake) * 100))}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>Filled: {seat.filledSeats}</span>
                        <span>Vacant: {seat.availableSeats}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 text-[10px] text-slate-400 text-right">
                    Counseling Phase: {seat.phase}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
