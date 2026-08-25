import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Search, Building2, TrendingUp, User, BarChart3, FileSpreadsheet } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();

  const tabs = [
    { label: 'Home', route: '/home', icon: Layers },
    { label: 'Search', route: '/search', icon: Search },
    { label: 'Colleges', route: '/colleges', icon: Building2 },
    { label: 'Cutoffs', route: '/cutoffs', icon: TrendingUp },
    { label: 'Profile', route: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      <nav 
        id="mobile-floating-bottom-nav"
        className="pointer-events-auto bg-white/95 backdrop-blur-lg border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(20,30,60,0.15)] rounded-full px-3 py-2 flex items-center justify-around gap-1 max-w-md w-full"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.route || (tab.route !== '/home' && currentRoute.startsWith(tab.route));

          return (
            <button
              key={tab.route}
              id={`mobile-tab-${tab.label.toLowerCase()}`}
              type="button"
              onClick={() => navigateTo(tab.route)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 relative min-w-[58px] ${
                isActive
                  ? 'text-indigo-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={19} className={isActive ? 'text-indigo-600 stroke-[2.4]' : 'text-slate-400'} />
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-indigo-700' : 'font-medium'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute -bottom-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
