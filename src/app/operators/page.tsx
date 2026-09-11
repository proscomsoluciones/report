'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  FileCheck2,
  Phone,
  HardHat,
  Award,
  RefreshCw,
  Code,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { MOCK_OPERATORS } from '@/data/mockOperators';
import { OperatorCertification } from '@/types/operator';
import { useReports } from '@/context/ReportContext';
import { JsonModal } from '@/components/JsonModal';
import { CardsSkeleton } from '@/components/skeletons/CardsSkeleton';

export default function OperatorsPage() {
  const { currentUser } = useReports();
  const [isLoading, setIsLoading] = useState(true);
  const [operatorsList, setOperatorsList] = useState<OperatorCertification[]>(MOCK_OPERATORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Alertas' | 'Vencidas'>('Todos');
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CardsSkeleton />;
  }

  // Role Guard: Only Supervisor and Administrador can access operator accreditation management
  if (currentUser?.rol === 'Operador' || currentUser?.rol === 'Mecánico' || currentUser?.rol === 'Cliente') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
              Rol Activo: {currentUser?.rol}
            </span>
            <h2 className="text-xl font-black text-white pt-2">Acreditaciones Restringidas</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              El perfil <strong>{currentUser?.rol}</strong> no tiene permisos para auditar acreditaciones de personal. Este módulo está reservado para el rol <strong>Supervisor</strong> y <strong>Administración</strong>.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <Link
              href="/dashboard"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Compute KPIs
  const totalOperators = operatorsList.length;
  const expiredCount = operatorsList.filter(
    (o) => o.licenciaEstado === 'Vencida' || o.examenEstado === 'Vencida' || o.certificacionEstado === 'Vencida'
  ).length;
  const warningCount = operatorsList.filter(
    (o) =>
      (o.licenciaEstado === 'Por Vencer' || o.examenEstado === 'Por Vencer' || o.certificacionEstado === 'Por Vencer') &&
      !expiredCount
  ).length;
  const upToDateCount = totalOperators - expiredCount - warningCount;

  // Filter list
  const filteredOperators = operatorsList.filter((op) => {
    const matchesSearch =
      op.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.rut.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.faenaAsignada.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.equipoAsignado.toLowerCase().includes(searchQuery.toLowerCase());

    const hasWarning =
      op.licenciaEstado === 'Por Vencer' || op.examenEstado === 'Por Vencer' || op.certificacionEstado === 'Por Vencer';
    const hasExpired =
      op.licenciaEstado === 'Vencida' || op.examenEstado === 'Vencida' || op.certificacionEstado === 'Vencida';

    if (statusFilter === 'Alertas') return hasWarning || hasExpired;
    if (statusFilter === 'Vencidas') return hasExpired;
    return matchesSearch;
  });

  const handleRenewExamen = (id: string) => {
    const updated = operatorsList.map((op) => {
      if (op.id === id) {
        return {
          ...op,
          examenVencimiento: '2027-09-30',
          examenEstado: 'Al Día' as const,
          diasParaProximoVencimiento: 380,
        };
      }
      return op;
    });
    setOperatorsList(updated);
  };

  const handleRenewLicencia = (id: string) => {
    const updated = operatorsList.map((op) => {
      if (op.id === id) {
        return {
          ...op,
          licenciaVencimiento: '2028-09-30',
          licenciaEstado: 'Al Día' as const,
          diasParaProximoVencimiento: 730,
        };
      }
      return op;
    });
    setOperatorsList(updated);
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

          <button
            onClick={() => setIsJsonOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Code className="w-4 h-4" /> Exportar JSON Acreditaciones
          </button>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Módulo de Control de Personal & Acreditaciones Terreno</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Licencias y Exámenes Ocupacionales de Operadores
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Control en tiempo real de licencias profesionales (Clase D/A4), exámenes de Gran Altura Geográfica y certificaciones técnicas de grúas para faenas mineras (SPENCE, ESCONDIDA, COLLAHUASI).
          </p>
        </div>

        {/* Metric Cards (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Operators */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Operadores Habilitados</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalOperators}</p>
              <p className="text-[11px] text-slate-400 mt-1">Personal en faena activa</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Up to date */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Acreditaciones Al Día</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{upToDateCount}</p>
              <p className="text-[11px] text-emerald-400/80 mt-1">Vigencia mayor a 30 días</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Warning Count */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Por Vencer (&lt; 30 Días)</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{warningCount}</p>
              <p className="text-[11px] text-amber-400/80 mt-1">Requieren renovación pronto</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Expired Count */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Vencidas / Bloqueados</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{expiredCount}</p>
              <p className="text-[11px] text-rose-400/80 mt-1">Inhabilitado para maniobra</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar operador por nombre, RUT, faena..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {(['Todos', 'Alertas', 'Vencidas'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === filter
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {filter === 'Alertas' ? '⚠️ Alertas' : filter === 'Vencidas' ? '❌ Vencidas' : 'Todos'}
              </button>
            ))}
          </div>
        </div>

        {/* Operator Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOperators.map((op) => (
            <div
              key={op.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all ${
                op.licenciaEstado === 'Vencida' || op.examenEstado === 'Vencida'
                  ? 'border-rose-800/80 bg-rose-950/10'
                  : op.licenciaEstado === 'Por Vencer' || op.examenEstado === 'Por Vencer'
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Top Banner Header */}
              <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-black flex items-center justify-center text-lg">
                    {op.nombre.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white uppercase">{op.nombre}</h3>
                    <p className="text-xs text-slate-400 font-mono">RUT: {op.rut}</p>
                    <p className="text-[11px] text-amber-400 font-semibold">{op.cargo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-bold text-slate-300 block">
                    {op.faenaAsignada}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">{op.equipoAsignado}</span>
                </div>
              </div>

              {/* Status Certifications Checklist */}
              <div className="space-y-3 text-xs mb-6">
                {/* 1. Licencia de Conducir */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileCheck2 className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-bold text-white">{op.licenciaClase}</p>
                      <p className="text-[10px] text-slate-400">Vencimiento: {op.licenciaVencimiento}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      op.licenciaEstado === 'Al Día'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : op.licenciaEstado === 'Por Vencer'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {op.licenciaEstado === 'Por Vencer' ? '⚠️ Por Vencer' : op.licenciaEstado}
                  </span>
                </div>

                {/* 2. Examen Ocupacional */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HardHat className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">{op.examenOcupacional}</p>
                      <p className="text-[10px] text-slate-400">Vencimiento: {op.examenVencimiento}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      op.examenEstado === 'Al Día'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : op.examenEstado === 'Por Vencer'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {op.examenEstado === 'Por Vencer' ? '⚠️ Por Vencer' : op.examenEstado}
                  </span>
                </div>

                {/* 3. Certificación Técnica Grúa */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="font-bold text-white">{op.certificacionTecnica}</p>
                      <p className="text-[10px] text-slate-400">Vencimiento: {op.certificacionVencimiento}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      op.certificacionEstado === 'Al Día'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : op.certificacionEstado === 'Por Vencer'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {op.certificacionEstado}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {op.telefono}
                </span>

                <div className="flex items-center space-x-2">
                  {op.examenEstado !== 'Al Día' && (
                    <button
                      onClick={() => handleRenewExamen(op.id)}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Renovar Examen
                    </button>
                  )}

                  {op.licenciaEstado !== 'Al Día' && (
                    <button
                      onClick={() => handleRenewLicencia(op.id)}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Renovar Licencia
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Viewer Modal */}
      <JsonModal isOpen={isJsonOpen} onClose={() => setIsJsonOpen(false)} />
    </div>
  );
}
