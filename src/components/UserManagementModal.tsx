'use client';

import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, HardHat, UserCheck, Building2, Wrench, Key, Mail, CheckCircle2, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { useReports } from '@/context/ReportContext';
import { UserAccount } from '@/types/report';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccountToLogin?: (account: UserAccount) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  onSelectAccountToLogin,
}) => {
  const { accounts, createAccount, deleteAccount, login } = useReports();
  const [activeTab, setActiveTab] = useState<'lista' | 'nuevo'>('lista');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'Todos' | 'Operador' | 'Mecánico' | 'Supervisor' | 'Administrador' | 'Cliente'>('Todos');

  // Form State
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'Operador' | 'Mecánico' | 'Supervisor' | 'Administrador' | 'Cliente'>('Operador');
  const [cargo, setCargo] = useState('Operador de Grúa LTM 1250');
  const [faena, setFaena] = useState('SPENCE');

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRoleChangeInForm = (newRole: 'Operador' | 'Mecánico' | 'Supervisor' | 'Administrador' | 'Cliente') => {
    setRol(newRole);
    if (newRole === 'Operador') {
      setCargo('Operador de Grúa LTM 1250');
      setFaena('SPENCE');
    } else if (newRole === 'Mecánico') {
      setCargo('Técnico Mecánico & Mantenciones');
      setFaena('TALLER CENTRAL');
    } else if (newRole === 'Supervisor') {
      setCargo('Supervisor de Terreno & Maniobras');
      setFaena('SPENCE');
    } else if (newRole === 'Administrador') {
      setCargo('Jefe de Operaciones & Logística');
      setFaena('OFICINA CENTRAL');
    } else if (newRole === 'Cliente') {
      setCargo('Administradora de Contrato SPENCE (BHP)');
      setFaena('MINERA SPENCE');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Por favor complete todos los campos obligatorios.' });
      return;
    }

    const generatedRut = rut.trim() || `${Math.floor(10000000 + Math.random() * 9000000)}-${Math.floor(Math.random() * 9)}`;

    const res = createAccount({
      nombre: nombre.trim(),
      email: email.trim(),
      rut: generatedRut,
      password: password.trim(),
      rol,
      cargo,
      faena,
    });

    if (res.success && res.account) {
      setFeedbackMsg({
        type: 'success',
        text: `¡Acceso creado con éxito para ${res.account.nombre} (${res.account.rol})!`,
      });
      // Reset Form
      setNombre('');
      setEmail('');
      setRut('');
      setPassword('');
      setActiveTab('lista');
    } else {
      setFeedbackMsg({ type: 'error', text: res.message || 'Error al crear el usuario.' });
    }
  };

  const filteredAccounts = selectedRoleFilter === 'Todos'
    ? accounts
    : accounts.filter((a) => a.rol === selectedRoleFilter);

  const getRoleIcon = (roleStr: string) => {
    switch (roleStr) {
      case 'Operador':
        return <HardHat className="w-4 h-4 text-amber-400" />;
      case 'Mecánico':
        return <Wrench className="w-4 h-4 text-cyan-400" />;
      case 'Supervisor':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'Administrador':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'Cliente':
        return <Building2 className="w-4 h-4 text-purple-400" />;
      default:
        return <HardHat className="w-4 h-4 text-amber-400" />;
    }
  };

  const getRoleBadgeStyle = (roleStr: string) => {
    switch (roleStr) {
      case 'Operador':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Mecánico':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Supervisor':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Administrador':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Cliente':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Gestión de Accesos & Cuentas por Rol
              </h2>
              <p className="text-xs text-slate-400">
                Creación de usuarios con login individual para Operadores, Supervisores, Admin y Clientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('lista')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'lista'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Usuarios Registrados ({accounts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('nuevo')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'nuevo'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Crear Nuevo Acceso</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {feedbackMsg && (
          <div
            className={`mx-5 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 font-medium border ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'lista' ? (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 font-semibold shrink-0">Filtrar por Rol:</span>
                {(['Todos', 'Operador', 'Mecánico', 'Supervisor', 'Administrador', 'Cliente'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all shrink-0 ${
                      selectedRoleFilter === role
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Accounts List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(acc.rol)}
                          <div>
                            <p className="text-sm font-bold text-white">{acc.nombre}</p>
                            <p className="text-[11px] text-slate-400">{acc.cargo}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(acc.rol)}`}>
                          {acc.rol}
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded-lg p-2.5 space-y-1 text-xs border border-slate-800/60 font-mono">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500 flex items-center gap-1 font-sans">
                            <Mail className="w-3 h-3" /> Email:
                          </span>
                          <span className="text-amber-400">{acc.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500 flex items-center gap-1 font-sans">
                            <Key className="w-3 h-3" /> PIN / Pass:
                          </span>
                          <span className="text-emerald-400 font-bold">{acc.password}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                          <span>Faena: {acc.faena}</span>
                          <span>RUT: {acc.rut}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (onSelectAccountToLogin) {
                            onSelectAccountToLogin(acc);
                          } else {
                            login({
                              id: acc.id,
                              nombre: acc.nombre,
                              rol: acc.rol,
                              cargo: acc.cargo,
                              email: acc.email,
                              rut: acc.rut,
                            });
                          }
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <span>Ingresar con esta cuenta</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {!acc.id.startsWith('usr_op_1') && !acc.id.startsWith('usr_sup_1') && !acc.id.startsWith('usr_adm_1') && !acc.id.startsWith('usr_cli_1') && !acc.id.startsWith('usr_mec_1') && (
                        <button
                          onClick={() => deleteAccount(acc.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Eliminar usuario personalizado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Form to Create New Access */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-300">
                <p className="font-bold flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  Registro de Nuevo Acceso por Rol
                </p>
                <p className="text-[11px] text-amber-400/80 mt-0.5">
                  Seleccione el rol de usuario para otorgar los permisos de plataforma correspondientes.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  1. Seleccionar Rol de Acceso:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Operador', 'Mecánico', 'Supervisor', 'Administrador', 'Cliente'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChangeInForm(r)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center space-y-1 ${
                        rol === r
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg font-black'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {getRoleIcon(r)}
                      <span className="text-xs">{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Completo del Usuario:
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Marcelo Morales"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico (Login):
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcelo.morales@burger.cl"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contraseña / PIN de Acceso:
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ej: 4321 o clave123"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    RUT (Opcional):
                  </label>
                  <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="18.520.140-3"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cargo o Función:
                  </label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Ej: Operador Grúa Liebherr LTM 1250"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Faena Asignada:
                  </label>
                  <select
                    value={faena}
                    onChange={(e) => setFaena(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="SPENCE">SPENCE (BHP)</option>
                    <option value="ESCONDIDA">MEL - MINERA ESCONDIDA</option>
                    <option value="COLLAHUASI">CMDIC - COLLAHUASI</option>
                    <option value="TALLER CENTRAL">TALLER CENTRAL ANTOFAGASTA</option>
                    <option value="OFICINA CENTRAL">OFICINA CENTRAL SANTIAGO</option>
                  </select>
                </div>
              </div>

              {/* Role Permissions Summary Box */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Permisos que tendrá este usuario ({rol}):
                </p>
                {rol === 'Operador' && (
                  <p className="text-amber-300">
                    • <strong>Solo podrá registrar reportes diarios</strong> y ver los reportes que ha creado.
                  </p>
                )}
                {rol === 'Mecánico' && (
                  <p className="text-cyan-300">
                    • Acceso al módulo de <strong>Mantenciones & Taller</strong>, pautas preventivas/correctivas y registro de horómetros.
                  </p>
                )}
                {rol === 'Supervisor' && (
                  <p className="text-emerald-300">
                    • Podrá revisar reportes, estamparle firma de V°B° en terreno y auditar certificaciones de operadores.
                  </p>
                )}
                {rol === 'Administrador' && (
                  <p className="text-blue-300">
                    • <strong>Control total del sistema:</strong> ve todos los módulos, métricas, mantenciones, operadores, JSON y accesos.
                  </p>
                )}
                {rol === 'Cliente' && (
                  <p className="text-purple-300">
                    • Consultar vouchers de trabajo finalizados y descargar certificados PDF de faena.
                  </p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('lista')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Acceso y Guardar</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
