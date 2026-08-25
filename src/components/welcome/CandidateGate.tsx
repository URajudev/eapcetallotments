import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { Student } from '../../types';
import { Search, UserCheck, ShieldCheck, ArrowRight, Sparkles, GraduationCap, AlertCircle, Info, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const CandidateGate: React.FC = () => {
  const { selectStudent, handleLogoClick, logoClicks } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Student | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic Autocomplete strictly derived from actual dataset
  const matchingStudents = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return dataRepository.searchCandidateNames(searchTerm);
  }, [searchTerm]);

  const handleSelect = (student: Student) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // Ignored in non-browser envs
    }
    selectStudent(student);
  };

  // Preset demo candidate buttons for instant evaluation
  const demoShortcuts = [
    { label: 'Transferred', name: 'Prasanth Kumar', tag: 'Transferred: ABC → XYZ' },
    { label: 'Upgraded Branch', name: 'Praveen Reddy', tag: 'Upgraded: MEC → CSE' },
    { label: 'New Seat', name: 'Pradeep Kumar', tag: 'P1: No Seat → P2: ABCE CSE' },
    { label: 'Retained', name: 'Sai Kumar', tag: 'Retained: JNTUH CSE' },
    { label: 'No Seat', name: 'Pranav Reddy', tag: 'P1: None → P2: None' },
    { label: 'EWS Category', name: 'Sneha Reddy', tag: 'EWS: MGIT → CBIT' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F6FC] via-[#F8F9FC] to-[#EFF2FA] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Banner with Logo click target for hidden admin */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pt-2 sm:pt-4">
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="State Council of Higher Education"
          id="eapcet-logo-gate"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 font-['Outfit']">EAPCET 2026</span>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">OFFICIAL</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">State Council of Higher Education</p>
          </div>
        </div>

        {logoClicks > 0 && logoClicks < 7 && (
          <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full font-mono animate-pulse">
            Passcode Gate ({7 - logoClicks})
          </span>
        )}

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/80 backdrop-blur-sm border border-slate-200/70 px-3.5 py-1.5 rounded-full shadow-2xs">
          <ShieldCheck size={14} className="text-indigo-600" />
          <span>Verified Admission Records</span>
        </div>
      </header>

      {/* Main Center Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_-12px_rgba(20,30,60,0.08)] border border-slate-100/90 relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/8 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/8 rounded-full blur-2xl pointer-events-none" />

          {/* Heading and Subheading */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={13} className="text-indigo-600" />
              Phase 1 & Phase 2 Integrated
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
              EAPCET 2026
            </h1>
            
            <h2 className="text-lg sm:text-xl font-semibold text-slate-600 mt-1">
              Allotment Records
            </h2>
            
            <p className="text-sm text-slate-500 mt-3 max-w-sm mx-auto font-normal">
              Enter your registered candidate name to securely access personalized Phase 1, Phase 2, and Final allotment intelligence.
            </p>
          </div>

          {/* Name Input Box */}
          <div className="space-y-4 relative z-10">
            <div>
              <label htmlFor="candidate-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Enter your name to continue
              </label>
              
              <div className={`relative flex items-center transition-all duration-200 rounded-2xl border-2 ${
                isFocused 
                  ? 'border-indigo-600 ring-4 ring-indigo-500/10 bg-white shadow-xs' 
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}>
                <div className="pl-4 text-slate-400">
                  <Search size={18} className={isFocused ? 'text-indigo-600' : 'text-slate-400'} />
                </div>
                
                <input
                  id="candidate-name-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 250)}
                  placeholder="Start typing your full name (e.g., Prasanth)..."
                  autoComplete="off"
                  className="w-full py-3.5 pl-3 pr-4 text-sm sm:text-base font-medium text-slate-900 bg-transparent rounded-2xl outline-none placeholder:text-slate-400"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="mr-3 text-xs bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-slate-300"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Autocomplete List (Derived strictly from real dataset) */}
            <AnimatePresence>
              {searchTerm.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {matchingStudents.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-3 text-amber-800 text-xs sm:text-sm">
                      <AlertCircle size={18} className="shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-bold">No matching candidate found</span>
                        <p className="text-amber-700/90 mt-0.5 text-xs">
                          Please verify your name spelling against your registered EAPCET 2026 Hall Ticket or select one of the demonstration candidates below.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
                        <span>Matching Registered Records ({matchingStudents.length})</span>
                        <span>Click to View Records</span>
                      </div>

                      {matchingStudents.map((student) => {
                        const maskedHT = student.hallTicket.length >= 8 
                          ? `${student.hallTicket.slice(0, 4)}••••${student.hallTicket.slice(-2)}`
                          : student.hallTicket;

                        return (
                          <div
                            key={student.id}
                            id={`candidate-row-${student.id}`}
                            onClick={() => handleSelect(student)}
                            className="group p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 cursor-pointer transition-all duration-150 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 group-hover:border-indigo-300 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 transition-colors">
                                {student.gender === 'Male' ? 'M' : 'F'}
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-950 truncate">
                                  {student.name}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                                  <span className="font-mono text-slate-600">{maskedHT}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-slate-700">Rank #{student.rank.toLocaleString()}</span>
                                  <span>•</span>
                                  <span className="px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                                    {student.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="shrink-0 p-2 rounded-xl bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white border border-slate-200 group-hover:border-indigo-600 transition-all"
                            >
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Demo Candidates Selector */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                <Info size={14} className="text-indigo-500" />
                <span>Quick Demonstration Candidates</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {demoShortcuts.map((demo) => (
                  <button
                    key={demo.name}
                    type="button"
                    id={`demo-btn-${demo.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      const found = dataRepository.searchCandidateNames(demo.name)[0];
                      if (found) handleSelect(found);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 text-left transition-all group"
                  >
                    <span className="block text-[11px] font-bold text-indigo-700 uppercase tracking-wider truncate">
                      {demo.label}
                    </span>
                    <span className="block text-xs font-semibold text-slate-900 truncate mt-0.5">
                      {demo.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 truncate mt-0.5">
                      {demo.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 text-center border-t border-slate-100/80">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <Lock size={12} className="text-slate-400" />
              Candidate gate establishes session state without public credential exposure.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 pb-2">
        <p>© 2026 State Council of Higher Education. All Rights Reserved.</p>
        <p className="text-[11px] text-slate-400 mt-0.5">EAPCET Admissions Counseling Portal • Telangana & Andhra Pradesh</p>
      </footer>
    </div>
  );
};
