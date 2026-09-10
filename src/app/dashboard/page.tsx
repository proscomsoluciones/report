'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  PlusCircle,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Code,
  Sparkles,
  FileCheck,
  RefreshCcw,
} from 'lucide-react';
import { useReports } from '@/context/ReportContext';
import { JsonModal } from '@/components/JsonModal';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  const router = useRouter();
  const { reports, currentUser, deleteReport, resetToDefault } = useReports();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaena, setSelectedFaena] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [jsonTargetId, setJsonTargetId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Compute KPIs
  const totalReports = reports.length;
  const totalHoursWorked = reports.reduce((acc, curr) => {
    const hours = parseFloat(curr.horometro?.totalHoras || '0');
    return acc + (isNaN(hours) ? 0 : hours);
  }, 0);
  const activeMachines = new Set(reports.map((r) => r.maquina)).size;
  const pendingApprovals = reports.filter((r) => r.estado === 'Pendiente V°B°' || r.estado === 'Borrador').length;

  // Filtered reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.faena.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.operador.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.maquina.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFaena = selectedFaena === 'Todas' || report.faena === selectedFaena;
    const matchesStatus = selectedStatus === 'Todos' || report.estado === selectedStatus;

    return matchesSearch && matchesFaena && matchesStatus;
  });

  const faenasList = ['Todas', ...Array.from(new Set(reports.map((r) => r.faena)))];

  const handleOpenJsonForReport = (id?: string) => {
    setJsonTargetId(id);
    setIsJsonOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 z-10">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Panel Operativo de Control de Grúas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Bienvenido, {currentUser?.nombre || 'Operador'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Sistema digital de control para <span className="text-amber-400 font-semibold">Burger Grúas</span>. Registre y revise vales diarios de trabajo en terreno.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => handleOpenJsonForReport()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Code className="w-4 h-4" /> Ver JSON de Datos
            </button>

            <Link
              href="/reports/new"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Registrar Nuevo Reporte
            </Link>
          </div>
        </div>

        {/* Highlight Banner for Sample Document #002532 */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 text-slate-950 font-black rounded-lg">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">
                Documento de Muestra N° 002532 (Faena SPENCE)
              </p>
              <p className="text-slate-300">
                Basado exactamente en la ficha física fotografiada (Operador Raúl Solorza, LTM 1250, Horómetro 218182.5).
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/reports/002532"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              Ver Voucher Físico Digital
            </Link>
          </div>
        </div>

        {/* Operational Alert Banners Grid (Operators + Maintenance) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Operators Accreditation Alert Card */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-2">
                  <span>Acreditación Operadores</span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold">2 Alertas</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Examen Raúl Solorza (vence 12d) • Licencia Marcelo Silva (Vencida).
                </p>
              </div>
            </div>
            <Link
              href="/operators"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold rounded-lg transition-colors whitespace-nowrap text-xs"
            >
              Ver Operadores
            </Link>
          </div>

          {/* Maintenance Horómetro Alert Card */}
          <div className="bg-slate-900 border border-rose-500/40 rounded-xl p-4 flex items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-xs sm:text-sm flex items-center gap-2">
                  <span>Mantenciones & Horómetros</span>
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full text-[10px] font-bold">1 En Taller</span>
                </p>
                <p className="text-[11px] text-slate-400 leading-snug">
                  GROVE 5250 (Próxima pauta 15h) • DEMAG AC250 en reparación hidráulica.
                </p>
              </div>
            </div>
            <Link
              href="/maintenance"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold rounded-lg transition-colors whitespace-nowrap text-xs"
            >
              Ver Bitácora
            </Link>
          </div>
        </div>

        {/* Metric Cards (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Reportes</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalReports}</p>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Registros activos
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Hours */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Horas Trabajadas</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalHoursWorked.toFixed(1)} <span className="text-xs text-amber-400">Hrs</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Suma horómetros acumulados</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Active Machines */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Equipos en Faena</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{activeMachines}</p>
              <p className="text-[11px] text-slate-400 mt-1">Grúas operativas registradas</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Pending Approvals */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pendientes V°B°</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{pendingApprovals}</p>
              <p className="text-[11px] text-amber-400/80 mt-1">Requieren firma supervisor</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Reports Table Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {/* Table Header & Filters */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Historial de Reportes Diarios de Trabajo
              </h2>
              <p className="text-xs text-slate-400">
                Fichas registradas con código oficial BG_COM_F003_002
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar faena, operador, id..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Faena Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedFaena}
                  onChange={(e) => setSelectedFaena(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none font-semibold"
                >
                  {faenasList.map((faena) => (
                    <option key={faena} value={faena} className="bg-slate-900 text-white">
                      Faena: {faena}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none font-semibold"
                >
                  <option value="Todos" className="bg-slate-900 text-white">Estado: Todos</option>
                  <option value="Firmado" className="bg-slate-900 text-white">Firmado</option>
                  <option value="Pendiente V°B°" className="bg-slate-900 text-white">Pendiente V°B°</option>
                  <option value="Borrador" className="bg-slate-900 text-white">Borrador</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">N° Vale</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Faena</th>
                  <th className="py-3 px-4">Máquina / Equipo</th>
                  <th className="py-3 px-4">Operador</th>
                  <th className="py-3 px-4">Horas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      No se encontraron reportes con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        #{report.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{report.fecha}</td>
                      <td className="py-3.5 px-4 font-bold text-white uppercase">{report.faena}</td>
                      <td className="py-3.5 px-4 text-slate-200">
                        <span className="font-semibold">{report.maquina}</span>{' '}
                        <span className="text-[10px] text-slate-400 font-mono">({report.numeroEquipo})</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{report.operador}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-300">
                        {report.horometro?.totalHoras || report.totalTurno}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            report.estado === 'Firmado'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : report.estado === 'Pendiente V°B°'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {report.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/reports/${report.id}`}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                            title="Ver Ticket Digital e Imprimir"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleOpenJsonForReport(report.id)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition-colors"
                            title="Ver Estructura JSON"
                          >
                            <Code className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar reporte #${report.id}?`)) {
                                deleteReport(report.id);
                              }
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View (shown on mobile, hidden on desktop) */}
          <div className="md:hidden space-y-3">
            {filteredReports.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No se encontraron reportes con los filtros seleccionados.
              </div>
            ) : (
              filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      N° #{report.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        report.estado === 'Firmado'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : report.estado === 'Pendiente V°B°'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {report.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Faena:</span>
                      <span className="font-bold text-white uppercase">{report.faena}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Fecha:</span>
                      <span className="text-slate-200">{report.fecha}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Máquina:</span>
                      <span className="text-slate-200 font-semibold">{report.maquina} ({report.numeroEquipo})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Operador:</span>
                      <span className="text-slate-300">{report.operador}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Total: {report.horometro?.totalHoras || report.totalTurno} Hrs
                    </span>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/reports/${report.id}`}
                        className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Ticket
                      </Link>
                      <button
                        onClick={() => handleOpenJsonForReport(report.id)}
                        className="p-1.5 bg-slate-800 text-amber-400 rounded-lg text-xs border border-slate-700"
                        title="JSON"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      <JsonModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        singleReportId={jsonTargetId}
      />
    </div>
  );
}
