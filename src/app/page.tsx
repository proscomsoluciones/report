'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, UserCheck, ArrowRight, HardHat, FileCheck2, Code, Sparkles } from 'lucide-react';
import { useReports } from '@/context/ReportContext';
import { UserSession } from '@/types/report';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useReports();
  const [selectedRole, setSelectedRole] = useState<'Operador' | 'Supervisor' | 'Administrador'>('Operador');
  const [nombre, setNombre] = useState('Raúl Solorza');

  const handleQuickLogin = (role: 'Operador' | 'Supervisor' | 'Administrador', defaultName: string, defaultCargo: string) => {
    const userSession: UserSession = {
      nombre: defaultName,
      rol: role,
      cargo: defaultCargo,
    };
    login(userSession);
    router.push('/dashboard');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cargoMap = {
      Operador: 'Operador de Grúa LTM 1250',
      Supervisor: 'Supervisor de Terreno',
      Administrador: 'Jefe de Operaciones',
    };
    login({
      nombre,
      rol: selectedRole,
      cargo: cargoMap[selectedRole],
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-black shadow-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wide uppercase leading-none block">
              BURGER
            </span>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
              Grúas & Transportes Especiales
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> DEMO INTERACTIVA
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 w-full">
        {/* Left Column: Information & Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <FileCheck2 className="w-4 h-4" />
            <span>Digitalización del Reporte Diario de Trabajo (Ficha BG_COM_F003_002)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Gestión Inteligente de <span className="text-amber-500 underline decoration-amber-500/50">Grúas y Turnos</span> en Terreno
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Plataforma digital para el registro de horómetros, control de actividades de maniobras, firma de operarios/supervisores y generación automática de vouchers para clientes como SPENCE, ESCONDIDA y COLLAHUASI.
          </p>

          {/* Quick Access Demo Cards */}
          <div className="pt-4 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Acceso Rápido de Demostración (Seleccione un Perfil):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickLogin('Operador', 'Raúl Solorza', 'Operador Grúa LTM 1250')}
                className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform">
                  <HardHat className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white">Raúl Solorza</p>
                <p className="text-xs text-amber-400 font-medium">Operador de Grúa</p>
                <p className="text-[10px] text-slate-400 mt-1">Registra vales y horómetros</p>
              </button>

              <button
                onClick={() => handleQuickLogin('Supervisor', 'Carlos Gutiérrez', 'Supervisor Faena SPENCE')}
                className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white">Carlos Gutiérrez</p>
                <p className="text-xs text-emerald-400 font-medium">Supervisor Faena</p>
                <p className="text-[10px] text-slate-400 mt-1">Aprueba y firma reportes</p>
              </button>

              <button
                onClick={() => handleQuickLogin('Administrador', 'Jefe de Operaciones', 'Administración Burger')}
                className="p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition-all group"
              >
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white">Admin Operaciones</p>
                <p className="text-xs text-blue-400 font-medium">Control Total</p>
                <p className="text-[10px] text-slate-400 mt-1">Exporta JSON y métricas</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Box */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-white">Iniciar Sesión de Demostración</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingrese credenciales o seleccione el perfil operativo
              </p>
            </div>

            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nombre del Usuario / Operador:
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Ej: Raúl Solorza"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Rol en Plataforma:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Operador', 'Supervisor', 'Administrador'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        selectedRole === role
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <span>Ingresar al Sistema Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">
                Sistema configurado con datos de demostración pre-cargados (Ficha física N° 002532 SPENCE).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 max-w-7xl mx-auto w-full text-center text-xs text-slate-500 border-t border-slate-900">
        <p>BURGER GRUAS Y TRANSPORTES ESPECIALES Burger Limitada • Sistema Diseñado por SCOM.cl</p>
      </footer>
    </div>
  );
}
