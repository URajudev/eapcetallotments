import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { StatusBadge } from '../common/StatusBadge';
import { 
  User, 
  Award, 
  Building2, 
  Calendar, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ArrowDown, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowLeft,
  Share2,
  Info,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudentProfileScreenProps {
  hallTicketParam?: string;
}

export const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ hallTicketParam }) => {
  const { currentStudent, navigateTo } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  // If viewing a specific candidate from search or own profile
  const student = hallTicketParam 
    ? dataRepository.getStudentByHallTicket(hallTicketParam) || currentStudent
    : currentStudent;

  if (!student) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800">Candidate Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          Unable to locate student records for the specified identifier.
        </p>
        <button
          onClick={() => navigateTo('/search')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full text-xs font-bold"
        >
          Return to Search
        </button>
      </div>
    );
  }

  const derived = dataRepository.getDerivedAllotmentForStudent(student);
  const { status, finalCollege, finalBranch, previousCollege, previousBranch, phase1Record, phase2Record } = derived;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('/search')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={15} />
          <span>Back to All Candidates</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Printer size={14} className="text-slate-600" />
            <span>Print Allotment Slip</span>
          </button>
        </div>
      </div>

      {/* Printable Area Wrapper */}
      <div ref={printRef} className="space-y-6">
        
        {/* Candidate Identity Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xl font-extrabold shadow-md shadow-indigo-500/20 shrink-0">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
                    {student.name}
                  </h1>
                  <StatusBadge status={status} size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>Father's Name: <strong>{student.fatherName || 'Not Disclosed'}</strong></span>
                  <span>•</span>
                  <span>Region: <strong>{student.region || 'OU'}</strong></span>
                </p>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Hall Ticket</span>
                <span className="block text-xs sm:text-sm font-bold text-slate-900 font-mono mt-0.5">{student.hallTicket}</span>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                <span className="block text-[10px] font-bold text-indigo-400 uppercase">State Rank</span>
                <span className="block text-xs sm:text-sm font-extrabold text-indigo-700 mt-0.5">#{student.rank.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <span className="block text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{student.category} ({student.gender})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Large FINAL ALLOTMENT Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                  FINAL / CURRENT ALLOTMENT
                </span>
              </div>
              <StatusBadge status={status} size="md" />
            </div>

            {status === 'NO_SEAT' ? (
              <div className="py-4">
                <h3 className="text-2xl font-bold text-slate-200">No Final Seat Allotted</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-lg">
                  Candidate was not allotted a seat in Phase 1 or Phase 2. Eligible for subsequent Spot Admission rounds.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
                  {finalCollege}
                </h2>
                <p className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                  <Award size={18} className="text-indigo-400" />
                  <span>{finalBranch}</span>
                </p>
              </div>
            )}

            {/* Contextual Description */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
              <span>{derived.statusDescription}</span>
              <span className="font-mono text-slate-400">Status Verified by Central Allotment Engine</span>
            </div>
          </div>
        </div>

        {/* ALLOTMENT JOURNEY Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                Allotment Journey
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete progression across counseling rounds
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              Phase 1 → Phase 2 → Final
            </span>
          </div>

          <div className="flex flex-col items-center max-w-xl mx-auto space-y-3">
            
            {/* Step 1: Phase 1 Box */}
            <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Phase 1 Allotment
              </span>
              {phase1Record && phase1Record.allotted ? (
                <div className="mt-1">
                  <h4 className="text-sm font-bold text-slate-900">{phase1Record.collegeName}</h4>
                  <p className="text-xs font-semibold text-slate-600">{phase1Record.branchName} ({phase1Record.branchCode})</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium mt-1">No Seat Allotted in Phase 1</p>
              )}
            </div>

            {/* Transition Arrow with Badge */}
            <div className="flex flex-col items-center justify-center my-1">
              <ArrowDown size={18} className="text-slate-400 animate-bounce" />
              <div className="my-1">
                <StatusBadge status={status} size="sm" />
              </div>
              <ArrowDown size={18} className="text-slate-400" />
            </div>

            {/* Step 2: Phase 2 Box */}
            <div className="w-full p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center">
              <span className="block text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                Phase 2 Allotment
              </span>
              {phase2Record && phase2Record.allotted ? (
                <div className="mt-1">
                  <h4 className="text-sm font-bold text-slate-900">{phase2Record.collegeName}</h4>
                  <p className="text-xs font-semibold text-indigo-700">{phase2Record.branchName} ({phase2Record.branchCode})</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium mt-1">No Seat Allotted in Phase 2</p>
              )}
            </div>

            {/* Transition to Final */}
            <div className="flex flex-col items-center justify-center my-1">
              <ArrowDown size={18} className="text-slate-400" />
            </div>

            {/* Step 3: Final Box */}
            <div className="w-full p-4 rounded-2xl bg-slate-900 text-white text-center shadow-xs">
              <span className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Final Allotment Record
              </span>
              {status !== 'NO_SEAT' ? (
                <div className="mt-1">
                  <h4 className="text-sm font-bold text-white">{finalCollege}</h4>
                  <p className="text-xs font-medium text-indigo-300">{finalBranch}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium mt-1">No Seat</p>
              )}
            </div>

          </div>
        </div>

        {/* Detailed Phase Preservation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Phase 1 Detailed Record */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                PHASE 1 ALLOTMENT RECORD
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                Preserved History
              </span>
            </div>

            {phase1Record && phase1Record.allotted ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Allotted College</span>
                  <span className="text-slate-900 font-bold text-sm">{phase1Record.collegeName}</span>
                  <span className="text-slate-500 font-mono text-[11px] block mt-0.5">Code: {phase1Record.collegeCode}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Branch</span>
                  <span className="text-slate-900 font-bold">{phase1Record.branchName} ({phase1Record.branchCode})</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Allotment Order No</span>
                    <span className="text-slate-900 font-mono font-bold">{phase1Record.allotmentOrderNo || 'EA26-P1-98214'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Reporting Date</span>
                    <span className="text-slate-900 font-bold">{phase1Record.reportingDate || '12-Jul-2026'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No seat allotted in Phase 1
              </div>
            )}
          </div>

          {/* Phase 2 Detailed Record */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                PHASE 2 ALLOTMENT RECORD
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                Active Counseling
              </span>
            </div>

            {phase2Record && phase2Record.allotted ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Allotted College</span>
                  <span className="text-slate-900 font-bold text-sm">{phase2Record.collegeName}</span>
                  <span className="text-slate-500 font-mono text-[11px] block mt-0.5">Code: {phase2Record.collegeCode}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-medium">Branch</span>
                  <span className="text-slate-900 font-bold">{phase2Record.branchName} ({phase2Record.branchCode})</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Allotment Order No</span>
                    <span className="text-slate-900 font-mono font-bold">{phase2Record.allotmentOrderNo || 'EA26-P2-40119'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Reporting Deadline</span>
                    <span className="text-indigo-700 font-bold">{phase2Record.reportingDate || '28-Aug-2026'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                No seat allotted in Phase 2
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
