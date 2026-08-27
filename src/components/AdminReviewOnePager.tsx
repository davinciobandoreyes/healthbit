import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Mail,
  Phone,
  Building2,
  User,
  FileText,
  ScanLine,
  Pause,
  Play,
} from 'lucide-react';
import { PendingRethusReview } from '../types';

interface AdminReviewOnePagerProps {
  review: PendingRethusReview;
  onBack: () => void;
  onConfirm: () => void;
  onDeny: () => void;
  onTogglePause?: () => void;
}

export const AdminReviewOnePager: React.FC<AdminReviewOnePagerProps> = ({
  review,
  onBack,
  onConfirm,
  onDeny,
  onTogglePause,
}) => {
  const [preview, setPreview] = useState<{ title: string; src: string } | null>(null);

  const submittedLabel = new Date(review.submittedAt).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const statusBadge =
    review.status === 'approved'
      ? {
          label: review.isPaused ? 'Pausado' : 'Aceptada',
          className: review.isPaused
            ? 'text-amber-700 bg-amber-50 border-amber-200/80'
            : 'text-violet-700 bg-violet-50 border-violet-200/80',
        }
      : review.status === 'denied'
        ? { label: 'Negada', className: 'text-slate-600 bg-slate-100 border-slate-200/80' }
        : { label: 'Pendiente', className: 'text-amber-700 bg-amber-50 border-amber-200/80' };

  const showDecisionFooter = review.status === 'pending';
  const showPauseFooter = review.status === 'approved';
  const captures = [
    { id: 'front', title: 'Cédula frontal', src: review.frontImage, note: review.frontAnalysis?.notes },
    { id: 'back', title: 'Cédula reverso', src: review.backImage, note: review.backAnalysis?.notes },
    { id: 'selfie', title: 'Selfie biométrica', src: review.selfieImage, note: review.biometricResult?.notes },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className={`flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-4 ${showDecisionFooter || showPauseFooter ? 'pb-28' : 'pb-6'}`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la cola</span>
        </button>

        <article className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
              {review.selfieImage ? (
                <img src={review.selfieImage} alt={review.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  {review.fullName}
                </h1>
                <span className={`text-[11px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full whitespace-nowrap ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">{review.specialty}</p>
              <p className="text-[11px] text-slate-400 font-medium">Enviado {submittedLabel}</p>
            </div>
          </div>
        </article>

        <section className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Datos del registro</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] sm:text-xs">
            <div>
              <span className="text-slate-400 block">Cédula</span>
              <strong className="text-slate-800 font-mono">{review.idNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Especialidad</span>
              <strong className="text-slate-800">{review.specialty}</strong>
            </div>
            <div className="flex items-start gap-1.5 min-w-0">
              <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block">Correo</span>
                <strong className="text-slate-800 truncate block">{review.email}</strong>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block">Teléfono</span>
                <strong className="text-slate-800">{review.phone || '—'}</strong>
              </div>
            </div>
            <div className="sm:col-span-2 flex items-start gap-1.5 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block">Universidad / Institución</span>
                <strong className="text-slate-800">{review.institution}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Soportes enviados</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {captures.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                  {item.src && (
                    <button
                      type="button"
                      onClick={() => setPreview({ title: item.title, src: item.src as string })}
                      className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver
                    </button>
                  )}
                </div>
                <div className="h-36 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
                  {item.src ? (
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Sin captura</span>
                  )}
                </div>
                {item.note && <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{item.note}</p>}
              </div>
            ))}
          </div>
        </section>

        {review.biometricResult && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <ScanLine className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Validación biométrica</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] sm:text-xs">
              <div>
                <span className="text-slate-400 block">Coincidencia</span>
                <strong className="text-slate-800">{review.biometricResult.matchScore}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Prueba de vida</span>
                <strong className="text-violet-700">
                  {review.biometricResult.livenessVerified ? 'Verificada' : 'Pendiente'}
                </strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block">Estado</span>
                <strong className="text-amber-700">Pendiente de aprobación</strong>
              </div>
            </div>
          </section>
        )}
      </div>

      {(showDecisionFooter || showPauseFooter) && (
      <div className="sticky bottom-0 z-30 bg-slate-50/95 backdrop-blur-md pt-3 pb-3 border-t border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          {showDecisionFooter ? (
            <>
          <button
            type="button"
            onClick={onDeny}
            className="flex-1 min-h-[48px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            Negar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 min-h-[48px] rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmar
          </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onTogglePause}
              className={`w-full min-h-[48px] rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                review.isPaused
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {review.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {review.isPaused ? 'Reactivar perfil' : 'Pausar perfil'}
            </button>
          )}
        </div>
      </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-5 h-5 text-violet-600 shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm truncate">{preview.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Cerrar visor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 my-3 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-200">
              <img src={preview.src} alt={preview.title} className="max-h-[45vh] object-contain rounded-lg shadow-xs" />
            </div>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
            >
              Cerrar visor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
