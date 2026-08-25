import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { StatusBadge } from '../common/StatusBadge';
import { PhaseType } from '../../types';
import { 
  Building2, 
  MapPin, 
  Award, 
  Users, 
  ArrowLeft, 
  Search, 
  GraduationCap, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface CollegeDetailScreenProps {
  collegeCode: string;
}

export const CollegeDetailScreen: React.FC<CollegeDetailScreenProps> = ({ collegeCode }) => {
  const { navigateTo, activePhase, setActivePhase } = useApp();
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  const college = dataRepository.getCollegeByCode(collegeCode);

  // Fetch students for this college respecting the active phase
  const allottedStudents = useMemo(() => {
    if (!college) return [];
    return dataRepository.getStudentsForCollege(
      college.collegeCode, 
      activePhase, 
      selectedBranch === 'ALL' ? undefined : selectedBranch
    );
  }, [college, activePhase, selectedBranch]);

  // Filter students by query
  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return allottedStudents;

    return allottedStudents.filter((item) => {
      return (
        item.student.name.toLowerCase().includes(q) ||
        item.student.hallTicket.includes(q) ||
        item.student.rank.toString().includes(q)
      );
    });
  }, [allottedStudents, studentSearch]);

  if (!college) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">College not found.</p>
        <button
          onClick={() => navigateTo('/colleges')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold"
        >
          Back to Colleges
        </button>
      </div>
    );
  }

  const phases: { id: PhaseType; label: string }[] = [
    { id: 'PHASE_1', label: 'Phase 1 Allotments' },
    { id: 'PHASE_2', label: 'Phase 2 Allotments' },
    { id: 'FINAL', label: 'Final / Current List' },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigateTo('/colleges')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={15} />
        <span>Back to All Colleges</span>
      </button>

      {/* College Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                {college.collegeCode}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {college.collegeType}
              </span>
              {college.naacGrade && (
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  NAAC {college.naacGrade}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              {college.collegeName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400 shrink-0" />
              <span>{college.location} • {college.district}</span>
            </p>
          </div>

          {/* Phase Filter Selector */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Viewing Allotment Phase
            </span>
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80">
              {phases.map((p) => (
                <button
                  key={p.id}
                  id={`detail-phase-${p.id.toLowerCase()}`}
                  type="button"
                  onClick={() => setActivePhase(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    activePhase === p.id
                      ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phase Contextual Note */}
        {activePhase === 'FINAL' && (
          <div className="mt-4 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
            <span>
              <strong>Final Combined Rule Active:</strong> Displays confirmed admitted students. Students transferred to other institutes have been reassigned to their destination college.
            </span>
          </div>
        )}
      </div>

      {/* Branch Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          id="branch-chip-all"
          onClick={() => setSelectedBranch('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all border ${
            selectedBranch === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Branches ({allottedStudents.length})
        </button>

        {college.branches.map((b) => (
          <button
            key={b.branchCode}
            id={`branch-chip-${b.branchCode.toLowerCase()}`}
            type="button"
            onClick={() => setSelectedBranch(b.branchCode)}
            className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all border ${
              selectedBranch === b.branchCode
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {b.branchCode} - {b.branchName}
          </button>
        ))}
      </div>

      {/* Student Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <div className="pl-2 text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          placeholder={`Search ${college.collegeCode} admitted students by name or rank...`}
          className="w-full text-xs sm:text-sm font-medium text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
        />
        {studentSearch && (
          <button
            type="button"
            onClick={() => setStudentSearch('')}
            className="text-xs bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center mr-1"
          >
            ×
          </button>
        )}
      </div>

      {/* Branch Sections & Admitted Students */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
            Admitted Students ({filteredStudents.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Counseling Phase: {activePhase}
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-2xs">
            <Users size={32} className="text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No student records for this selection</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try selecting "All Branches" or switching to Phase 1 / Phase 2 records.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((item) => {
              const { student, status, finalBranch, phase1Record, phase2Record } = item;
              const displayBranch = activePhase === 'PHASE_1' 
                ? phase1Record?.branchName 
                : activePhase === 'PHASE_2' 
                ? phase2Record?.branchName 
                : finalBranch;

              return (
                <div
                  key={student.id}
                  id={`college-student-${student.hallTicket}`}
                  onClick={() => navigateTo(`/student/${student.hallTicket}`, { hallTicket: student.hallTicket })}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Student Name & STATUS BADGE DIRECTLY BELOW NAME */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {student.name}
                      </h3>
                      
                      {/* CRITICAL: Status badge placed DIRECTLY BELOW the student name */}
                      <div className="mt-1">
                        <StatusBadge status={status} size="sm" />
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                      <span className="font-mono text-slate-700 font-semibold">{student.hallTicket}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-800">Rank #{student.rank.toLocaleString()}</span>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {student.category}
                      </span>
                      <span>•</span>
                      <span>{student.gender}</span>
                    </div>

                    {/* Branch Info */}
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Branch</span>
                      <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                        {displayBranch}
                      </span>
                    </div>
                  </div>

                  {/* Open Profile CTA */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Full Student Allotment</span>
                    <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
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
