'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenTool } from 'lucide-react';

interface SignatureCanvasProps {
  label: string;
  onSave: (dataUrl: string) => void;
  initialValue?: string;
  readOnly?: boolean;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  label,
  onSave,
  initialValue,
  readOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(initialValue));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#0f172a'; // Navy stroke
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialValue) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialValue;
    }
  }, [initialValue]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing || readOnly) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave('');
  };

  const generateDemoSignature = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 3;

    // Draw realistic signature strokes
    ctx.moveTo(rect.width * 0.2, rect.height * 0.6);
    ctx.bezierCurveTo(
      rect.width * 0.3,
      rect.height * 0.1,
      rect.width * 0.4,
      rect.height * 0.9,
      rect.width * 0.5,
      rect.height * 0.4
    );
    ctx.bezierCurveTo(
      rect.width * 0.6,
      rect.height * 0.2,
      rect.width * 0.7,
      rect.height * 0.7,
      rect.width * 0.85,
      rect.height * 0.5
    );
    ctx.stroke();

    // Add underline stroke
    ctx.beginPath();
    ctx.moveTo(rect.width * 0.15, rect.height * 0.75);
    ctx.lineTo(rect.width * 0.88, rect.height * 0.72);
    ctx.stroke();

    setHasSignature(true);
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-white dark:bg-slate-900 shadow-sm flex flex-col space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-amber-500" />
          {label}
        </span>
        {hasSignature && (
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
            <Check className="w-3 h-3" /> Firmado
          </span>
        )}
      </div>

      <div className="relative w-full h-32 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 rounded flex items-center justify-center overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none"
        />
        {!hasSignature && !readOnly && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs space-y-1">
            <span>Trace la firma digital aquí</span>
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="flex justify-between items-center text-xs pt-1">
          <button
            type="button"
            onClick={clearCanvas}
            className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Eraser className="w-3.5 h-3.5" /> Limpiar
          </button>
          <button
            type="button"
            onClick={generateDemoSignature}
            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded border border-amber-200 dark:border-amber-800"
          >
            Firma Demo
          </button>
        </div>
      )}
    </div>
  );
};
