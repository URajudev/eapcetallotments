import { PhaseAllotment, Student, DerivedAllotment, AllotmentStatus, PhaseType } from '../types';

/**
 * Deterministic Phase Merge Engine for EAPCET 2026
 * Computes canonical allotment status across all application modules.
 */
export function deriveFinalAllotment(
  phase1Record: PhaseAllotment | null | undefined,
  phase2Record: PhaseAllotment | null | undefined,
  student: Student
): DerivedAllotment {
  const p1Allotted = Boolean(phase1Record && phase1Record.allotted && phase1Record.collegeCode);
  const p2Allotted = Boolean(phase2Record && phase2Record.allotted && phase2Record.collegeCode);

  let status: AllotmentStatus = 'NO_SEAT';
  let statusDescription = 'No seat allotted in Phase 1 & Phase 2';
  let finalCollege: string | null = null;
  let finalCollegeCode: string | null = null;
  let finalBranch: string | null = null;
  let finalBranchCode: string | null = null;
  let previousCollege: string | null = null;
  let previousCollegeCode: string | null = null;
  let previousBranch: string | null = null;
  let previousBranchCode: string | null = null;

  if (!p1Allotted && !p2Allotted) {
    // TEST 5: Phase 1 no seat, Phase 2 no seat -> NO SEAT
    status = 'NO_SEAT';
    statusDescription = 'No seat allotted in Phase 1 or Phase 2';
  } else if (!p1Allotted && p2Allotted && phase2Record) {
    // TEST 1: Phase 1 no seat, Phase 2 CSE College A -> NEW SEAT
    status = 'NEW_SEAT';
    finalCollege = phase2Record.collegeName;
    finalCollegeCode = phase2Record.collegeCode;
    finalBranch = phase2Record.branchName;
    finalBranchCode = phase2Record.branchCode;
    statusDescription = `Newly allotted in Phase 2 at ${phase2Record.collegeName}`;
  } else if (p1Allotted && p2Allotted && phase1Record && phase2Record) {
    if (phase1Record.collegeCode !== phase2Record.collegeCode) {
      // TEST 2: Phase 1 College A CSE, Phase 2 College B CSE -> TRANSFERRED
      status = 'TRANSFERRED';
      finalCollege = phase2Record.collegeName;
      finalCollegeCode = phase2Record.collegeCode;
      finalBranch = phase2Record.branchName;
      finalBranchCode = phase2Record.branchCode;
      previousCollege = phase1Record.collegeName;
      previousCollegeCode = phase1Record.collegeCode;
      previousBranch = phase1Record.branchName;
      previousBranchCode = phase1Record.branchCode;
      statusDescription = `Transferred from ${phase1Record.collegeName}`;
    } else if (phase1Record.branchCode !== phase2Record.branchCode) {
      // TEST 3: Phase 1 College A Mechanical, Phase 2 College A CSE -> UPGRADED BRANCH
      status = 'UPGRADED_BRANCH';
      finalCollege = phase2Record.collegeName;
      finalCollegeCode = phase2Record.collegeCode;
      finalBranch = phase2Record.branchName;
      finalBranchCode = phase2Record.branchCode;
      previousCollege = phase1Record.collegeName;
      previousCollegeCode = phase1Record.collegeCode;
      previousBranch = phase1Record.branchName;
      previousBranchCode = phase1Record.branchCode;
      statusDescription = `Upgraded from ${phase1Record.branchName}`;
    } else {
      // TEST 4: Phase 1 College A CSE, Phase 2 unchanged -> RETAINED
      status = 'RETAINED';
      finalCollege = phase2Record.collegeName;
      finalCollegeCode = phase2Record.collegeCode;
      finalBranch = phase2Record.branchName;
      finalBranchCode = phase2Record.branchCode;
      statusDescription = `Retained Phase 1 Allotment at ${phase2Record.collegeName}`;
    }
  } else if (p1Allotted && !p2Allotted && phase1Record) {
    // Student allotted in Phase 1, Phase 2 had no change or retained
    status = 'RETAINED';
    finalCollege = phase1Record.collegeName;
    finalCollegeCode = phase1Record.collegeCode;
    finalBranch = phase1Record.branchName;
    finalBranchCode = phase1Record.branchCode;
    statusDescription = `Retained Phase 1 Allotment at ${phase1Record.collegeName}`;
  }

  // Active snapshot defaults to final
  const activeCollege = finalCollege;
  const activeCollegeCode = finalCollegeCode;
  const activeBranch = finalBranch;
  const activeBranchCode = finalBranchCode;

  return {
    student,
    status,
    statusDescription,
    finalCollege,
    finalCollegeCode,
    finalBranch,
    finalBranchCode,
    previousCollege,
    previousCollegeCode,
    previousBranch,
    previousBranchCode,
    phase1Record: phase1Record || null,
    phase2Record: phase2Record || null,
    activeCollege,
    activeCollegeCode,
    activeBranch,
    activeBranchCode,
  };
}

/**
 * Filter college students based on phase rule:
 * In 'FINAL' phase, transferred students MUST ONLY appear under their Phase 2 final college.
 * In 'PHASE_1' phase, students who were in Phase 1 appear under their Phase 1 college.
 * In 'PHASE_2' phase, students who were in Phase 2 appear under their Phase 2 college.
 */
export function getCollegeAllottedStudents(
  collegeCode: string,
  derivedList: DerivedAllotment[],
  phase: PhaseType,
  branchCode?: string
): DerivedAllotment[] {
  return derivedList.filter(item => {
    if (phase === 'FINAL') {
      const matchesCollege = item.finalCollegeCode === collegeCode;
      if (!matchesCollege) return false;
      if (branchCode) return item.finalBranchCode === branchCode;
      return true;
    } else if (phase === 'PHASE_1') {
      const p1 = item.phase1Record;
      if (!p1 || !p1.allotted || p1.collegeCode !== collegeCode) return false;
      if (branchCode) return p1.branchCode === branchCode;
      return true;
    } else if (phase === 'PHASE_2') {
      const p2 = item.phase2Record;
      if (!p2 || !p2.allotted || p2.collegeCode !== collegeCode) return false;
      if (branchCode) return p2.branchCode === branchCode;
      return true;
    }
    return false;
  });
}
