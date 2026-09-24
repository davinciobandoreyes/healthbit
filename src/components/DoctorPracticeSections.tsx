import React, { useMemo, useState } from 'react';
import { Calendar, MessageCircle, Star, X } from 'lucide-react';
import { AppointmentBooking, AppointmentStatus, PublicReview } from '../types';

type ReviewQueue = 'shown' | 'pending';
type ReviewSentiment = 'all' | 'positive' | 'negative';

const isNegativeReview = (rating: number) => rating <= 2;

export const DoctorOpinionesSection: React.FC<{
  reviews: PublicReview[];
  onToggleReview: (id: string, visible: boolean) => void;
  showPageTitle?: boolean;
}> = ({ reviews, onToggleReview, showPageTitle = true }) => {
  const [queue, setQueue] = useState<ReviewQueue>('shown');
  const [sentiment, setSentiment] = useState<ReviewSentiment>('all');

  const shownCount = reviews.filter((item) => item.visible).length;
  const pendingCount = reviews.filter((item) => !item.visible).length;

  const filtered = useMemo(() => {
    return reviews.filter((item) => {
      const inQueue = queue === 'shown' ? item.visible : !item.visible;
      if (!inQueue) return false;
      if (sentiment === 'positive') return !isNegativeReview(item.rating);
      if (sentiment === 'negative') return isNegativeReview(item.rating);
      return true;
    });
  }, [reviews, queue, sentiment]);

  return (
    <section className="space-y-4">
      {showPageTitle && (
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Opiniones</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Las nuevas llegan a Pendientes. Tú decides cuáles se ven en la ficha
          </p>
        </div>
      )}

      <nav
        aria-label="Cola de opiniones"
        className="flex items-center border-b border-slate-200/80"
      >
        {(
          [
            { id: 'shown' as const, label: 'Mostradas', count: shownCount },
            { id: 'pending' as const, label: 'Pendientes', count: pendingCount },
          ]
        ).map((tab) => {
          const active = queue === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setQueue(tab.id)}
              className={`relative shrink-0 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                active ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] whitespace-nowrap ${
                  active ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet-600" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
        {(
          [
            { id: 'all' as const, label: 'Todas' },
            { id: 'positive' as const, label: 'Positivas' },
            { id: 'negative' as const, label: 'Negativas' },
          ]
        ).map((pill) => {
          const active = sentiment === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSentiment(pill.id)}
              className={`shrink-0 inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            {reviews.length === 0
              ? 'Aún no hay opiniones.'
              : sentiment !== 'all'
                ? 'No hay opiniones con esos criterios.'
                : queue === 'pending'
                  ? 'No hay opiniones pendientes.'
                  : 'No hay opiniones en tu ficha.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((item) => (
              <li key={item.id} className="border border-slate-200/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{item.patientName}</p>
                    <p className="text-xs text-slate-500">
                      {item.rating} ★ · {item.timeAgo}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">“{item.comment}”</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleReview(item.id, queue === 'pending')}
                    className={`shrink-0 inline-flex items-center justify-center min-h-[44px] px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                      queue === 'pending'
                        ? 'bg-violet-600 hover:bg-violet-700 text-white'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    {queue === 'pending' ? 'Mostrar' : 'Ocultar'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

type AppointmentQueue = 'scheduled' | 'done' | 'unscheduled' | 'cancelled';
type AppointmentDateFilter = 'all' | 'today' | 'tomorrow' | 'week';

const localISODate = (offset = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const appointmentQueue = (item: AppointmentBooking, today: string): AppointmentQueue => {
  if (item.status === 'cancelled') return 'cancelled';
  if (!item.dateISO) return 'unscheduled';
  if (item.dateISO < today) return 'done';
  return 'scheduled';
};

const STATUS_COPY: Record<AppointmentStatus, string> = {
  pending_confirm: 'Pendiente por confirmar',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  pending_confirm: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  confirmed: 'bg-violet-50 text-violet-800 border border-violet-200/80',
  cancelled: 'bg-slate-100 text-slate-500',
};

const whatsAppDigits = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('57') ? digits : `57${digits}`;
};

const statusWhatsAppMessage = (item: AppointmentBooking, status: AppointmentStatus) => {
  const when = item.dateISO && item.time ? ` el ${item.dateISO} a las ${item.time}` : '';
  if (status === 'confirmed') {
    return `Hola ${item.patientName}, tu cita en HealthBit quedó confirmada${when}. Ref ${item.refCode}.`;
  }
  if (status === 'cancelled') {
    return `Hola ${item.patientName}, tu cita en HealthBit${when} fue cancelada. Ref ${item.refCode}.`;
  }
  return `Hola ${item.patientName}, tu solicitud de cita en HealthBit quedó pendiente por confirmar. Ref ${item.refCode}.`;
};

export const DoctorCitasSection: React.FC<{
  bookings: AppointmentBooking[];
  onUpdateBooking?: (id: string, patch: Partial<AppointmentBooking>) => void;
  title?: string;
}> = ({ bookings, onUpdateBooking, title = 'Citas' }) => {
  const today = localISODate(0);
  const tomorrow = localISODate(1);
  const weekEnd = localISODate(7);
  const [queue, setQueue] = useState<AppointmentQueue>('scheduled');
  const [dateFilter, setDateFilter] = useState<AppointmentDateFilter>('all');
  const [whatsappNotice, setWhatsappNotice] = useState<{ text: string; href: string } | null>(null);

  const counts = useMemo(() => {
    const next = { scheduled: 0, done: 0, unscheduled: 0, cancelled: 0 };
    bookings.forEach((item) => {
      next[appointmentQueue(item, today)] += 1;
    });
    return next;
  }, [bookings, today]);

  const filtered = useMemo(() => {
    return bookings
      .filter((item) => appointmentQueue(item, today) === queue)
      .filter((item) => {
        if (queue !== 'scheduled' || dateFilter === 'all') return true;
        if (!item.dateISO) return false;
        if (dateFilter === 'today') return item.dateISO === today;
        if (dateFilter === 'tomorrow') return item.dateISO === tomorrow;
        return item.dateISO >= today && item.dateISO <= weekEnd;
      })
      .sort((a, b) => `${a.dateISO}${a.time}`.localeCompare(`${b.dateISO}${b.time}`));
  }, [bookings, queue, dateFilter, today, tomorrow, weekEnd]);

  const notifyStatus = (item: AppointmentBooking, status: AppointmentStatus) => {
    onUpdateBooking?.(item.id, { status });
    const text = statusWhatsAppMessage({ ...item, status }, status);
    setWhatsappNotice({
      text: `Se avisó a ${item.patientName} por WhatsApp. En esta demo no se envía un mensaje real.`,
      href: `https://wa.me/${whatsAppDigits(item.patientPhone)}?text=${encodeURIComponent(text)}`,
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Confirma o cancela y el paciente recibe el aviso por WhatsApp
        </p>
      </div>

      <nav aria-label="Cola de citas" className="flex items-center border-b border-slate-200/80 overflow-x-auto scrollbar-none">
        {(
          [
            { id: 'scheduled' as const, label: 'Agendadas' },
            { id: 'done' as const, label: 'Realizadas' },
            { id: 'unscheduled' as const, label: 'Por agendar' },
            { id: 'cancelled' as const, label: 'Canceladas' },
          ]
        ).map((tab) => {
          const active = queue === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setQueue(tab.id)}
              className={`relative shrink-0 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                active ? 'text-violet-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] whitespace-nowrap ${
                  active ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {counts[tab.id]}
              </span>
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet-600" />}
            </button>
          );
        })}
      </nav>

      {queue === 'scheduled' && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
          {(
            [
              { id: 'all' as const, label: 'Todas' },
              { id: 'today' as const, label: 'Hoy' },
              { id: 'tomorrow' as const, label: 'Mañana' },
              { id: 'week' as const, label: 'Dentro de 7 días' },
            ]
          ).map((pill) => {
            const active = dateFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setDateFilter(pill.id)}
                className={`shrink-0 inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      )}

      {whatsappNotice && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#128C7E]/10 text-[#128C7E] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{whatsappNotice.text}</p>
              <a
                href={whatsappNotice.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] px-3 rounded-xl bg-[#128C7E] hover:bg-[#0e7a6e] text-white text-xs font-bold whitespace-nowrap"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setWhatsappNotice(null)}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Calendar className="w-5 h-5 text-violet-600" />
          {queue === 'scheduled'
            ? 'Citas agendadas'
            : queue === 'done'
              ? 'Citas realizadas'
              : queue === 'unscheduled'
                ? 'Pendientes por agendar'
                : 'Citas canceladas'}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            {bookings.length === 0 ? 'No hay reservas todavía.' : 'No hay citas con esos criterios.'}
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((item) => (
              <li key={item.id} className="border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{item.patientName}</p>
                    <p className="text-xs text-slate-500">
                      {item.dateISO && item.time
                        ? `${item.dateISO} · ${item.time} · ${item.reason}`
                        : item.reason}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400">{item.refCode}</p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_CLASS[item.status]}`}
                  >
                    {STATUS_COPY[item.status]}
                  </span>
                </div>
                {onUpdateBooking && (queue === 'scheduled' || queue === 'unscheduled') && (
                  <div className="flex flex-wrap items-center gap-2">
                    {queue === 'scheduled' && item.status === 'pending_confirm' && (
                      <button
                        type="button"
                        onClick={() => notifyStatus(item, 'confirmed')}
                        className="inline-flex items-center justify-center min-h-[44px] px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                      >
                        Confirmar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => notifyStatus(item, 'cancelled')}
                      className="inline-flex items-center justify-center min-h-[44px] px-3 rounded-xl bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export const DoctorCitaMobileSection: React.FC<{
  bookings: AppointmentBooking[];
  onUpdateBooking?: (id: string, patch: Partial<AppointmentBooking>) => void;
  reviews: PublicReview[];
  onToggleReview: (id: string, visible: boolean) => void;
}> = ({ bookings, onUpdateBooking, reviews, onToggleReview }) => (
  <div className="space-y-6">
    <DoctorCitasSection bookings={bookings} onUpdateBooking={onUpdateBooking} title="Cita" />
    <div className="space-y-4">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Star className="w-5 h-5 text-violet-600" /> Opiniones
      </h2>
      <DoctorOpinionesSection reviews={reviews} onToggleReview={onToggleReview} showPageTitle={false} />
    </div>
  </div>
);
