'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReportItem, UserSession } from '@/types/report';
import { INITIAL_MOCK_REPORTS } from '@/data/mockReports';

interface ReportContextType {
  reports: ReportItem[];
  currentUser: UserSession | null;
  login: (user: UserSession) => void;
  logout: () => void;
  addReport: (report: ReportItem) => void;
  updateReport: (id: string, updatedData: Partial<ReportItem>) => void;
  deleteReport: (id: string) => void;
  resetToDefault: () => void;
  getReportById: (id: string) => ReportItem | undefined;
}

const STORAGE_KEY_REPORTS = 'burger_reports_demo_v1';
const STORAGE_KEY_USER = 'burger_user_session_v1';

const DEFAULT_USER: UserSession = {
  nombre: 'Raúl Solorza',
  rol: 'Operador',
  cargo: 'Operador de Grúa LTM 1250',
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        setReports(INITIAL_MOCK_REPORTS);
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(INITIAL_MOCK_REPORTS));
      }

      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(DEFAULT_USER);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_USER));
      }
    } catch (e) {
      console.error('Error cargando localStorage', e);
      setReports(INITIAL_MOCK_REPORTS);
      setCurrentUser(DEFAULT_USER);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveReports = (newReports: ReportItem[]) => {
    setReports(newReports);
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(newReports));
    } catch (e) {
      console.error('Error guardando en localStorage', e);
    }
  };

  const login = (user: UserSession) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error(e);
    }
  };

  const addReport = (report: ReportItem) => {
    const updated = [report, ...reports];
    saveReports(updated);
  };

  const updateReport = (id: string, updatedData: Partial<ReportItem>) => {
    const updated = reports.map((r) => (r.id === id ? { ...r, ...updatedData } : r));
    saveReports(updated);
  };

  const deleteReport = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    saveReports(updated);
  };

  const resetToDefault = () => {
    saveReports(INITIAL_MOCK_REPORTS);
  };

  const getReportById = (id: string) => {
    return reports.find((r) => r.id === id);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm tracking-wider uppercase">Cargando Sistema BURGER Grúas...</p>
        </div>
      </div>
    );
  }

  return (
    <ReportContext.Provider
      value={{
        reports,
        currentUser,
        login,
        logout,
        addReport,
        updateReport,
        deleteReport,
        resetToDefault,
        getReportById,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports debe usarse dentro de un ReportProvider');
  }
  return context;
};
