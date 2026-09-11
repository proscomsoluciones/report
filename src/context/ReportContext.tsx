'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReportItem, UserSession, UserAccount } from '@/types/report';
import { INITIAL_MOCK_REPORTS } from '@/data/mockReports';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_op_1',
    rut: '16.842.109-5',
    nombre: 'Raúl Solorza',
    email: 'operador@burger.cl',
    password: '1234',
    rol: 'Operador',
    cargo: 'Operador de Grúa LTM 1250',
    faena: 'SPENCE',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr_sup_1',
    rut: '14.230.985-2',
    nombre: 'Carlos Gutiérrez',
    email: 'supervisor@burger.cl',
    password: '2345',
    rol: 'Supervisor',
    cargo: 'Supervisor Faena SPENCE',
    faena: 'SPENCE',
    createdAt: '2026-01-05',
  },
  {
    id: 'usr_adm_1',
    rut: '12.450.312-8',
    nombre: 'Administración Burger',
    email: 'admin@burger.cl',
    password: '9999',
    rol: 'Administrador',
    cargo: 'Jefe de Operaciones',
    faena: 'OFICINA CENTRAL',
    createdAt: '2026-01-01',
  },
  {
    id: 'usr_cli_1',
    rut: '77.892.400-K',
    nombre: 'Inspectora SPENCE (BHP)',
    email: 'cliente@spence.cl',
    password: '5555',
    rol: 'Cliente',
    cargo: 'Administradora de Contrato SPENCE',
    faena: 'MINERA SPENCE',
    createdAt: '2026-01-12',
  },
  {
    id: 'usr_mec_1',
    rut: '15.930.122-4',
    nombre: 'Pedro Aguilera',
    email: 'mecanico@burger.cl',
    password: '3456',
    rol: 'Mecánico',
    cargo: 'Jefe de Taller & Mantenciones',
    faena: 'TALLER CENTRAL',
    createdAt: '2026-01-08',
  },
];

interface ReportContextType {
  reports: ReportItem[];
  currentUser: UserSession | null;
  accounts: UserAccount[];
  login: (user: UserSession) => void;
  logout: () => void;
  loginWithCredentials: (identifier: string, password: string) => { success: boolean; message?: string };
  createAccount: (data: Omit<UserAccount, 'id' | 'createdAt'>) => { success: boolean; account?: UserAccount; message?: string };
  deleteAccount: (id: string) => void;
  addReport: (report: ReportItem) => void;
  updateReport: (id: string, updatedData: Partial<ReportItem>) => void;
  deleteReport: (id: string) => void;
  resetToDefault: () => void;
  getReportById: (id: string) => ReportItem | undefined;
}

const STORAGE_KEY_REPORTS = 'burger_reports_demo_v1';
const STORAGE_KEY_USER = 'burger_user_session_v1';
const STORAGE_KEY_ACCOUNTS = 'burger_user_accounts_v1';

const DEFAULT_USER: UserSession = {
  id: 'usr_op_1',
  nombre: 'Raúl Solorza',
  rol: 'Operador',
  cargo: 'Operador de Grúa LTM 1250',
  email: 'operador@burger.cl',
  rut: '16.842.109-5',
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
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

      const storedAccounts = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (storedAccounts) {
        const parsed: UserAccount[] = JSON.parse(storedAccounts);
        const missingDefaults = INITIAL_USER_ACCOUNTS.filter(
          (def) => !parsed.some((p) => p.id === def.id || p.email.toLowerCase() === def.email.toLowerCase())
        );
        const merged = [...parsed, ...missingDefaults];
        setAccounts(merged);
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(merged));
      } else {
        setAccounts(INITIAL_USER_ACCOUNTS);
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(INITIAL_USER_ACCOUNTS));
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
      setAccounts(INITIAL_USER_ACCOUNTS);
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

  const saveAccounts = (newAccounts: UserAccount[]) => {
    setAccounts(newAccounts);
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(newAccounts));
    } catch (e) {
      console.error('Error guardando cuentas en localStorage', e);
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

  const loginWithCredentials = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const account = accounts.find(
      (a) =>
        (a.email.toLowerCase() === cleanId || a.rut.toLowerCase() === cleanId) &&
        a.password === password
    );

    if (!account) {
      return {
        success: false,
        message: 'Credenciales inválidas. Por favor verifique el correo/RUT y contraseña o PIN.',
      };
    }

    const session: UserSession = {
      id: account.id,
      nombre: account.nombre,
      rol: account.rol,
      cargo: account.cargo,
      email: account.email,
      rut: account.rut,
    };

    login(session);
    return { success: true };
  };

  const createAccount = (data: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanRut = data.rut.trim().toLowerCase();

    const exists = accounts.some(
      (a) => a.email.toLowerCase() === cleanEmail || a.rut.toLowerCase() === cleanRut
    );

    if (exists) {
      return {
        success: false,
        message: 'Ya existe una cuenta registrada con ese Correo o RUT.',
      };
    }

    const newAcc: UserAccount = {
      ...data,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newAcc, ...accounts];
    saveAccounts(updated);

    return { success: true, account: newAcc };
  };

  const deleteAccount = (id: string) => {
    const updated = accounts.filter((a) => a.id !== id);
    saveAccounts(updated);
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
    saveAccounts(INITIAL_USER_ACCOUNTS);
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
        accounts,
        login,
        logout,
        loginWithCredentials,
        createAccount,
        deleteAccount,
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

