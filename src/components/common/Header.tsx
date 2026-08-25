import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Search, 
  Building2, 
  FileSpreadsheet, 
  TrendingUp, 
  User, 
  LogOut, 
  ShieldCheck, 
  Layers, 
  Lock
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentStudent, 
    currentRoute, 
    navigateTo, 
    clearStudent, 
    handleLogoClick,
    logoClicks,
    adminLoggedIn,
    logoutAdmin
  } = useApp();

  const navItems = [
    { label: 'Home', route: '/home', icon: Layers },
    { label: 'Search', route: '/search', icon: Search },
    { label: 'Colleges', route: '/colleges', icon: Building2 },
    { label: 'Seat Matrix', route: '/seat-availability', icon: FileSpreadsheet },
    { label: 'Cutoffs', route: '/cutoffs', icon: TrendingUp },
    { label: 'Profile', route: '/profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          
          {/* Left: EAPCET 2026 Identity/Logo & Admin Trigger (7 Clicks) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div 
              id="header-logo-trigger"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
              title="State Council of Higher Education • Click 7 times rapidly for Admin"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <GraduationCap size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 font-['Outfit']">
                    EAPCET 2026
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                    RECORDS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  Admissions & Allotment Platform
                </p>
              </div>
            </div>

            {/* Hidden admin unlock countdown indicator */}
            {logoClicks > 0 && logoClicks < 7 && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                <Lock size={12} />
                Admin Gate: {7 - logoClicks}
              </span>
            )}
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route || (item.route !== '/home' && currentRoute.startsWith(item.route));

              return (
                <button
                  key={item.route}
                  id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => navigateTo(item.route)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Candidate Profile Avatar / Account Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentStudent ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="user-profile-header-btn"
                  type="button"
                  onClick={() => navigateTo('/profile')}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/90 hover:border-indigo-300 transition-all text-left group shadow-2xs"
                  title="View Candidate Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                    {currentStudent.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <span className="block text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 truncate max-w-[120px]">
                      {currentStudent.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 leading-tight">
                      Rank #{currentStudent.rank.toLocaleString()}
                    </span>
                  </div>
                </button>

                <button
                  id="switch-student-btn"
                  type="button"
                  onClick={clearStudent}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                  title="Switch / Change Candidate"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : null}

            {/* Admin Active Tag */}
            {adminLoggedIn && (
              <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
                <button
                  id="admin-dashboard-btn"
                  type="button"
                  onClick={() => navigateTo('/admin')}
                  className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="p-1 text-slate-400 hover:text-slate-600"
                  title="Exit Admin"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
