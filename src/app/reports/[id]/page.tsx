'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReports } from '@/context/ReportContext';
import { PrintableReport } from '@/components/PrintableReport';
import { JsonModal } from '@/components/JsonModal';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { ReportSkeleton } from '@/components/skeletons/ReportSkeleton';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getReportById } = useReports();
  const [isLoading, setIsLoading] = useState(true);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  const reportId = params?.id as string;
  const report = getReportById(reportId);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6">
        <ReportSkeleton />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Reporte #{reportId} No Encontrado</h2>
          <p className="text-xs text-slate-400">
            El reporte solicitado no existe o fue eliminado del almacenamiento de prueba.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6">
      <PrintableReport report={report} onOpenJson={() => setIsJsonOpen(true)} />

      <JsonModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        singleReportId={report.id}
      />
    </div>
  );
}
