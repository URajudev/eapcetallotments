export type Gender = 'Male' | 'Female';
export type GenderCategory = 'BOYS' | 'GIRLS' | 'ALL';

export type Category = 'OC' | 'EWS' | 'BC-A' | 'BC-B' | 'BC-C' | 'BC-D' | 'BC-E' | 'SC' | 'ST';

export type PhaseType = 'PHASE_1' | 'PHASE_2' | 'FINAL';

export type AllotmentStatus = 
  | 'NEW_SEAT'
  | 'TRANSFERRED'
  | 'UPGRADED_BRANCH'
  | 'RETAINED'
  | 'NO_SEAT';

export interface Student {
  id: string;
  hallTicket: string;
  name: string;
  gender: Gender;
  category: Category;
  rank: number;
  fatherName?: string;
  region?: string;
  email?: string;
}

export interface PhaseAllotment {
  studentId: string;
  hallTicket: string;
  phase: 'PHASE_1' | 'PHASE_2';
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  category: Category;
  gender: Gender;
  rank: number;
  allotted: boolean;
  allotmentOrderNo?: string;
  reportingDate?: string;
}

export interface DerivedAllotment {
  student: Student;
  status: AllotmentStatus;
  statusDescription: string;
  
  // Current / Final Allotment
  finalCollege: string | null;
  finalCollegeCode: string | null;
  finalBranch: string | null;
  finalBranchCode: string | null;
  
  // Previous Allotment (if transferred or upgraded)
  previousCollege: string | null;
  previousCollegeCode: string | null;
  previousBranch: string | null;
  previousBranchCode: string | null;
  
  // Raw records preserved
  phase1Record: PhaseAllotment | null;
  phase2Record: PhaseAllotment | null;
  
  // Active phase snapshot
  activeCollege: string | null;
  activeCollegeCode: string | null;
  activeBranch: string | null;
  activeBranchCode: string | null;
}

export interface SeatAvailability {
  id: string;
  phase: PhaseType;
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  category: Category;
  gender: GenderCategory;
  availableSeats: number;
  totalIntake: number;
  filledSeats: number;
}

export interface CutoffRecord {
  id: string;
  phase: PhaseType;
  collegeCode: string;
  collegeName: string;
  branchCode: string;
  branchName: string;
  category: Category;
  gender: 'BOYS' | 'GIRLS';
  highestRank: number; // Minimum numeric rank (e.g., 120 is higher rank than 1500)
  lowestRank: number;  // Maximum numeric rank (closing cutoff rank)
  totalAdmitted: number;
  isDerived: boolean;
}

export interface BranchInfo {
  branchCode: string;
  branchName: string;
  intake: number;
  phase1Allotted: number;
  phase2Allotted: number;
  finalAllotted: number;
  availablePhase2: number;
}

export interface College {
  collegeCode: string;
  collegeName: string;
  location: string;
  district: string;
  collegeType: 'Government' | 'Private Autonomous' | 'University' | 'Affiliated';
  establishedYear: number;
  rating: number;
  branches: BranchInfo[];
  totalIntake: number;
  phase1Allotted: number;
  phase2Allotted: number;
  finalAllotted: number;
  naacGrade?: string;
  nirfRank?: number;
}

export interface SchemaFieldMapping {
  dbColumn: string;
  appField: string;
  required: boolean;
  fieldType: 'string' | 'number' | 'boolean';
}

export interface DataSourceConfig {
  id: string;
  name: string;
  sourceType: 'PHASE_1' | 'PHASE_2' | 'SEAT_AVAILABILITY' | 'CUTOFFS';
  tableUrl: string;
  tableName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING' | 'ERROR';
  lastSyncedAt: string;
  recordCount: number;
  fieldMappings: SchemaFieldMapping[];
  cutoffMode?: 'DERIVED' | 'OFFICIAL';
  validationStatus: 'VALID' | 'WARNING' | 'ERROR';
  validationMessage?: string;
  previewRows?: Record<string, any>[];
}

export interface SystemSettings {
  dataMode: 'MOCK' | 'LIVE';
  activePhase: PhaseType;
  allowPublicCandidateSearch: boolean;
  maskHallTicketDigits: boolean;
  enableDownloadSlip: boolean;
  announcementNotice?: string;
  lastUpdated: string;
}

export interface SearchFilter {
  query?: string;
  phase?: PhaseType;
  collegeCode?: string;
  branchCode?: string;
  category?: Category;
  gender?: Gender;
  status?: AllotmentStatus;
  rankMin?: number;
  rankMax?: number;
}
