'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Truck, PlusCircle, LayoutDashboard, Code, LogOut, UserCheck, FileText, ChevronDown, Menu, X, Users, Wrench } from 'lucide-react';
import { useReports } from '@/context/ReportContext';
import { JsonModal } from './JsonModal';
import { UserSession } from '@/types/report';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, login, logout } = useReports();
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick switch users for client demonstration
  const DEMO_USERS: UserSession[] = [
    { nombre: 'Raúl Solorza', rol: 'Operador', cargo: 'Operador de Grúa LTM 1250' },
    { nombre: 'Carlos Gutiérrez', rol: 'Supervisor', cargo: 'Supervisor Faena SPENCE' },
    { nombre: 'Administración Burger', rol: 'Administrador', cargo: 'Jefe de Operaciones' },
  ];

  if (pathname === '/') return null; // Don't render navbar on login page

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Company Name */}
          <Link href="/dashboard" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-black shadow-md group-hover:bg-amber-400 transition-all">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-wide text-white block uppercase leading-none">
                BURGER
              </span>
              <span className="text-[9px] text-amber-400 font-semibold tracking-wider block uppercase mt-0.5 whitespace-nowrap">
                Grúas & Transportes
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Single Line, No Wrap) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                pathname === '/dashboard'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" /> Dashboard
            </Link>

            <Link
              href="/reports/new"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                pathname === '/reports/new'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-500" /> Nuevo Reporte
            </Link>

            <Link
              href="/maintenance"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                pathname === '/maintenance'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-500" /> Mantenciones
            </Link>

            <Link
              href="/operators"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                pathname === '/operators'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" /> Operadores
            </Link>

            <Link
              href="/reports/002532"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                pathname === '/reports/002532'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Ficha #002532
            </Link>
          </nav>

          {/* Right Tools & User Profile */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* JSON Code Button */}
            <button
              onClick={() => setIsJsonOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              title="Inspeccionar datos en JSON"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Ver JSON</span>
            </button>

            {/* User Dropdown / Switch */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/80 text-xs text-slate-200 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {currentUser?.nombre ? currentUser.nombre.charAt(0) : 'U'}
                </div>
                <div className="text-left hidden lg:block leading-tight">
                  <p className="font-semibold text-xs whitespace-nowrap">{currentUser?.nombre || 'Usuario'}</p>
                  <p className="text-[9px] text-amber-400 font-medium whitespace-nowrap">{currentUser?.rol || 'Demo'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs text-slate-400">Rol Activo para Demo:</p>
                    <p className="text-xs font-bold text-white">{currentUser?.cargo}</p>
                  </div>

                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cambiar usuario de prueba:
                  </div>

                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.nombre}
                      onClick={() => {
                        login(user);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currentUser?.nombre === user.nombre ? 'text-amber-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <p>{user.nombre}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{user.rol}</p>
                      </div>
                      {currentUser?.nombre === user.nombre && <UserCheck className="w-4 h-4 text-amber-400" />}
                    </button>
                  ))}

                  <div className="border-t border-slate-800 mt-2 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 bg-slate-900 text-slate-300 hover:text-white rounded-lg border border-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Nav Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/dashboard' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" /> Dashboard Operativo
            </Link>

            <Link
              href="/reports/new"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/reports/new' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" /> Nuevo Reporte Diario
            </Link>

            <Link
              href="/maintenance"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/maintenance' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4 text-amber-400" /> Mantenciones & Bitácora
            </Link>

            <Link
              href="/operators"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/operators' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" /> Operadores & Licencias
            </Link>

            <Link
              href="/reports/002532"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/reports/002532' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" /> Ver Ficha Muestra #002532
            </Link>
          </div>
        )}
      </header>

      {/* Sticky Bottom Navigation Bar for Mobile Phones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-2 px-4 flex items-center justify-around text-[10px] font-semibold text-slate-400 print:hidden">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/dashboard' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/reports/new"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/reports/new' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <PlusCircle className="w-5 h-5 text-amber-400" />
          <span>Nuevo Vale</span>
        </Link>

        <Link
          href="/maintenance"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/maintenance' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Wrench className="w-5 h-5 text-amber-400" />
          <span>Taller</span>
        </Link>

        <Link
          href="/operators"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/operators' ? 'text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 text-emerald-400" />
          <span>Operadores</span>
        </Link>

        <button
          onClick={() => setIsJsonOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-slate-200"
        >
          <Code className="w-5 h-5 text-amber-400" />
          <span>JSON</span>
        </button>
      </div>

      {/* JSON Viewer Modal */}
      <JsonModal isOpen={isJsonOpen} onClose={() => setIsJsonOpen(false)} />
    </>
  );
};
