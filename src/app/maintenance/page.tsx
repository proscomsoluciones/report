'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Truck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Code,
  ArrowLeft,
  Sparkles,
  DollarSign,
  X,
  Gauge,
  Check,
} from 'lucide-react';
import { MOCK_EQUIPMENT_STATES, MOCK_MAINTENANCE_LOGS } from '@/data/mockMaintenance';
import { EquipmentState, MaintenanceLogEntry, MaintenanceType } from '@/types/maintenance';
import { JsonModal } from '@/components/JsonModal';

export default function MaintenancePage() {
  const [equipmentList, setEquipmentList] = useState<EquipmentState[]>(MOCK_EQUIPMENT_STATES);
  const [logsList, setLogsList] = useState<MaintenanceLogEntry[]>(MOCK_MAINTENANCE_LOGS);

  const [selectedMachineFilter, setSelectedMachineFilter] = useState('Todas');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false);

  // New Maintenance Form State
  const [formEquipoId, setFormEquipoId] = useState('eq-140');
  const [formTipo, setFormTipo] = useState<MaintenanceType>('Preventiva');
  const [formCategoria, setFormCategoria] = useState<
    'Motor & Aceite' | 'Sistema Hidráulico' | 'Frenos & Transmisión' | 'Pluma & Telescópico' | 'Sistema Eléctrico'
  >('Motor & Aceite');
  const [formFecha, setFormFecha] = useState('2026-09-10');
  const [formHorometro, setFormHorometro] = useState('218194.5');
  const [formMecanico, setFormMecanico] = useState('PEDRO AGUILERA');
  const [formTaller, setFormTaller] = useState('Taller Móvil Faena Spence');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formRepuestos, setFormRepuestos] = useState('');
  const [formCosto, setFormCosto] = useState('450000');

  // Compute KPIs
  const totalEquipments = equipmentList.length;
  const inWorkshopCount = equipmentList.filter((e) => e.estado === 'En Taller').length;
  const upcomingServiceCount = equipmentList.filter((e) => e.estado === 'Próxima' || e.horasFaltantes <= 50).length;
  const totalMaintenanceCost = logsList.reduce((acc, curr) => acc + curr.costoEstimadoClp, 0);

  // Filter logs
  const filteredLogs = logsList.filter((log) => {
    const matchesMachine = selectedMachineFilter === 'Todas' || log.maquina === selectedMachineFilter;
    const matchesType = selectedTypeFilter === 'Todos' || log.tipo === selectedTypeFilter;
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.mecanicoResponsable.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMachine && matchesType && matchesSearch;
  });

  const handleRegisterLog = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEquip = equipmentList.find((e) => e.id === formEquipoId) || equipmentList[0];

    const newLog: MaintenanceLogEntry = {
      id: `MNT-2026-0${Math.floor(100 + Math.random() * 900)}`,
      equipoId: selectedEquip.id,
      numeroInterno: selectedEquip.numeroInterno,
      maquina: selectedEquip.maquina,
      tipo: formTipo,
      categoria: formCategoria,
      fecha: formFecha,
      horometroServicio: parseFloat(formHorometro),
      mecanicoResponsable: formMecanico,
      taller: formTaller,
      descripcion: formDescripcion,
      repuestosUtilizados: formRepuestos ? formRepuestos.split(',').map((s) => s.trim()) : ['Insumos varios'],
      costoEstimadoClp: parseInt(formCosto) || 0,
      estado: formTipo === 'Correctiva' ? 'En Taller' : 'Completada',
    };

    setLogsList([newLog, ...logsList]);

    // Update equipment status if needed
    if (formTipo === 'Correctiva') {
      setEquipmentList(
        equipmentList.map((eq) => (eq.id === selectedEquip.id ? { ...eq, estado: 'En Taller' as const } : eq))
      );
    } else {
      // Reset horometro target for preventive service +250h
      setEquipmentList(
        equipmentList.map((eq) =>
          eq.id === selectedEquip.id
            ? {
                ...eq,
                horometroActual: parseFloat(formHorometro),
                horometroProximaMantencion: parseFloat(formHorometro) + 250,
                horasFaltantes: 250,
                estado: 'Al Día' as const,
                ultimaMantencionFecha: formFecha,
              }
            : eq
        )
      );
    }

    setIsNewLogModalOpen(false);
    setFormDescripcion('');
    setFormRepuestos('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsJsonOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Code className="w-4 h-4" /> Exportar JSON Bitácora
            </button>

            <button
              onClick={() => setIsNewLogModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Registrar Mantención
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Módulo de Control Técnico & Bitácora de Horómetros</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Mantenciones Preventivas, Correctivas y Horómetros
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Control del ciclo de vida de la flota de grúas <span className="text-amber-400 font-semibold">Burger Limitada</span>. Monitoree horómetros de servicio (250h / 500h / 1000h), repuestos utilizados y órdenes de taller en terreno.
          </p>
        </div>

        {/* Metric Cards (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Equipment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Flota de Grúas</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalEquipments}</p>
              <p className="text-[11px] text-slate-400 mt-1">Equipos en monitoreo</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Upcoming Services */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Próximos Servicios (&lt;50h)</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{upcomingServiceCount}</p>
              <p className="text-[11px] text-amber-400/80 mt-1">Requieren pauta de mantención</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* In Workshop */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Equipos en Taller</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{inWorkshopCount}</p>
              <p className="text-[11px] text-rose-400/80 mt-1">En reparación / correctiva</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

          {/* Maintenance Cost */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Inversión Bitácora</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                ${(totalMaintenanceCost / 1000000).toFixed(2)}M <span className="text-xs">CLP</span>
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Costo total acumulado</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Section 1: Fleet Horómetro Progress Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-500" />
            Estado de Horómetros y Próximas Pautas Preventivas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipmentList.map((eq) => {
              const current = eq.horometroActual;
              const target = eq.horometroProximaMantencion;
              const percent = Math.min(100, Math.max(0, (1 - eq.horasFaltantes / 250) * 100));

              return (
                <div
                  key={eq.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-3 transition-all ${
                    eq.estado === 'En Taller'
                      ? 'border-rose-700/80 bg-rose-950/20'
                      : eq.estado === 'Próxima' || eq.horasFaltantes <= 50
                      ? 'border-amber-500/60 bg-amber-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400">{eq.numeroInterno}</span>
                      <h3 className="text-sm font-extrabold text-white">{eq.maquina}</h3>
                      <p className="text-[10px] text-slate-400">Faena: {eq.faenaActual}</p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        eq.estado === 'En Taller'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : eq.estado === 'Próxima' || eq.horasFaltantes <= 50
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {eq.estado}
                    </span>
                  </div>

                  {/* Horometro Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Horómetro Actual:</span>
                      <span className="font-bold text-white">{current.toFixed(1)} Hrs</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all ${
                          eq.estado === 'En Taller'
                            ? 'bg-rose-500'
                            : eq.horasFaltantes <= 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Meta: {target.toFixed(1)}h</span>
                      <span className="font-bold text-amber-400">
                        {eq.horasFaltantes > 0 ? `${eq.horasFaltantes.toFixed(1)}h faltantes` : '¡Servicio Requerido!'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-400 flex justify-between items-center">
                    <span>Última: {eq.ultimaMantencionFecha}</span>
                    <button
                      onClick={() => {
                        setFormEquipoId(eq.id);
                        setFormHorometro(eq.horometroActual.toString());
                        setIsNewLogModalOpen(true);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold underline"
                    >
                      + Mantención
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Maintenance Logbook Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Bitácora Histórica de Mantenciones (Preventivas y Correctivas)
              </h2>
              <p className="text-xs text-slate-400">
                Historial completo de intervenciones mecánicas, repuestos y mecánicos responsables
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar intervención..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Machine Filter */}
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedMachineFilter}
                  onChange={(e) => setSelectedMachineFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none font-semibold"
                >
                  <option value="Todas" className="bg-slate-900 text-white">Máquina: Todas</option>
                  <option value="LIEBHERR LTM 1250" className="bg-slate-900 text-white">LIEBHERR LTM 1250</option>
                  <option value="GROVE GMK 5250L" className="bg-slate-900 text-white">GROVE GMK 5250L</option>
                  <option value="TEREX DEMAG AC 250" className="bg-slate-900 text-white">TEREX DEMAG AC 250</option>
                  <option value="LIEBHERR LTM 1500" className="bg-slate-900 text-white">LIEBHERR LTM 1500</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none font-semibold"
                >
                  <option value="Todos" className="bg-slate-900 text-white">Tipo: Todos</option>
                  <option value="Preventiva" className="bg-slate-900 text-white">Preventiva</option>
                  <option value="Correctiva" className="bg-slate-900 text-white">Correctiva</option>
                </select>
              </div>
            </div>
          </div>

          {/* Log Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">N° Orden</th>
                  <th className="py-3 px-4">Fecha / Horómetro</th>
                  <th className="py-3 px-4">Equipo</th>
                  <th className="py-3 px-4">Tipo & Categoría</th>
                  <th className="py-3 px-4">Detalle Intervención & Repuestos</th>
                  <th className="py-3 px-4">Mecánico / Taller</th>
                  <th className="py-3 px-4">Costo (CLP)</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{log.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-200">{log.fecha}</p>
                      <p className="text-[10px] text-amber-400 font-mono font-semibold">{log.horometroServicio} Hrs</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block uppercase">{log.maquina}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({log.numeroInterno})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold block w-fit mb-1 ${
                          log.tipo === 'Preventiva'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.tipo}
                      </span>
                      <span className="text-[10px] text-slate-400">{log.categoria}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-200 leading-snug">{log.descripcion}</p>
                      {log.repuestosUtilizados.length > 0 && (
                        <p className="text-[10px] text-slate-400 italic mt-1">
                          Repuestos: {log.repuestosUtilizados.join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <p className="font-semibold text-white">{log.mecanicoResponsable}</p>
                      <p className="text-[10px] text-slate-400">{log.taller}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ${log.costoEstimadoClp.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          log.estado === 'Completada'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : log.estado === 'En Taller'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {log.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Maintenance Registration Modal */}
      {isNewLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Registrar Orden de Mantención</h3>
                  <p className="text-xs text-slate-400">Ingreso de servicio preventivo o reparación correctiva</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewLogModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterLog} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Seleccionar Equipo / Grúa:</label>
                  <select
                    value={formEquipoId}
                    onChange={(e) => {
                      setFormEquipoId(e.target.value);
                      const eq = equipmentList.find((x) => x.id === e.target.value);
                      if (eq) setFormHorometro(eq.horometroActual.toString());
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-bold"
                  >
                    {equipmentList.map((eq) => (
                      <option key={eq.id} value={eq.id} className="bg-slate-900 text-white">
                        {eq.numeroInterno} - {eq.maquina} ({eq.faenaActual})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Tipo de Intervención:</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-bold"
                  >
                    <option value="Preventiva">Preventiva (Pauta de Horómetro)</option>
                    <option value="Correctiva">Correctiva (Reparación / Fuga)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Categoría:</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Motor & Aceite">Motor & Aceite</option>
                    <option value="Sistema Hidráulico">Sistema Hidráulico</option>
                    <option value="Frenos & Transmisión">Frenos & Transmisión</option>
                    <option value="Pluma & Telescópico">Pluma & Telescópico</option>
                    <option value="Sistema Eléctrico">Sistema Eléctrico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Fecha Servicio:</label>
                  <input
                    type="date"
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Horómetro (Hrs):</label>
                  <input
                    type="text"
                    value={formHorometro}
                    onChange={(e) => setFormHorometro(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Mecánico Responsable:</label>
                  <input
                    type="text"
                    value={formMecanico}
                    onChange={(e) => setFormMecanico(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="PEDRO AGUILERA"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Taller / Ubicación:</label>
                  <input
                    type="text"
                    value={formTaller}
                    onChange={(e) => setFormTaller(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="Taller Móvil Spence"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase mb-1">Descripción del Trabajo Realizado:</label>
                <textarea
                  rows={2}
                  value={formDescripcion}
                  onChange={(e) => setFormDescripcion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  placeholder="Detalle de pauta o diagnóstico técnico..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Repuestos Utilizados (separados por coma):</label>
                  <input
                    type="text"
                    value={formRepuestos}
                    onChange={(e) => setFormRepuestos(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                    placeholder="Aceite 15W40, Filtro Aceite Liebherr..."
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase mb-1">Costo Estimado (CLP $):</label>
                  <input
                    type="number"
                    value={formCosto}
                    onChange={(e) => setFormCosto(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewLogModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Guardar en Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Viewer Modal */}
      <JsonModal isOpen={isJsonOpen} onClose={() => setIsJsonOpen(false)} />
    </div>
  );
}
