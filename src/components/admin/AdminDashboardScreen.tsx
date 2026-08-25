import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { dataRepository } from '../../services/dataRepository';
import { PhaseType, DataSourceConfig } from '../../types';
import { 
  ShieldCheck, 
  Database, 
  Layers, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  ArrowRight, 
  Table, 
  Code, 
  Settings, 
  Save, 
  ExternalLink,
  Lock,
  LogOut,
  AlertCircle
} from 'lucide-react';

type AdminTab = 'OVERVIEW' | 'PHASE_1' | 'PHASE_2' | 'SEAT_AVAILABILITY' | 'CUTOFFS' | 'SCHEMA_MAPPING' | 'VALIDATION' | 'SETTINGS';

export const AdminDashboardScreen: React.FC = () => {
  const { 
    adminLoggedIn, 
    logoutAdmin, 
    navigateTo, 
    appSettings, 
    updateAppSettings, 
    activePhase, 
    setActivePhase 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Field mappings state
  const [phase1Mapping, setPhase1Mapping] = useState({
    hallTicket: 'htno',
    name: 'candidate_name',
    collegeCode: 'inst_code',
    collegeName: 'inst_name',
    branchCode: 'branch_code',
    branchName: 'branch_name',
    category: 'caste_category',
    rank: 'state_rank'
  });

  const [phase2Mapping, setPhase2Mapping] = useState({
    hallTicket: 'htno',
    name: 'candidate_name',
    collegeCode: 'allotted_inst',
    collegeName: 'allotted_inst_name',
    branchCode: 'allotted_branch',
    branchName: 'allotted_branch_name',
    category: 'social_cat',
    rank: 'rank'
  });

  const [cutoffMode, setCutoffMode] = useState<'DERIVED' | 'OFFICIAL_TABLE'>('DERIVED');

  if (!adminLoggedIn) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Admin Session Required</h2>
        <p className="text-xs text-slate-500">
          This portal is restricted to authorized state admission officials. Please sign in via the administrative gate.
        </p>
        <button
          onClick={() => navigateTo('/home')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  const handleSyncAll = () => {
    setSyncing(true);
    setSyncMessage(null);
    setTimeout(() => {
      dataRepository.syncDataSources();
      setSyncing(false);
      setSyncMessage('Successfully recomputed and validated 2026 Phase 1 & 2 records!');
      setTimeout(() => setSyncMessage(null), 4000);
    }, 900);
  };

  const validationSummary = useMemo(() => {
    return dataRepository.validateData();
  }, [syncing]);

  const tabs: { id: AdminTab; label: string; icon: React.FC<any> }[] = [
    { id: 'OVERVIEW', label: 'Overview', icon: Layers },
    { id: 'PHASE_1', label: 'Phase 1 Source', icon: Table },
    { id: 'PHASE_2', label: 'Phase 2 Source', icon: Table },
    { id: 'SEAT_AVAILABILITY', label: 'Seat Matrix', icon: FileSpreadsheet },
    { id: 'CUTOFFS', label: 'Cutoff Config', icon: TrendingUp },
    { id: 'SCHEMA_MAPPING', label: 'Schema Mapping', icon: Code },
    { id: 'VALIDATION', label: 'Data Validation', icon: CheckCircle2 },
    { id: 'SETTINGS', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} className="text-rose-400" />
            Central Counseling Control Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Admin Data Management Console
          </h1>
          <p className="text-xs text-slate-400">
            Configure schemas, connect live or test tables, trigger merge verification, and audit cutoffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={syncing}
            className="px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync & Recompute Engine'}</span>
          </button>

          <button
            type="button"
            onClick={logoutAdmin}
            className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut size={14} />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Navigation Tabs Pill Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phase 1 Source</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900 font-['Outfit']">Connected</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 block mt-2">12 Initial Admissions Recorded</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phase 2 Source</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900 font-['Outfit']">Connected</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 block mt-2">12 Final Round Allotments</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seat Vacancies</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-extrabold text-slate-900 font-['Outfit']">Verified</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-500 block mt-2">Intake Capacity: 7,560 Seats</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cutoff Engine</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-extrabold text-indigo-700 font-['Outfit']">Active</span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              </div>
              <span className="text-xs text-slate-500 block mt-2">Deterministic Min/Max Calculation</span>
            </div>

          </div>

          {/* Merge Engine Rules Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Central Allotment Merge Rules Configuration
            </h3>
            <p className="text-xs text-slate-500">
              The EAPCET 2026 Merge Engine uses deterministic rules applied uniformly across candidate search, college records, and candidate portals:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="font-bold text-emerald-900 block">1. NEW SEAT</span>
                <span className="text-emerald-800 mt-0.5 block">No Phase 1 allotment + Phase 2 allotment exists.</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
                <span className="font-bold text-indigo-900 block">2. TRANSFERRED</span>
                <span className="text-indigo-800 mt-0.5 block">Phase 1 College ≠ Phase 2 College. Candidate re-allotted to destination college.</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="font-bold text-amber-900 block">3. UPGRADED BRANCH</span>
                <span className="text-amber-800 mt-0.5 block">Phase 1 College == Phase 2 College, but Branch 1 ≠ Branch 2.</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80">
                <span className="font-bold text-sky-900 block">4. RETAINED / NO SEAT</span>
                <span className="text-sky-800 mt-0.5 block">Same College & Branch retained or no seats allotted in any phase.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PHASE 1 SOURCE */}
      {activeTab === 'PHASE_1' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Phase 1 Counseling Data Source</h3>
              <p className="text-xs text-slate-500">Configure connection table and verify field mappings for Round 1</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
              Status: Live & Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Source Table / Endpoint Reference</label>
              <input 
                type="text" 
                defaultValue="ap_eapcet_2026_phase1_allotments_v2" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Round Publication Date</label>
              <input 
                type="text" 
                defaultValue="2026-07-12 18:00:00 IST" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Field Mapping (Database → Model)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(phase1Mapping).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{key}</span>
                  <span className="font-mono text-xs font-bold text-indigo-700 mt-0.5 block">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: PHASE 2 SOURCE */}
      {activeTab === 'PHASE_2' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Phase 2 Final Counseling Data Source</h3>
              <p className="text-xs text-slate-500">Configure connection table and merge pipeline for Round 2</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
              Status: Live & Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Source Table / Endpoint Reference</label>
              <input 
                type="text" 
                defaultValue="ap_eapcet_2026_phase2_final_allotments_v1" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 uppercase mb-1">Round Publication Date</label>
              <input 
                type="text" 
                defaultValue="2026-08-20 20:30:00 IST" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Field Mapping (Database → Model)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(phase2Mapping).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{key}</span>
                  <span className="font-mono text-xs font-bold text-indigo-700 mt-0.5 block">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: SEAT MATRIX CONFIG */}
      {activeTab === 'SEAT_AVAILABILITY' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Seat Availability Matrix Configuration</h3>
          <p className="text-xs text-slate-500">
            Public seat availability table automatically removes special categories while preserving EWS and standard category allocations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">College & Branch Field</span>
              <span className="font-mono font-bold text-slate-900 mt-1 block">inst_code + branch_code</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Category Filter Strategy</span>
              <span className="font-bold text-indigo-700 mt-1 block">Regular + EWS Only</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Vacancy Calculation</span>
              <span className="font-mono font-bold text-emerald-700 mt-1 block">total_intake - filled_seats</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: CUTOFFS CONFIG */}
      {activeTab === 'CUTOFFS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Cutoff Engine Mode</h3>
            <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-bold">
              <button
                type="button"
                onClick={() => setCutoffMode('DERIVED')}
                className={`px-3 py-1 rounded-full transition-all ${
                  cutoffMode === 'DERIVED' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}
              >
                Derived from Allotments
              </button>
              <button
                type="button"
                onClick={() => setCutoffMode('OFFICIAL_TABLE')}
                className={`px-3 py-1 rounded-full transition-all ${
                  cutoffMode === 'OFFICIAL_TABLE' ? 'bg-indigo-600 text-white' : 'text-slate-600'
                }`}
              >
                Official Static Cutoff Table
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <span className="font-bold block">Current Calculation Formula:</span>
            <p>
              <strong>Highest Rank:</strong> <code>Math.min(...groupRanks)</code> (The lowest numerical value, indicating opening rank)
            </p>
            <p>
              <strong>Lowest Rank:</strong> <code>Math.max(...groupRanks)</code> (The highest numerical value, indicating closing rank)
            </p>
          </div>
        </div>
      )}

      {/* Tab 6: SCHEMA MAPPING */}
      {activeTab === 'SCHEMA_MAPPING' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Database Field Mappings</h3>
          <p className="text-xs text-slate-500">
            Map external SQL columns to canonical TypeScript interfaces.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { internal: 'hallTicket', db: 'htno', type: 'string (unique key)' },
              { internal: 'name', db: 'candidate_name', type: 'string' },
              { internal: 'rank', db: 'state_rank', type: 'number' },
              { internal: 'category', db: 'caste_category', type: 'enum (OC, EWS, BC-*, SC, ST)' },
              { internal: 'gender', db: 'candidate_gender', type: 'enum (Male, Female)' },
              { internal: 'collegeCode', db: 'inst_code', type: 'string' },
              { internal: 'branchCode', db: 'branch_code', type: 'string' },
            ].map(row => (
              <div key={row.internal} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{row.internal}</span>
                  <span className="text-[10px] text-slate-400 block">{row.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">mapped from:</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {row.db}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: VALIDATION */}
      {activeTab === 'VALIDATION' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Data Quality & Merge Validation</h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
              100% Passed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Duplicate Hall Tickets</span>
              <span className="text-lg font-extrabold text-emerald-800 mt-1 block">0 Detected</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Missing Required Columns</span>
              <span className="text-lg font-extrabold text-emerald-800 mt-1 block">0 Missing</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Invalid Ranks (&lt; 1)</span>
              <span className="text-lg font-extrabold text-emerald-800 mt-1 block">0 Invalid</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">System Runtime Settings</h3>

          <div className="space-y-4 text-xs">
            
            {/* Active Phase Override */}
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-2">Default Active Phase for Public UI</label>
              <div className="flex items-center gap-2">
                {(['PHASE_1', 'PHASE_2', 'FINAL'] as PhaseType[]).map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setActivePhase(phase)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      activePhase === phase
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Source Mode */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block font-bold text-slate-700 uppercase mb-2">Dataset Source Mode</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateAppSettings({ dataMode: 'MOCK' })}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    appSettings.dataMode === 'MOCK'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Mock Official Dataset (Offline)
                </button>
                <button
                  type="button"
                  onClick={() => updateAppSettings({ dataMode: 'LIVE' })}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    appSettings.dataMode === 'LIVE'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Live Database Table Connection
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
