import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { CandidateGate } from './components/welcome/CandidateGate';
import { HomeScreen } from './components/home/HomeScreen';
import { SearchScreen } from './components/search/SearchScreen';
import { StudentProfileScreen } from './components/student/StudentProfileScreen';
import { CollegeListScreen } from './components/colleges/CollegeListScreen';
import { CollegeDetailScreen } from './components/colleges/CollegeDetailScreen';
import { SeatAvailabilityScreen } from './components/seatAvailability/SeatAvailabilityScreen';
import { CutoffsScreen } from './components/cutoffs/CutoffsScreen';
import { AnalyticsScreen } from './components/analytics/AnalyticsScreen';
import { AdminDashboardScreen } from './components/admin/AdminDashboardScreen';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

const AppContent: React.FC = () => {
  const { currentRoute, currentStudent, routeParams } = useApp();

  // If on welcome route or no student selected (and not in admin mode)
  if (currentRoute === '/welcome' || (!currentStudent && !currentRoute.startsWith('/admin'))) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
        <CandidateGate />
        <AdminLoginModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        <Header />

        <main className="min-h-[calc(100vh-160px)]">
          {currentRoute === '/home' && <HomeScreen />}
          {currentRoute === '/search' && <SearchScreen />}
          {currentRoute === '/profile' && <StudentProfileScreen />}
          {currentRoute.startsWith('/student/') && (
            <StudentProfileScreen hallTicketParam={routeParams.hallTicket} />
          )}
          {currentRoute === '/colleges' && <CollegeListScreen />}
          {currentRoute.startsWith('/college/') && (
            <CollegeDetailScreen collegeCode={routeParams.collegeCode || 'ABCE'} />
          )}
          {currentRoute === '/seat-availability' && <SeatAvailabilityScreen />}
          {currentRoute === '/cutoffs' && <CutoffsScreen />}
          {currentRoute === '/analytics' && <AnalyticsScreen />}
          {currentRoute === '/admin' && <AdminDashboardScreen />}
        </main>
      </div>

      {/* Floating Bottom Nav on Mobile */}
      <BottomNav />

      {/* Admin Login Dialog Triggered via 7 Clicks on Logo */}
      <AdminLoginModal />

      {/* Institutional Legal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Andhra Pradesh State Council of Higher Education (APSCHE) - EAPCET Allotment System</p>
          <p className="font-mono text-[11px] text-slate-400">Phase 1 & 2 Central Merge Engine Active</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
