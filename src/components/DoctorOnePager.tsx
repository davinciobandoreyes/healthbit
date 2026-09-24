import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  Award,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  Share2,
  Check,
  Search,
  Plus,
} from 'lucide-react';
import { AppointmentBooking, DoctorProfile, PublicReview, WeekdayKey } from '../types';
import { SheetPopover } from './SheetPopover';
import {
  composeFocusAreas,
  composeLocation,
  weekdayFromISO,
  isTimeInRange,
  defaultWeeklyAvailability,
} from '../data/doctorPublic';

interface DoctorOnePagerProps {
  doctor: DoctorProfile;
  onBack: () => void;
  reviews: PublicReview[];
  onAddReview: (review: PublicReview) => void;
  bookings: AppointmentBooking[];
  onAddBooking: (booking: AppointmentBooking) => void;
}

type ProfileTab = 'experiencia' | 'verificacion' | 'credenciales' | 'opiniones';
type VerificationKind = 'rethus' | 'identity' | 'societies';

type ReviewFilter = 'all' | 'positive' | 'negative';

const DEMO_REVIEWER = 'Santiago Morales';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const StarRow: React.FC<{
  rating: number;
  size?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
}> = ({ rating, size = 'w-3.5 h-3.5', interactive = false, onChange }) => (
  <div className={`flex items-center gap-0.5 ${interactive ? 'gap-1' : ''}`}>
    {[1, 2, 3, 4, 5].map((value) => {
      const filled = value <= rating;
      const cls = `${size} ${filled ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`;
      if (!interactive) {
        return <Star key={value} className={cls} />;
      }
      return (
        <button
          key={value}
          type="button"
          onClick={() => onChange?.(value)}
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer"
          aria-label={`${value} estrellas`}
        >
          <Star className={`w-6 h-6 ${filled ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`} />
        </button>
      );
    })}
  </div>
);

interface CredentialDoc {
  id: string;
  title: string;
  type: string;
  institution: string;
  year: string;
  folio: string;
  previewUrl: string;
}

const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'verificacion', label: 'Verificación' },
  { id: 'credenciales', label: 'Credenciales' },
  { id: 'opiniones', label: 'Opiniones' },
];

const inputClass =
  'w-full min-h-[44px] bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none';

const WEEKDAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;
const SLOT_TIMES = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
] as const;

const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const startOfWeekMonday = (d: Date): Date => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
};

const addDays = (d: Date, n: number): Date => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
};

const todayISO = (): string => toISODate(new Date());

const isSlotTaken = (iso: string, time: string): boolean => {
  let h = 2166136261;
  for (const c of `${iso}:${time}`) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 5 === 0;
};

const isPastDay = (iso: string): boolean => iso < todayISO();

const isPastSlot = (iso: string, time: string): boolean => {
  const now = todayISO();
  if (iso > now) return false;
  if (iso < now) return true;
  const [hh, mm] = time.split(':').map(Number);
  const current = new Date();
  return hh < current.getHours() || (hh === current.getHours() && mm <= current.getMinutes());
};

const formatSelectedSlot = (iso: string, time: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = WEEKDAY_SHORT[date.getDay() - 1] ?? WEEKDAY_SHORT[0];
  return `${weekday} ${d} ${MONTHS_SHORT[m - 1]} · ${time}`;
};

const firstBookableISO = (): string => {
  let cursor = new Date();
  for (let i = 0; i < 8; i += 1) {
    const iso = toISODate(cursor);
    const sunday = cursor.getDay() === 0;
    if (!sunday && !isPastDay(iso)) return iso;
    cursor = addDays(cursor, 1);
  }
  return toISODate(new Date());
};

