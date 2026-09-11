'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, UserCheck, ArrowRight, HardHat, FileCheck2, Building2, Wrench, UserPlus, Lock, Key, Mail, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useReports } from '@/context/ReportContext';
import { UserManagementModal } from '@/components/UserManagementModal';
import { UserAccount } from '@/types/report';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, login, accounts } = useReports();
  const [selectedRoleTab, setSelectedRoleTab] = useState<'Operador' | 'Mecánico' | 'Supervisor' | 'Administrador' | 'Cliente'>('Operador');

  // Credentials State
  const [identifier, setIdentifier] = useState('operador@burger.cl');
  const [password, setPassword] = useState('1234');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleRoleTabChange = (role: 'Operador' | 'Mecánico' | 'Supervisor' | 'Administrador' | 'Cliente') => {
    setSelectedRoleTab(role);
    setErrorMessage('');

    // Pre-fill demo credentials matching tab
    const demoAcc = accounts.find((a) => a.rol === role);
    if (demoAcc) {
      setIdentifier(demoAcc.email);
      setPassword(demoAcc.password);
    } else {
      setIdentifier('');
      setPassword('');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Por favor ingrese su Correo/RUT y Contraseña o PIN.');
      return;
    }

    const res = loginWithCredentials(identifier, password);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMessage(res.message || 'Error de autenticación');
    }
  };

  const handleQuickLoginAccount = (account: UserAccount) => {
    setSelectedRoleTab(account.rol);
    setIdentifier(account.email || account.rut);
    setPassword(account.password);
    setErrorMessage('');

    // Smooth scroll to login box on mobile devices
    const loginBox = document.getElementById('login-box-container');
    if (loginBox) {
      loginBox.scrollIntoView({ behavior: 'smooth' });
    }
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Crear / Gestionar Accesos</span>
          </button>

          <span className="hidden sm:flex text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> ACCESO MULTI-ROL
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 w-full">
        {/* Left Column: Information & Role Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <FileCheck2 className="w-4 h-4" />
            <span>Sistema Digital de Reportes Diarios de Trabajo (Ficha BG_COM_F003_002)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Control Operativo de <span className="text-amber-500 underline decoration-amber-500/50">Grúas y Turnos</span> por Rol
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Acceso seguro segmentado para Operadores, Mecánicos, Supervisores de Faena, Administradores y Clientes Mineros.
          </p>

          {/* Preset Login Cards per Role */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ingreso Rápido por Perfil / Rol Activo:
              </p>
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Registrar Nuevo Acceso
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {accounts.slice(0, 5).map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleQuickLoginAccount(acc)}
                  className={`p-3 bg-slate-900/90 border rounded-xl text-left transition-all group hover:scale-[1.02] ${
                    acc.rol === 'Operador'
                      ? 'border-slate-800 hover:border-amber-500/60'
                      : acc.rol === 'Mecánico'
                      ? 'border-slate-800 hover:border-cyan-500/60'
                      : acc.rol === 'Supervisor'
                      ? 'border-slate-800 hover:border-emerald-500/60'
                      : acc.rol === 'Administrador'
                      ? 'border-slate-800 hover:border-blue-500/60'
                      : 'border-slate-800 hover:border-purple-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        acc.rol === 'Operador'
                          ? 'bg-amber-500/10 text-amber-400'
                          : acc.rol === 'Mecánico'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : acc.rol === 'Supervisor'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : acc.rol === 'Administrador'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-purple-500/10 text-purple-400'
                      }`}
                    >
                      {acc.rol === 'Operador' && <HardHat className="w-4 h-4" />}
                      {acc.rol === 'Mecánico' && <Wrench className="w-4 h-4" />}
                      {acc.rol === 'Supervisor' && <UserCheck className="w-4 h-4" />}
                      {acc.rol === 'Administrador' && <ShieldCheck className="w-4 h-4" />}
                      {acc.rol === 'Cliente' && <Building2 className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">PIN: {acc.password}</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{acc.nombre}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      acc.rol === 'Operador'
                        ? 'text-amber-400'
                        : acc.rol === 'Mecánico'
                        ? 'text-cyan-400'
                        : acc.rol === 'Supervisor'
                        ? 'text-emerald-400'
                        : acc.rol === 'Administrador'
                        ? 'text-blue-400'
                        : 'text-purple-400'
                    }`}
                  >
                    Rol: {acc.rol}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Role Credentials Login Box */}
        <div className="lg:col-span-5" id="login-box-container">
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md transition-all duration-300">
            <div className="mb-5">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                Acceso al Sistema por Rol
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ingrese credenciales o seleccione un perfil de acceso rápido
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-xl mb-5 border border-slate-800">
              {(['Operador', 'Mecánico', 'Supervisor', 'Administrador', 'Cliente'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleTabChange(r)}
                  className={`py-2 px-1 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
                    selectedRoleTab === r
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{r}</span>
                </button>
              ))}
            </div>

            {/* Role Scope Description Banner */}
            <div className="mb-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-xs">Alcance Perfil {selectedRoleTab}:</span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {selectedRoleTab.toLowerCase()}</span>
              </div>
              {selectedRoleTab === 'Operador' && (
                <p className="text-[11px] text-slate-300">
                  👷 <strong>Operador:</strong> Registra reportes diarios de trabajo en terreno y consulta el historial de sus reportes ingresados.
                </p>
              )}
              {selectedRoleTab === 'Mecánico' && (
                <p className="text-[11px] text-slate-300">
                  🔧 <strong>Mecánico:</strong> Registra mantenciones preventivas/correctivas, pautas de taller y seguimiento de horómetros.
                </p>
              )}
              {selectedRoleTab === 'Supervisor' && (
                <p className="text-[11px] text-slate-300">
                  👷‍♂️ <strong>Supervisor:</strong> Revisa, aprueba, firma vales en faena y audita la vigencia de licencias de operadores.
                </p>
              )}
              {selectedRoleTab === 'Administrador' && (
                <p className="text-[11px] text-slate-300">
                  🛡️ <strong>Administrador (Acceso Total):</strong> Ve todos los módulos, métricas, mantenciones, operadores, JSON y creación de accesos.
                </p>
              )}
              {selectedRoleTab === 'Cliente' && (
                <p className="text-[11px] text-slate-300">
                  🏢 <strong>Cliente / Minera:</strong> Consulta vouchers de trabajo finalizados y valida certificados de faena.
                </p>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Correo Electrónico o RUT:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="ejemplo@burger.cl o 16.842.109-5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contraseña o PIN de Rol:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="****"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
                >
                  <span>Ingresar como {selectedRoleTab}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center space-y-2">
              <p className="text-[11px] text-slate-400">
                ¿Necesita registrar una nueva cuenta de acceso para un rol?
              </p>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(true)}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Crear Acceso con Login por Rol</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSelectAccountToLogin={handleQuickLoginAccount}
      />

      {/* Footer */}
      <footer className="p-6 max-w-7xl mx-auto w-full text-center text-xs text-slate-500 border-t border-slate-900">
        <p>BURGER GRUAS Y TRANSPORTES ESPECIALES Burger Limitada • Sistema Diseñado por proscom.cl</p>
      </footer>
    </div>
  );
}

