'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Save,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Gauge,
  PenTool,
  CheckCircle2,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { useReports } from '@/context/ReportContext';
import { ReportItem, ActivityItem } from '@/types/report';
import { SignatureCanvas } from '@/components/SignatureCanvas';
import { MOCK_DOCUMENT_002532 } from '@/data/mockReports';

function ReportFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { addReport, updateReport, getReportById } = useReports();

  // Form States
  const [id, setId] = useState('');
  const [faena, setFaena] = useState('SPENCE');
  const [maquina, setMaquina] = useState('LTM 1250');
  const [fecha, setFecha] = useState('2026-08-01');
  const [operador, setOperador] = useState('RAUL SOLORZA');
  const [numeroEquipo, setNumeroEquipo] = useState('#140');
  const [horaEntrada, setHoraEntrada] = useState('08:00');
  const [horaSalida, setHoraSalida] = useState('20:00');
  const [totalTurno, setTotalTurno] = useState('12 Hrs');

  // Horometro
  const [horometroInicial, setHorometroInicial] = useState('218182.5');
  const [horometroFinal, setHorometroFinal] = useState('218194.5');
  const [horometroTotal, setHorometroTotal] = useState('12.0');

  // Fluidos
  const [combustible, setCombustible] = useState('40%');
  const [acMotor, setAcMotor] = useState('OK');
  const [acTransmision, setAcTransmision] = useState('OK');
  const [acHidraulico, setAcHidraulico] = useState('OK');

  // Observaciones & Signatures
  const [observaciones, setObservaciones] = useState('SIN OBSERVA.');
  const [nombreSupervisor, setNombreSupervisor] = useState('CARLOS GUTIERREZ');
  const [firmaSupervisorUrl, setFirmaSupervisorUrl] = useState<string>('');
  const [firmaOperadorUrl, setFirmaOperadorUrl] = useState<string>('');
  const [estado, setEstado] = useState<'Borrador' | 'Pendiente V°B°' | 'Firmado'>('Firmado');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actividades
  const [actividades, setActividades] = useState<ActivityItem[]>([
    {
      id: 1,
      descripcion: 'SE SUSPENDE TRABAJO EN BODEGA PRINCIPAL POR DESCORDINACION DE PARTE DEL SOLICITANTE.',
    },
  ]);

  useEffect(() => {
    if (editId) {
      const existing = getReportById(editId);
      if (existing) {
        setId(existing.id);
        setFaena(existing.faena);
        setMaquina(existing.maquina);
        setFecha(existing.fecha);
        setOperador(existing.operador);
        setNumeroEquipo(existing.numeroEquipo);
        setHoraEntrada(existing.horaEntrada);
        setHoraSalida(existing.horaSalida);
        setTotalTurno(existing.totalTurno);
        setHorometroInicial(existing.horometro.inicial);
        setHorometroFinal(existing.horometro.final);
        setHorometroTotal(existing.horometro.totalHoras);
        setCombustible(existing.fluidos.combustible);
        setAcMotor(existing.fluidos.acMotor);
        setAcTransmision(existing.fluidos.acTransmision);
        setAcHidraulico(existing.fluidos.acHidraulico);
        setObservaciones(existing.observaciones);
        setNombreSupervisor(existing.nombreSupervisor);
        setFirmaSupervisorUrl(existing.firmaSupervisorUrl || '');
        setFirmaOperadorUrl(existing.firmaOperadorUrl || '');
        setEstado(existing.estado as any);
        setActividades(existing.actividades);
      }
    } else {
      // Generate new sequential ID
      const randomId = Math.floor(1000 + Math.random() * 9000).toString();
      setId(`00${randomId}`);
    }
  }, [editId]);

  // Recalculate Horometro total automatically
  useEffect(() => {
    const ini = parseFloat(horometroInicial);
    const fin = parseFloat(horometroFinal);
    if (!isNaN(ini) && !isNaN(fin) && fin >= ini) {
      setHorometroTotal((fin - ini).toFixed(1));
    }
  }, [horometroInicial, horometroFinal]);

  // Auto fill sample data from the physical photo #002532
  const handleAutoFillPhotoData = () => {
    setId('002532');
    setFaena(MOCK_DOCUMENT_002532.faena);
    setMaquina(MOCK_DOCUMENT_002532.maquina);
    setFecha(MOCK_DOCUMENT_002532.fecha);
    setOperador(MOCK_DOCUMENT_002532.operador);
    setNumeroEquipo(MOCK_DOCUMENT_002532.numeroEquipo);
    setHoraEntrada(MOCK_DOCUMENT_002532.horaEntrada);
    setHoraSalida(MOCK_DOCUMENT_002532.horaSalida);
    setTotalTurno(MOCK_DOCUMENT_002532.totalTurno);
    setHorometroInicial(MOCK_DOCUMENT_002532.horometro.inicial);
    setHorometroFinal(MOCK_DOCUMENT_002532.horometro.final);
    setHorometroTotal(MOCK_DOCUMENT_002532.horometro.totalHoras);
    setCombustible(MOCK_DOCUMENT_002532.fluidos.combustible);
    setAcMotor(MOCK_DOCUMENT_002532.fluidos.acMotor);
    setAcTransmision(MOCK_DOCUMENT_002532.fluidos.acTransmision);
    setAcHidraulico(MOCK_DOCUMENT_002532.fluidos.acHidraulico);
    setObservaciones(MOCK_DOCUMENT_002532.observaciones);
    setNombreSupervisor(MOCK_DOCUMENT_002532.nombreSupervisor);
    setActividades(MOCK_DOCUMENT_002532.actividades);
    setEstado('Firmado');
  };

  const handleAddActivity = () => {
    if (actividades.length >= 14) return;
    setActividades([
      ...actividades,
      { id: actividades.length + 1, descripcion: '' },
    ]);
  };

  const handleRemoveActivity = (index: number) => {
    const updated = actividades.filter((_, i) => i !== index).map((act, i) => ({ ...act, id: i + 1 }));
    setActividades(updated);
  };

  const handleActivityChange = (index: number, val: string) => {
    const updated = [...actividades];
    updated[index].descripcion = val;
    setActividades(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const reportData: ReportItem = {
      id: id || '002532',
      codigo: 'BG_COM_F003_002',
      faena,
      maquina,
      fecha,
      operador,
      numeroEquipo,
      horaEntrada,
      horaSalida,
      totalTurno,
      horometro: {
        inicial: horometroInicial,
        final: horometroFinal,
        totalHoras: horometroTotal,
      },
      actividades,
      fluidos: {
        combustible,
        acMotor,
        acTransmision,
        acHidraulico,
      },
      observaciones,
      nombreSupervisor,
      firmaSupervisorUrl,
      firmaOperadorUrl,
      tieneFirmaSupervisor: Boolean(firmaSupervisorUrl || estado === 'Firmado'),
      tieneFirmaOperador: Boolean(firmaOperadorUrl || estado === 'Firmado'),
      estado,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      if (editId) {
        updateReport(editId, reportData);
      } else {
        addReport(reportData);
      }
      router.push(`/reports/${reportData.id}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 sm:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </button>

          <button
            type="button"
            onClick={handleAutoFillPhotoData}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Cargar Datos del Reporte #002532 (FOTO FÍSICA)
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
          {/* Header Title */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <FileText className="w-4 h-4" /> Formulario Oficial Burger Limitada
              </div>
              <h1 className="text-2xl font-extrabold text-white">REPORTE DE TRABAJO DIARIO</h1>
              <p className="text-xs text-slate-400">Código de Documento: BG_COM_F003_002</p>
            </div>

            <div className="bg-slate-950 px-4 py-2 border border-slate-700 rounded-xl text-right">
              <label className="text-[10px] text-slate-400 uppercase font-semibold block">Número de Vale:</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="bg-transparent text-amber-400 font-mono font-bold text-lg text-right w-28 focus:outline-none"
                placeholder="002532"
                required
              />
            </div>
          </div>

          {/* Section 1: General Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 1. Datos de Faena y Equipo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Faena / Cliente:</label>
                <input
                  type="text"
                  value={faena}
                  onChange={(e) => setFaena(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 uppercase font-bold"
                  placeholder="Ej: SPENCE"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Máquina / Modelo:</label>
                <input
                  type="text"
                  value={maquina}
                  onChange={(e) => setMaquina(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 uppercase font-bold"
                  placeholder="Ej: LTM 1250"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Fecha de Operación:</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nombre Operador:</label>
                <input
                  type="text"
                  value={operador}
                  onChange={(e) => setOperador(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 uppercase"
                  placeholder="Ej: RAUL SOLORZA"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">N° Interno Equipo:</label>
                <input
                  type="text"
                  value={numeroEquipo}
                  onChange={(e) => setNumeroEquipo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500 font-mono"
                  placeholder="Ej: #140"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Total Turno:</label>
                <input
                  type="text"
                  value={totalTurno}
                  onChange={(e) => setTotalTurno(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-400 font-bold focus:border-amber-500"
                  placeholder="Ej: 12 Hrs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Hora Entrada Turno:</label>
                <input
                  type="time"
                  value={horaEntrada}
                  onChange={(e) => setHoraEntrada(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Hora Salida Turno:</label>
                <input
                  type="time"
                  value={horaSalida}
                  onChange={(e) => setHoraSalida(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Horómetro & Fluidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Horómetro */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4" /> Lectura de Horómetro
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Inicial:</label>
                  <input
                    type="text"
                    value={horometroInicial}
                    onChange={(e) => setHorometroInicial(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:border-amber-500 font-bold"
                    placeholder="218182.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Final:</label>
                  <input
                    type="text"
                    value={horometroFinal}
                    onChange={(e) => setHorometroFinal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:border-amber-500 font-bold"
                    placeholder="218194.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-amber-400 uppercase font-semibold mb-1">Total Horas:</label>
                  <input
                    type="text"
                    value={horometroTotal}
                    readOnly
                    className="w-full px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-400 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Fluidos */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Inspección de Niveles & Fluidos
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Combustible (LTS):</label>
                  <input
                    type="text"
                    value={combustible}
                    onChange={(e) => setCombustible(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    placeholder="40%"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Aceite Motor:</label>
                  <input
                    type="text"
                    value={acMotor}
                    onChange={(e) => setAcMotor(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold"
                    placeholder="OK"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Ac. Transmisión:</label>
                  <input
                    type="text"
                    value={acTransmision}
                    onChange={(e) => setAcTransmision(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold"
                    placeholder="OK"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Ac. Hidráulico:</label>
                  <input
                    type="text"
                    value={acHidraulico}
                    onChange={(e) => setAcHidraulico(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold"
                    placeholder="OK"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Activities Table */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 3. Registro de Actividades / Observaciones (1 - 14)
              </h3>

              <button
                type="button"
                onClick={handleAddActivity}
                disabled={actividades.length >= 14}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Fila ({actividades.length}/14)
              </button>
            </div>

            <div className="space-y-2">
              {actividades.map((act, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-8 h-9 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={act.descripcion}
                    onChange={(e) => handleActivityChange(index, e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase focus:border-amber-500"
                    placeholder="Descripción detallada de la maniobra u observación de faena..."
                  />
                  {actividades.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
                      className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Observaciones Generales:</label>
              <textarea
                rows={2}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase focus:border-amber-500"
                placeholder="SIN OBSERVA."
              />
            </div>
          </div>

          {/* Section 4: Signatures & Status */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <PenTool className="w-4 h-4" /> 4. Validaciones y Firmas Digitales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nombre Supervisor Faena:</label>
                <input
                  type="text"
                  value={nombreSupervisor}
                  onChange={(e) => setNombreSupervisor(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase mb-3"
                  placeholder="CARLOS GUTIERREZ"
                />
                <SignatureCanvas
                  label="Firma Supervisor"
                  onSave={(dataUrl) => setFirmaSupervisorUrl(dataUrl)}
                  initialValue={firmaSupervisorUrl}
                />
              </div>

              <div className="flex flex-col justify-between">
                <SignatureCanvas
                  label="Firma Operador"
                  onSave={(dataUrl) => setFirmaOperadorUrl(dataUrl)}
                  initialValue={firmaOperadorUrl}
                />

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Estado de Aprobación:</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-amber-400 font-bold focus:outline-none"
                  >
                    <option value="Firmado">Firmado (Aprobado y Validado)</option>
                    <option value="Pendiente V°B°">Pendiente V°B° Supervisor</option>
                    <option value="Borrador">Borrador (En edición)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-800 flex justify-end space-x-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg transition-all disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Generando Reporte Digital...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar y Generar Ticket Digital</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Corporate Processing Overlay Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Generando Reporte Digital N° {id}...</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Validando horómetro, registro de actividades y firmas en terreno...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Cargando formulario...
      </div>
    }>
      <ReportFormContent />
    </Suspense>
  );
}
