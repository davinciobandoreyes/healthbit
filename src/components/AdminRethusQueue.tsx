import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Mail,
  X,
  Eye,
  Clock,
  CheckCircle2,
  Ban,
  Pause,
  Play,
} from 'lucide-react';
import { PendingRethusReview, RethusReviewStatus } from '../types';
import { AdminReviewOnePager } from './AdminReviewOnePager';

interface AdminRethusQueueProps {
  reviews: PendingRethusReview[];
  mailNotice: string | null;
  onClearMailNotice: () => void;
  onConfirm: (review: PendingRethusReview) => void;
  onDeny: (review: PendingRethusReview) => void;
  onTogglePause: (review: PendingRethusReview, paused: boolean) => void;
  onLogout: () => void;
}

const STATUS_FILTERS: { id: RethusReviewStatus; label: string; icon: typeof Clock }[] = [
  { id: 'pending', label: 'Pendientes', icon: Clock },
  { id: 'approved', label: 'Aceptadas', icon: CheckCircle2 },
  { id: 'denied', label: 'Negadas', icon: Ban },
];

const statusBadge = (review: PendingRethusReview) => {
  if (review.status === 'approved' && review.isPaused) {
    return { label: 'Pausado', className: 'text-amber-700 bg-amber-50 border-amber-200/80' };
  }
  if (review.status === 'approved') {
    return { label: 'Aceptada', className: 'text-violet-700 bg-violet-50 border-violet-200/80' };
  }
  if (review.status === 'denied') {
    return { label: 'Negada', className: 'text-slate-600 bg-slate-100 border-slate-200/80' };
  }
  return { label: 'Pendiente', className: 'text-amber-700 bg-amber-50 border-amber-200/80' };
};

export const AdminRethusQueue: React.FC<AdminRethusQueueProps> = ({
  reviews,
  mailNotice,
  onClearMailNotice,
  onConfirm,
  onDeny,
  onTogglePause,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RethusReviewStatus>('pending');
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    review: PendingRethusReview;
    action: 'approve' | 'deny' | 'pause' | 'unpause';
  } | null>(null);

  const normalizeStr = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const counts = {
    pending: reviews.filter((item) => item.status === 'pending').length,
    approved: reviews.filter((item) => item.status === 'approved').length,
    denied: reviews.filter((item) => item.status === 'denied').length,
  };

  const filtered = reviews.filter((item) => {
    if (item.status !== statusFilter) return false;
    const q = normalizeStr(searchQuery);
    if (!q) return true;
    return (
      normalizeStr(item.fullName).includes(q) ||
      normalizeStr(item.idNumber).includes(q) ||
      normalizeStr(item.email).includes(q) ||
      normalizeStr(item.specialty).includes(q)
    );
  });

  const selectedReview = selectedReviewId
    ? reviews.find((item) => item.id === selectedReviewId) || null
    : null;

  const emptyCopy =
    statusFilter === 'pending'
      ? {
          title: 'No hay solicitudes pendientes.',
          body: 'Aparecerán aquí cuando un médico termine su registro en esta sesión.',
        }
      : statusFilter === 'approved'
        ? {
            title: 'No hay solicitudes aceptadas.',
            body: 'Las que apruebes se listan aquí. Desde ahí puedes pausar o reactivar el perfil.',
          }
        : {
            title: 'No hay solicitudes negadas.',
            body: 'Las que niegues quedarán en este visor para consulta.',
          };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
              Health<span className="text-violet-600">Bit</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
              Super admin
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {selectedReview ? (
        <AdminReviewOnePager
          review={selectedReview}
          onBack={() => setSelectedReviewId(null)}
          onConfirm={() => setPendingAction({ review: selectedReview, action: 'approve' })}
          onDeny={() => setPendingAction({ review: selectedReview, action: 'deny' })}
          onTogglePause={() =>
            setPendingAction({
              review: selectedReview,
              action: selectedReview.isPaused ? 'unpause' : 'pause',
            })
          }
        />
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Revisión RETHUS
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Filtra pendientes, aceptadas y negadas. En aceptadas puedes pausar un perfil para que no salga en el buscador.
            </p>
          </div>

          {mailNotice && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{mailNotice}</p>
              </div>
              <button
                type="button"
                onClick={onClearMailNotice}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Cerrar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busca por nombre, cédula o correo"
              className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-3.5 py-3 text-sm text-slate-800 focus:border-violet-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {STATUS_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const active = statusFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap min-h-[44px] cursor-pointer ${
                    active
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {filter.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {counts[filter.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-xs">
              <p className="text-sm font-bold text-slate-800">{emptyCopy.title}</p>
              <p className="text-xs text-slate-500 mt-1">{emptyCopy.body}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filtered.map((review) => {
                const badge = statusBadge(review);
                return (
                  <article
                    key={review.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{review.fullName}</h3>
                        <p className="text-[11px] text-slate-500 truncate">{review.specialty}</p>
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full whitespace-nowrap ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-[11px] border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-400 block">Cédula</span>
                        <strong className="text-slate-800 font-mono">{review.idNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Correo</span>
                        <strong className="text-slate-800 truncate block">{review.email}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedReviewId(review.id)}
                        className="flex-1 min-h-[44px] rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        Ver expediente
                      </button>
                      {review.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() =>
                            setPendingAction({
                              review,
                              action: review.isPaused ? 'unpause' : 'pause',
                            })
                          }
                          className="flex-1 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {review.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          {review.isPaused ? 'Reactivar' : 'Pausar'}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      )}

      {pendingAction && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPendingAction(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
          >
            <button
              type="button"
              onClick={() => setPendingAction(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 id="admin-confirm-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pr-8">
                {pendingAction.action === 'approve'
                  ? 'Confirmar RETHUS'
                  : pendingAction.action === 'deny'
                    ? 'Negar RETHUS'
                    : pendingAction.action === 'pause'
                      ? 'Pausar perfil'
                      : 'Reactivar perfil'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pendingAction.action === 'approve'
                ? `¿Confirmas aprobar a ${pendingAction.review.fullName}? Aparecerá en el buscador y se le avisará por correo (demo).`
                : pendingAction.action === 'deny'
                  ? `¿Confirmas negar a ${pendingAction.review.fullName}? No aparecerá en el buscador de pacientes.`
                  : pendingAction.action === 'pause'
                    ? `¿Pausar a ${pendingAction.review.fullName}? Dejará de aparecer en el buscador hasta que lo reactives.`
                    : `¿Reactivar a ${pendingAction.review.fullName}? Volverá a aparecer en el buscador de pacientes.`}
            </p>
            <div className="flex flex-col gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  if (pendingAction.action === 'approve') onConfirm(pendingAction.review);
                  else if (pendingAction.action === 'deny') onDeny(pendingAction.review);
                  else onTogglePause(pendingAction.review, pendingAction.action === 'pause');
                  setPendingAction(null);
                  if (pendingAction.action === 'approve' || pendingAction.action === 'deny') {
                    setSelectedReviewId(null);
                  }
                }}
                className="w-full min-h-[48px] rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
              >
                {pendingAction.action === 'approve'
                  ? 'Sí, confirmar'
                  : pendingAction.action === 'deny'
                    ? 'Sí, negar'
                    : pendingAction.action === 'pause'
                      ? 'Sí, pausar'
                      : 'Sí, reactivar'}
              </button>
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="w-full min-h-[44px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
