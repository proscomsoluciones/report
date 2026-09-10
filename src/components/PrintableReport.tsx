'use client';

import React from 'react';
import { ReportItem } from '@/types/report';
import { Truck, CheckCircle2, ShieldCheck, Printer, ArrowLeft, Edit3, Code } from 'lucide-react';
import Link from 'next/link';

interface PrintableReportProps {
  report: ReportItem;
  onOpenJson?: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report, onOpenJson }) => {
  const handlePrint = () => {
    window.print();
  };

  // Fill up to 14 activity rows if fewer exist, matching the physical paper document
  const activityRows = Array.from({ length: 14 }, (_, index) => {
    const activity = report.actividades.find((a) => a.id === index + 1);
    return {
      num: index + 1,
      descripcion: activity ? activity.descripcion : '',
    };
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Screen Controls Toolbar (hidden during print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg text-white">
        <div className="flex items-center justify-between sm:justify-start space-x-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden xs:inline">Volver al</span> Dashboard
          </Link>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">ID: #{report.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                report.estado === 'Firmado'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : report.estado === 'Pendiente V°B°'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {report.estado}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 sm:space-x-3">
          {onOpenJson && (
            <button
              onClick={onOpenJson}
              className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" /> JSON
            </button>
          )}

          <Link
            href={`/reports/new?edit=${report.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" /> Editar
          </Link>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Imprimir /</span> PDF
          </button>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Wrapper for Small Mobile Screens */}
      <div className="overflow-x-auto rounded-xl shadow-2xl print:overflow-visible">
        {/* PHYSICAL PAPER REPLICA CONTAINER */}
        <div className="min-w-[700px] sm:min-w-0 bg-white text-slate-950 p-6 sm:p-8 rounded-xl border border-slate-300 font-sans tracking-tight print:p-0 print:border-none print:shadow-none print:bg-transparent">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-950 text-amber-500 font-black rounded flex items-center justify-center text-xl print:border print:border-slate-950">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase text-slate-950 leading-none">
                  BURGER
                </h1>
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest leading-tight">
                  GRUAS Y TRANSPORTES ESPECIALES Burger Limitada
                </p>
                <p className="text-[9px] text-slate-500">
                  LAS ESTERAS SUR N° 2901 • TELEFONO +56 22 959 9000 • FAX +56 22 959 9099
                </p>
                <p className="text-[9px] text-slate-500">QUILICURA - SANTIAGO • www.burgergruas.com • Zip 872-0042</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-rose-700 font-mono tracking-wider">
                N° {report.id}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">CÓDIGO: {report.codigo}</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 border-y border-slate-400 py-1 bg-slate-50">
              REPORTE DE TRABAJO DIARIO
            </h2>
          </div>

          {/* Info Grid (Faena, Operador, Maquina, Fecha, Turno) */}
          <div className="grid grid-cols-12 gap-2 text-xs border border-slate-950 p-3 bg-white mb-4 rounded-sm">
            <div className="col-span-7 space-y-1.5 pr-2 border-r border-slate-300">
              <div className="flex">
                <span className="font-bold w-32 uppercase text-slate-800">FAENA:</span>
                <span className="font-semibold text-slate-950 uppercase underline decoration-amber-500 decoration-2">
                  {report.faena}
                </span>
              </div>
              <div className="flex">
                <span className="font-bold w-32 uppercase text-slate-800">OPERADOR:</span>
                <span className="font-semibold text-slate-950 uppercase">{report.operador}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-32 uppercase text-slate-800">HORA ENTRADA TURNO:</span>
                <span className="font-semibold text-slate-950">{report.horaEntrada} V°B°</span>
              </div>
              <div className="flex">
                <span className="font-bold w-32 uppercase text-slate-800">HORA SALIDA TURNO:</span>
                <span className="font-semibold text-slate-950">{report.horaSalida} V°B°</span>
              </div>
              <div className="flex">
                <span className="font-bold w-32 uppercase text-slate-800">TOTAL TURNO:</span>
                <span className="font-bold text-slate-950 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  {report.totalTurno}
                </span>
              </div>
            </div>

            <div className="col-span-5 space-y-1.5 pl-2">
              <div className="flex">
                <span className="font-bold w-36 uppercase text-slate-800">MAQUINA:</span>
                <span className="font-bold text-slate-950 uppercase">{report.maquina}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-36 uppercase text-slate-800">FECHA:</span>
                <span className="font-semibold text-slate-950">{report.fecha}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-36 uppercase text-slate-800">NUMERO INTERNO EQUIPO:</span>
                <span className="font-bold text-slate-950 uppercase">{report.numeroEquipo}</span>
              </div>
            </div>
          </div>

          {/* Main Section: Horómetro & Activities Table */}
          <div className="grid grid-cols-12 gap-3 mb-4">
            {/* Horometro Box */}
            <div className="col-span-4 border border-slate-950 rounded-sm p-2 flex flex-col justify-between bg-slate-50">
              <div>
                <div className="bg-slate-950 text-white text-[11px] font-bold text-center py-1 uppercase tracking-wider mb-2">
                  HOROMETRO
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-300 pb-1">
                    <span className="font-bold text-slate-800">INICIAL:</span>
                    <span className="font-mono font-bold text-slate-950 bg-white px-2 py-0.5 border border-slate-300 rounded">
                      {report.horometro.inicial}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-300 pb-1">
                    <span className="font-bold text-slate-800">FINAL:</span>
                    <span className="font-mono font-bold text-slate-950 bg-white px-2 py-0.5 border border-slate-300 rounded">
                      {report.horometro.final || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold text-slate-800">TOTAL HORAS:</span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-300 rounded">
                      {report.horometro.totalHoras || '---'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fluid Checks */}
              <div className="mt-4 border-t border-slate-400 pt-2 space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">COMBUSTIBLE:</span>
                  <span className="font-mono font-bold text-slate-950">{report.fluidos.combustible}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">AC. MOTOR:</span>
                  <span className="font-bold text-emerald-700">{report.fluidos.acMotor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">AC. TRANSMISION:</span>
                  <span className="font-bold text-emerald-700">{report.fluidos.acTransmision}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">AC. HIDRAULICO:</span>
                  <span className="font-bold text-emerald-700">{report.fluidos.acHidraulico}</span>
                </div>
              </div>

              <div className="mt-3 border-t border-slate-400 pt-2 text-[10px]">
                <span className="font-bold text-slate-800 block">OBSERVACIONES:</span>
                <p className="italic text-slate-900 leading-tight mt-0.5 uppercase">{report.observaciones}</p>
              </div>
            </div>

            {/* Activities Table (1 to 14) */}
            <div className="col-span-8 border border-slate-950 rounded-sm overflow-hidden">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-white font-bold text-[11px] uppercase tracking-wider">
                    <th className="w-10 py-1 border-r border-slate-700 text-center">N°</th>
                    <th className="py-1 px-2 text-left">DESCRIPCION ACTIVIDAD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {activityRows.map((row) => (
                    <tr key={row.num} className={row.descripcion ? 'bg-amber-50/40' : ''}>
                      <td className="py-1 text-center font-bold text-slate-700 border-r border-slate-300 text-[11px]">
                        {row.num}
                      </td>
                      <td className="py-1 px-2 text-[11px] font-semibold text-slate-950 uppercase leading-snug">
                        {row.descripcion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Disclaimer Footer */}
          <div className="border border-slate-950 p-2 text-[9px] text-slate-800 leading-tight mb-4 bg-slate-50 text-justify">
            <p>
              Se establece que el Sr. Cliente deberá tomar los seguros correspondientes a fin de cubrir posibles daños, especialmente en maquinarias y mercadería frágil. Servicio de Grúa y Transportes Especiales BURGER Limitada sólo responderá hasta un monto no superior a la valorización de la presente. Cualquier observación que se refiera a la faena deberá dejarse constancia por escrito en la presente.
            </p>
          </div>

          {/* Signatures Area */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-400 text-center text-xs">
            {/* Supervisor Signature */}
            <div className="flex flex-col items-center justify-end min-h-[90px]">
              {report.firmaSupervisorUrl ? (
                <img src={report.firmaSupervisorUrl} alt="Firma Supervisor" className="h-12 object-contain mb-1" />
              ) : report.tieneFirmaSupervisor ? (
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs py-2">
                  <CheckCircle2 className="w-4 h-4" /> FIRMADO DIGITALMENTE
                </div>
              ) : (
                <div className="text-slate-400 italic text-[11px] py-4">(Pendiente Firma)</div>
              )}
              <div className="border-t border-slate-950 w-full pt-1 font-bold text-slate-900 uppercase">
                FIRMA SUPERVISOR
              </div>
            </div>

            {/* Supervisor Name */}
            <div className="flex flex-col items-center justify-end min-h-[90px]">
              <div className="font-semibold text-slate-950 uppercase mb-2 underline">
                {report.nombreSupervisor || 'CARLOS GUTIERREZ'}
              </div>
              <div className="border-t border-slate-950 w-full pt-1 font-bold text-slate-900 uppercase">
                NOMBRE SUPERVISOR
              </div>
            </div>

            {/* Operator Signature */}
            <div className="flex flex-col items-center justify-end min-h-[90px]">
              {report.firmaOperadorUrl ? (
                <img src={report.firmaOperadorUrl} alt="Firma Operador" className="h-12 object-contain mb-1" />
              ) : report.tieneFirmaOperador ? (
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs py-2">
                  <ShieldCheck className="w-4 h-4" /> FIRMADO EN TERRENO
                </div>
              ) : (
                <div className="text-slate-400 italic text-[11px] py-4">(Pendiente Firma)</div>
              )}
              <div className="border-t border-slate-950 w-full pt-1 font-bold text-slate-900 uppercase">
                FIRMA OPERADOR
              </div>
              <div className="text-[9px] text-slate-500 font-semibold mt-0.5">Original Cliente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