const ProfileTabs: React.FC<{
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}> = ({ activeTab, onChange }) => (
  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
    {PROFILE_TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`shrink-0 inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            tab.id === 'opiniones' ? 'hidden sm:inline-flex' : ''
          } ${
            isActive
              ? 'bg-violet-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

interface BookingPanelProps {
  doctor: DoctorProfile;
  bookings: AppointmentBooking[];
  onAddBooking: (booking: AppointmentBooking) => void;
}

const BookingPanel: React.FC<BookingPanelProps> = ({ doctor, bookings, onAddBooking }) => {
  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState(firstBookableISO);
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [consultReason, setConsultReason] = useState('Primera consulta de valoración');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRefCode, setBookingRefCode] = useState('');

  const currentWeekStart = startOfWeekMonday(new Date());
  const canGoPrev = weekStart.getTime() > currentWeekStart.getTime();
  const canGoNext = addDays(weekStart, 7).getTime() <= addDays(currentWeekStart, 56).getTime();

  const availability = doctor.weeklyAvailability || defaultWeeklyAvailability();

  const weekDays = useMemo(
    () => WEEKDAY_SHORT.map((label, i) => {
      const date = addDays(weekStart, i);
      const iso = toISODate(date);
      const weekday = weekdayFromISO(iso);
      const closed = weekday === 'sun' || !availability[weekday as WeekdayKey]?.enabled;
      return { label, date, iso, disabled: isPastDay(iso) || closed };
    }),
    [weekStart, availability]
  );

  const weekLabel = useMemo(() => {
    const start = weekDays[0].date;
    const end = weekDays[5].date;
    const sameMonth = start.getMonth() === end.getMonth();
    if (sameMonth) {
      return `${start.getDate()}–${end.getDate()} ${MONTHS_SHORT[start.getMonth()]}`;
    }
    return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;
  }, [weekDays]);

  const remainingSlots = useMemo(() => {
    const weekday = weekdayFromISO(selectedDate);
    if (weekday === 'sun') return [];
    const day = availability[weekday];
    if (!day?.enabled) return [];
    return SLOT_TIMES.filter(
      (time) => !isPastSlot(selectedDate, time) && isTimeInRange(time, day.start, day.end)
    );
  }, [selectedDate, availability]);

  const handleSelectDay = (iso: string, disabled: boolean) => {
    if (disabled) return;
    setSelectedDate(iso);
    setSelectedTime('');
  };

  const handleSelectTime = (time: string, unavailable: boolean) => {
    if (unavailable) return;
    setSelectedTime(time);
  };

  const isOccupied = (iso: string, time: string) =>
    isSlotTaken(iso, time) ||
    bookings.some(
      (item) => item.status !== 'cancelled' && item.dateISO === iso && item.time === time
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !patientName.trim() || !patientPhone.trim()) return;
    const ref = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
    onAddBooking({
      id: `bk-${Date.now()}`,
      doctorEmail: doctor.email,
      refCode: ref,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      dateISO: selectedDate,
      time: selectedTime,
      reason: consultReason,
      createdAt: toISODate(new Date()),
      status: 'pending_confirm',
    });
    setBookingRefCode(ref);
    setIsBooked(true);
  };

  const handleReset = () => {
    setIsBooked(false);
    setSelectedTime('');
    setPatientName('');
    setPatientPhone('');
  };

  return (
    <aside
      id="agendamiento"
      className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs scroll-mt-20"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Agendar cita</h2>
        <span className="inline-flex items-center min-h-[28px] px-2.5 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
          Visita presencial
        </span>
      </div>

      <div className="space-y-1.5 mb-5 pb-5 border-b border-slate-100">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
          Dirección
        </p>
        <div className="flex items-start gap-2 text-sm text-slate-700">
          <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{doctor.institution}</p>
            <p className="text-xs text-slate-500">{composeLocation(doctor)}</p>
          </div>
        </div>
      </div>

      {isBooked ? (
        <div className="bg-violet-50 border border-violet-200/80 rounded-2xl p-5 text-center space-y-3 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-900">Cita solicitada</h3>
            <p className="text-xs text-slate-600">
              {formatSelectedSlot(selectedDate, selectedTime)} · Presencial
            </p>
          </div>
          <div className="inline-block bg-white px-3 py-1.5 rounded-xl border border-violet-300 text-xs font-mono font-bold text-violet-900">
            {bookingRefCode}
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Programar otra cita
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => canGoPrev && setWeekStart(addDays(weekStart, -7))}
              disabled={!canGoPrev}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-xs font-bold text-slate-700 whitespace-nowrap">{weekLabel}</p>
            <button
              type="button"
              onClick={() => canGoNext && setWeekStart(addDays(weekStart, 7))}
              disabled={!canGoNext}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:hover:bg-slate-50 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Semana siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {weekDays.map((day) => {
              const isSelected = selectedDate === day.iso;
              return (
                <button
                  key={day.iso}
                  type="button"
                  disabled={day.disabled}
                  onClick={() => handleSelectDay(day.iso, day.disabled)}
                  className={`flex flex-col items-center justify-center min-h-[52px] rounded-xl text-[10px] font-bold transition-all ${
                    day.disabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : isSelected
                        ? 'bg-violet-600 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-50 text-slate-700 hover:bg-violet-50 cursor-pointer'
                  }`}
                >
                  <span className="uppercase tracking-wide">{day.label}</span>
                  <span className="text-sm">{day.date.getDate()}</span>
                </button>
              );
            })}
          </div>

          {remainingSlots.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              No hay horarios disponibles este día
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-0.5">
              {remainingSlots.map((time) => {
                const unavailable = isOccupied(selectedDate, time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={unavailable}
                    onClick={() => handleSelectTime(time, unavailable)}
                    className={`min-h-[44px] rounded-xl text-xs font-bold transition-all ${
                      unavailable
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                        : isSelected
                          ? 'bg-violet-600 text-white shadow-xs cursor-pointer'
                          : 'bg-white text-slate-700 border border-slate-200/80 hover:border-violet-400 hover:text-violet-700 cursor-pointer'
                    }`}
                  >
                    {unavailable ? '—' : time}
                  </button>
                );
              })}
            </div>
          )}

          {selectedTime ? (
            <div className="space-y-4 pt-1 border-t border-slate-100">
              <p className="text-xs font-semibold text-violet-700">
                {formatSelectedSlot(selectedDate, selectedTime)}
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ej. Santiago Morales"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Motivo de Consulta</label>
                <select
                  value={consultReason}
                  onChange={(e) => setConsultReason(e.target.value)}
                  className={inputClass}
                >
                  <option value="Primera consulta de valoración">
                    Primera consulta de valoración
                  </option>
                  <option value="Revisión de procedimiento quirúrgico">
                    Revisión de procedimiento quirúrgico
                  </option>
                  <option value="Segunda opinión médica certificada">
                    Segunda opinión médica certificada
                  </option>
                  <option value="Control post-operatorio">Control post-operatorio</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirmar cita</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center">Elige un horario disponible</p>
          )}
        </form>
      )}
    </aside>
  );
};

const ReviewsSection: React.FC<{
  reviews: PublicReview[];
  filteredReviews: PublicReview[];
  reviewQuery: string;
  onQueryChange: (value: string) => void;
  reviewFilter: ReviewFilter;
  onFilterChange: (value: ReviewFilter) => void;
  onAddReview: () => void;
}> = ({
  reviews,
  filteredReviews,
  reviewQuery,
  onQueryChange,
  reviewFilter,
  onFilterChange,
  onAddReview,
}) => (
  <section className="space-y-4 pb-20 sm:pb-0">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Opiniones de pacientes</h2>
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{reviews.length}</span>
      </div>
      <button
        type="button"
        onClick={onAddReview}
        className="hidden sm:inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-xs cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Añadir opinión</span>
      </button>
    </div>

    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          value={reviewQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por nombre o palabra"
          className={`${inputClass} pl-9`}
        />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {(
          [
            { id: 'all', label: 'Todas' },
            { id: 'positive', label: 'Positivas' },
            { id: 'negative', label: 'Negativas' },
          ] as const
        ).map((pill) => {
          const active = reviewFilter === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onFilterChange(pill.id)}
              className={`shrink-0 min-h-[44px] px-4 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
    </div>

    {filteredReviews.length === 0 ? (
      <p className="text-sm text-slate-500 bg-white border border-slate-200/80 rounded-2xl p-5">
        No hay opiniones con esos criterios
      </p>
    ) : (
      <ul className="space-y-3">
        {filteredReviews.map((item) => (
          <li key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{item.patientName}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-800 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200/80 whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3 text-violet-600" />
                Cita verificada
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <StarRow rating={item.rating} />
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.timeAgo}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">“{item.comment}”</p>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export const DoctorOnePager: React.FC<DoctorOnePagerProps> = ({
  doctor,
  onBack,
  reviews,
  onAddReview,
  bookings,
  onAddBooking,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('experiencia');
  const [verificationDetail, setVerificationDetail] = useState<VerificationKind | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CredentialDoc | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [reviewQuery, setReviewQuery] = useState('');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const publicLocation = composeLocation(doctor);
  const [newLocation, setNewLocation] = useState(publicLocation);
  const focusAreas = composeFocusAreas(doctor);

  const [copiedLink, setCopiedLink] = useState(false);

  const visibleReviews = useMemo(() => reviews.filter((item) => item.visible), [reviews]);

  const filteredReviews = useMemo(() => {
    const q = reviewQuery.trim().toLowerCase();
    return visibleReviews.filter((review) => {
      const matchesFilter =
        reviewFilter === 'all' ||
        (reviewFilter === 'positive' && review.rating >= 3) ||
        (reviewFilter === 'negative' && review.rating <= 2);
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        review.patientName.toLowerCase().includes(q) ||
        review.comment.toLowerCase().includes(q) ||
        review.location.toLowerCase().includes(q)
      );
    });
  }, [visibleReviews, reviewQuery, reviewFilter]);

  const credentials: CredentialDoc[] = [
    {
      id: 'cred-1',
      title: 'Título Profesional de Médico Cirujano',
      type: 'Diploma Universitario Oficial',
      institution: doctor.institution || 'Universidad de Antioquia',
      year: '2016',
      folio: 'Libro 42, Folio 189 - Registro SNIES 1042',
      previewUrl:
        doctor.diplomaUrl ||
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=900',
    },
    {
      id: 'cred-2',
      title: `Especialidad Médica en ${doctor.specialty}`,
      type: 'Título de Postgrado Clínico-Quirúrgico',
      institution: 'Facultad de Medicina • Posgrados de Salud',
      year: '2021',
      folio: 'Acta No. 3409 / Acreditación de Alta Calidad',
      previewUrl:
        'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=900',
    },
    {
      id: 'cred-3',
      title: 'Acta de Grado & Certificación Notarial',
      type: 'Documento Legal Autenticado',
      institution: 'Secretaría de Salud y Protección Social',
      year: '2021',
      folio: 'Ref: RTH-FOL-2021-9921',
      previewUrl:
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=900',
    },
  ];

  const verificationItems = [
    {
      id: 'rethus' as const,
      title: 'Registro RETHUS',
      summary: doctor.rethusCode,
      badge: 'Vigente',
      Icon: ShieldCheck,
      iconClass: 'bg-violet-50 text-violet-700',
      badgeClass: 'bg-violet-50 text-violet-800 border-violet-200/80',
      rows: [
        { label: 'Número de licencia', value: doctor.rethusCode },
        { label: 'Estado disciplinario', value: 'Sin sanciones' },
        { label: 'Autoridad certificadora', value: 'MinSalud / Colegio Médico' },
      ],
      footnote:
        'La habilitación del especialista fue contrastada con la base de datos nacional RETHUS. El profesional cuenta con facultades para ejercer su especialidad.',
    },
    {
      id: 'identity' as const,
      title: 'Identidad y biometría',
      summary: `Cédula ${doctor.idNumber}`,
      badge: 'Verificado',
      Icon: UserCheck,
      iconClass: 'bg-indigo-50 text-indigo-700',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      rows: [
        { label: 'Cédula', value: doctor.idNumber },
        { label: 'Documento', value: 'Frente y reverso autenticados' },
        { label: 'Prueba de vida', value: 'Micro-movimientos y biometría activa' },
      ],
      footnote: 'Identidad ciudadana contrastada con documento oficial y prueba de vida facial.',
    },
    {
      id: 'societies' as const,
      title: 'Sociedades científicas',
      summary: 'SCCP / FILACP',
      badge: 'Miembro activo',
      Icon: Award,
      iconClass: 'bg-violet-50 text-violet-700',
      badgeClass: 'bg-violet-50 text-violet-800 border-violet-200/80',
      rows: [
        { label: 'Sociedad', value: 'SCCP & FILACP' },
        { label: 'Estado', value: 'Miembro de número' },
      ],
      footnote:
        'Miembro de número con participación en congresos y cursos de actualización quirúrgica.',
    },
  ];

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const sync = () => {
      if (media.matches && activeTab === 'opiniones') setActiveTab('experiencia');
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [activeTab]);

  useEffect(() => {
    if (!verificationDetail && !previewDoc && !isAddingReview && !isBookingOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setVerificationDetail(null);
      setPreviewDoc(null);
      setIsAddingReview(false);
      setIsBookingOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [verificationDetail, previewDoc, isAddingReview, isBookingOpen]);

  const activeVerification = verificationItems.find((item) => item.id === verificationDetail) ?? null;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddReview({
      id: `rev-${Date.now()}`,
      doctorEmail: doctor.email,
      patientName: DEMO_REVIEWER,
      location: newLocation.trim() || publicLocation,
      rating: newRating,
      timeAgo: 'Hace un momento',
      comment: newComment.trim(),
      visible: false,
    });
    setNewComment('');
    setNewRating(5);
    setNewLocation(publicLocation);
    setIsAddingReview(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const whatsAppMessage = encodeURIComponent(
    `Hola Dr./Dra. ${doctor.fullName}, vi su perfil verificado en HealthBit y me gustaría agendar una cita presencial de valoración en ${doctor.specialty}.`
  );
  const whatsappSource = doctor.whatsappPhone || doctor.phone;
  const cleanPhone = whatsappSource ? whatsappSource.replace(/[^0-9]/g, '') : '573124567890';
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppMessage}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 min-h-[44px] text-xs sm:text-sm font-bold text-slate-700 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver al Directorio</span>
          </button>

          <button
            onClick={handleCopyLink}
            title="Compartir expediente verificado"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-violet-700 font-bold">¡Enlace Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Compartir</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 space-y-5 animate-fadeIn">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-violet-700 font-medium cursor-pointer whitespace-nowrap"
          >
            Directorio
          </button>
          <span className="text-slate-300">/</span>
          <span className="whitespace-nowrap truncate max-w-[40%]">{doctor.specialty}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold whitespace-nowrap truncate">{doctor.fullName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 lg:gap-6 items-start">
          <div className="space-y-5 min-w-0">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-xs">
              <div className="grid grid-cols-2 gap-3 items-start md:grid-cols-[auto_minmax(0,1fr)] md:gap-5">
                <div className="flex flex-col items-start gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-violet-500">
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 md:-bottom-1.5 md:-right-1.5 bg-violet-600 text-white p-1 md:p-1.5 rounded-xl md:rounded-2xl border-2 border-white"
                      title="Especialista verificado RETHUS"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet-200" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 md:hidden">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3 text-violet-600" />
                      {doctor.rethusCode}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[10px] font-bold whitespace-nowrap">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {doctor.rating} ({doctor.reviewsCount || 142})
                    </span>
                  </div>
                </div>

                <div className="min-w-0 text-left space-y-1.5 md:space-y-2.5">
                  <h1 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    {doctor.fullName}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-violet-700">{doctor.specialty}</p>
                  {focusAreas[1] && (
                    <p className="hidden md:block text-xs text-slate-500 font-medium line-clamp-2">
                      {focusAreas.slice(1).join(' · ')}
                    </p>
                  )}
                  <div className="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600 shrink-0 mt-0.5" />
                    <span className="font-medium line-clamp-2">{publicLocation}</span>
                  </div>
                  <div className="hidden md:flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                      <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                      {doctor.rethusCode}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {doctor.rating} ({doctor.reviewsCount || 142})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationDetail(null);
                    setPreviewDoc(null);
                    setIsBookingOpen(true);
                  }}
                  className="lg:hidden inline-flex w-full items-center justify-center gap-2 min-h-[44px] px-3 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar</span>
                </button>
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full md:w-1/2 items-center justify-center gap-2 min-h-[44px] px-3 sm:px-5 py-2.5 rounded-2xl bg-[#128C7E] hover:bg-[#0e7a6e] text-white font-bold text-sm shadow-sm border border-[#0a5c52] transition-all cursor-pointer active:scale-95 lg:col-start-2"
                >
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">Escríbenos</span>
                </a>
              </div>
            </div>

            <ProfileTabs
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setVerificationDetail(null);
                setPreviewDoc(null);
              }}
            />

            {activeTab === 'experiencia' && (
              <div className="space-y-5">
                <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Sobre mí</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{doctor.biography}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Especialista en</h3>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                    {focusAreas.map((area) => (
                      <li key={area} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                        {area}
                      </li>
                    ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 min-h-[44px]">
                      <Building2 className="w-4 h-4 text-violet-600 shrink-0" />
                      <span className="font-medium truncate">{doctor.institution}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 min-h-[44px]">
                      <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                      <span className="font-medium truncate">{publicLocation}</span>
                    </div>
                  </div>
                </section>

                <div className="sm:hidden">
                  <ReviewsSection
                    reviews={visibleReviews}
                    filteredReviews={filteredReviews}
                    reviewQuery={reviewQuery}
                    onQueryChange={setReviewQuery}
                    reviewFilter={reviewFilter}
                    onFilterChange={setReviewFilter}
                    onAddReview={() => {
                      setNewLocation(publicLocation);
                      setIsAddingReview(true);
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'verificacion' && (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Verificación RETHUS & MinSalud
                  </h2>
                  <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200/80 whitespace-nowrap">
                    Autenticado
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {verificationItems.map((item) => {
                    const open = verificationDetail === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-expanded={open}
                        aria-haspopup="dialog"
                        onClick={() => setVerificationDetail(item.id)}
                        className={`text-left w-full bg-white border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:border-violet-400 hover:shadow-md transition-all cursor-pointer min-h-[44px] ${
                          open ? 'border-violet-500 shadow-md' : 'border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconClass}`}
                          >
                            <item.Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${item.badgeClass}`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {item.badge}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 truncate">{item.summary}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === 'credenciales' && (
              <section className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Credenciales académicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {credentials.map((cred) => {
                    const open = previewDoc?.id === cred.id;
                    return (
                      <button
                        key={cred.id}
                        type="button"
                        aria-expanded={open}
                        aria-haspopup="dialog"
                        onClick={() => setPreviewDoc(cred)}
                        className={`text-left w-full bg-white border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:border-violet-400 hover:shadow-md transition-all cursor-pointer min-h-[44px] group ${
                          open ? 'border-violet-500 shadow-md' : 'border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {cred.year}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-700 transition-colors">
                            {cred.title}
                          </h3>
                          <p className="text-xs text-violet-600 font-semibold mt-0.5">{cred.type}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{cred.institution}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{cred.folio}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {activeTab === 'opiniones' && (
              <div className="hidden sm:block">
                <ReviewsSection
                  reviews={visibleReviews}
                  filteredReviews={filteredReviews}
                  reviewQuery={reviewQuery}
                  onQueryChange={setReviewQuery}
                  reviewFilter={reviewFilter}
                  onFilterChange={setReviewFilter}
                  onAddReview={() => {
                    setNewLocation(publicLocation);
                    setIsAddingReview(true);
                  }}
                />
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:sticky lg:top-20">
            <BookingPanel doctor={doctor} bookings={bookings} onAddBooking={onAddBooking} />
          </div>
        </div>
      </div>

      {activeTab === 'experiencia' && !isAddingReview && (
        <button
          type="button"
          onClick={() => {
            setNewLocation(publicLocation);
            setIsAddingReview(true);
          }}
          className="sm:hidden fixed bottom-5 right-5 z-40 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-xl shadow-violet-950/25 cursor-pointer active:scale-95"
        >
          + Reseña
        </button>
      )}

      {isBookingOpen && (
        <SheetPopover
          titleId="booking-popover-title"
          title="Agendar cita"
          closeLabel="Cerrar agenda"
          hiddenOnDesktop
          onClose={() => setIsBookingOpen(false)}
        >
          <BookingPanel doctor={doctor} bookings={bookings} onAddBooking={onAddBooking} />
        </SheetPopover>
      )}

      {activeVerification && (
        <SheetPopover
          titleId="verification-detail-title"
          title={activeVerification.title}
          closeLabel="Cerrar verificación"
          onClose={() => setVerificationDetail(null)}
        >
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeVerification.iconClass}`}
              >
                <activeVerification.Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-900">{activeVerification.title}</h3>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${activeVerification.badgeClass}`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {activeVerification.badge}
                </span>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              {activeVerification.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-3 items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 pt-0.5">
                    {row.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900 text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeVerification.footnote}
            </p>
          </div>
        </SheetPopover>
      )}

      {previewDoc && (
        <SheetPopover
          titleId="credential-detail-title"
          title={previewDoc.title}
          closeLabel="Cerrar credencial"
          onClose={() => setPreviewDoc(null)}
        >
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-base text-slate-900">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {previewDoc.institution} · {previewDoc.year}
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative max-h-56 flex items-center justify-center">
              <img
                src={previewDoc.previewUrl}
                alt={previewDoc.title}
                className="w-full h-full object-cover max-h-56"
              />
              <div className="absolute bottom-2 right-2 bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Documento oficial
              </div>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between gap-3">
                <span className="font-medium text-slate-500">Registro legal</span>
                <span className="font-mono font-bold text-slate-800 text-right">{previewDoc.folio}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="font-medium text-slate-500">Convalidación</span>
                <span className="font-bold text-violet-700 flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Aprobado
                </span>
              </div>
            </div>
          </div>
        </SheetPopover>
      )}

      {isAddingReview && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-xs p-8 sm:p-4 animate-fadeIn overflow-y-auto"
          onClick={() => setIsAddingReview(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative border border-slate-200/80"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-review-title"
          >
            <button
              onClick={() => setIsAddingReview(false)}
              className="absolute top-5 right-5 p-2 min-h-[44px] min-w-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="pr-10 space-y-2">
              <h3 id="add-review-title" className="font-extrabold text-base text-slate-900">
                Añadir opinión
              </h3>
              <p className="inline-flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-violet-800 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200/80">
                <CheckCircle2 className="w-3 h-3 text-violet-600" />
                Publicas como {DEMO_REVIEWER} · paciente registrado
              </p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Calificación</label>
                <StarRow
                  rating={newRating}
                  interactive
                  onChange={setNewRating}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Sede de la cita</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tu opinión *</label>
                <textarea
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  placeholder="Cuéntanos cómo fue la consulta"
                  className={`${inputClass} min-h-[96px] resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Publicar opinión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
