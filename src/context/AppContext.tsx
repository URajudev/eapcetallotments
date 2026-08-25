import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Student, DerivedAllotment, PhaseType, SystemSettings } from '../types';
import { dataRepository } from '../services/dataRepository';

interface AppContextType {
  currentStudent: Student | null;
  currentDerivedAllotment: DerivedAllotment | null;
  activePhase: PhaseType;
  currentRoute: string;
  routeParams: Record<string, string>;
  adminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  logoClicks: number;
  settings: SystemSettings;
  appSettings: SystemSettings;
  updateAppSettings: (updated: Partial<SystemSettings>) => void;
  selectStudent: (student: Student) => void;
  clearStudent: () => void;
  setActivePhase: (phase: PhaseType) => void;
  navigateTo: (route: string, params?: Record<string, string>) => void;
  handleLogoClick: () => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  refreshSettings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PRIMARY_ADMIN_PASSCODE = 'Prasanth#1121';
const FALLBACK_ADMIN_PASSCODE = 'eapcet2026admin';
const SESSION_STUDENT_KEY = 'eapcet_2026_selected_student_id';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentDerivedAllotment, setCurrentDerivedAllotment] = useState<DerivedAllotment | null>(null);
  const [activePhase, setActivePhaseState] = useState<PhaseType>('FINAL');
  const [currentRoute, setCurrentRoute] = useState<string>('/welcome');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [settings, setSettings] = useState<SystemSettings>(dataRepository.getSettings());

  // Restore session student on initial load if available
  useEffect(() => {
    try {
      const savedStudentId = sessionStorage.getItem(SESSION_STUDENT_KEY);
      if (savedStudentId) {
        const student = dataRepository.getStudentById(savedStudentId);
        if (student) {
          setCurrentStudent(student);
          const derived = dataRepository.getDerivedAllotmentForStudent(student);
          setCurrentDerivedAllotment(derived);
          setCurrentRoute('/home');
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const selectStudent = useCallback((student: Student) => {
    setCurrentStudent(student);
    const derived = dataRepository.getDerivedAllotmentForStudent(student);
    setCurrentDerivedAllotment(derived);
    try {
      sessionStorage.setItem(SESSION_STUDENT_KEY, student.id);
    } catch {
      // Storage fallback
    }
    setCurrentRoute('/home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearStudent = useCallback(() => {
    setCurrentStudent(null);
    setCurrentDerivedAllotment(null);
    try {
      sessionStorage.removeItem(SESSION_STUDENT_KEY);
    } catch {
      // Storage fallback
    }
    setCurrentRoute('/welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setActivePhase = useCallback((phase: PhaseType) => {
    setActivePhaseState(phase);
  }, []);

  const navigateTo = useCallback((route: string, params: Record<string, string> = {}) => {
    // If student is not selected and trying to access app pages (except admin or welcome), route to welcome
    if (!currentStudent && !route.startsWith('/admin') && route !== '/welcome') {
      setCurrentRoute('/welcome');
      setRouteParams({});
      return;
    }
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStudent]);

  // 7 Rapid Clicks on Logo triggers Admin Login Dialog
  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    // If clicks happened within 3000ms, increment count
    if (now - lastClickTime < 3000 || logoClicks === 0) {
      const newCount = logoClicks + 1;
      setLogoClicks(newCount);
      setLastClickTime(now);

      if (newCount >= 7) {
        setLogoClicks(0);
        setIsAdminModalOpen(true);
      }
    } else {
      setLogoClicks(1);
      setLastClickTime(now);
    }
  }, [lastClickTime, logoClicks]);

  const openAdminModal = useCallback(() => {
    setIsAdminModalOpen(true);
  }, []);

  const closeAdminModal = useCallback(() => {
    setIsAdminModalOpen(false);
  }, []);

  const loginAdmin = useCallback((password: string): boolean => {
    const trimmed = password.trim();
    if (trimmed === PRIMARY_ADMIN_PASSCODE || trimmed === FALLBACK_ADMIN_PASSCODE) {
      setAdminLoggedIn(true);
      setIsAdminModalOpen(false);
      setCurrentRoute('/admin');
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminLoggedIn(false);
    setCurrentRoute(currentStudent ? '/home' : '/welcome');
  }, [currentStudent]);

  const refreshSettings = useCallback(() => {
    setSettings(dataRepository.getSettings());
  }, []);

  const updateAppSettings = useCallback((updated: Partial<SystemSettings>) => {
    const newSettings = dataRepository.updateSettings(updated);
    setSettings(newSettings);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentStudent,
        currentDerivedAllotment,
        activePhase,
        currentRoute,
        routeParams,
        adminLoggedIn,
        isAdminModalOpen,
        logoClicks,
        settings,
        appSettings: settings,
        updateAppSettings,
        selectStudent,
        clearStudent,
        setActivePhase,
        navigateTo,
        handleLogoClick,
        openAdminModal,
        closeAdminModal,
        loginAdmin,
        logoutAdmin,
        refreshSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
