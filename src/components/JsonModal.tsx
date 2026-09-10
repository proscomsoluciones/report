'use client';

import React, { useState } from 'react';
import { X, Copy, Download, RefreshCw, Check, Code } from 'lucide-react';
import { useReports } from '@/context/ReportContext';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleReportId?: string;
}

export const JsonModal: React.FC<JsonModalProps> = ({ isOpen, onClose, singleReportId }) => {
  const { reports, getReportById, resetToDefault } = useReports();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const dataToDisplay = singleReportId ? getReportById(singleReportId) : reports;
  const jsonString = JSON.stringify(dataToDisplay, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = singleReportId ? `reporte_burger_${singleReportId}.json` : `reportes_burger_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {singleReportId ? `Estructura JSON - Reporte #${singleReportId}` : 'Visor y Exportador de Datos JSON'}
              </h3>
              <p className="text-xs text-slate-400">
                Formato estándar de integración REST API / Base de Datos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-6 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-amber-300/90 leading-relaxed border-b border-slate-800">
          <pre className="whitespace-pre-wrap break-all">{jsonString}</pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              if (confirm('¿Desea restablecer todos los datos al estado de demostración original?')) {
                resetToDefault();
              }
            }}
            className="flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-2 rounded-lg border border-rose-800/40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Restablecer Demo Inicial
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar JSON
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-lg transition-colors font-sans"
            >
              <Download className="w-4 h-4" /> Descargar .JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
