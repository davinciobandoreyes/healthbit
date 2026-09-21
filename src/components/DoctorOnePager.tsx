import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  MessageCircle,
  UserCheck,
  Share2,
  Check,
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface DoctorOnePagerProps {
  doctor: DoctorProfile;
  onBack: () => void;
}

type ProfileTab = 'experiencia' | 'verificacion' | 'credenciales' | 'opiniones';

interface SuccessCase {
  id: string;
  patientName: string;
  procedure: string;
  rating: number;
  timeAgo: string;
  comment: string;
  imageUrl: string;
  category: string;
}

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
          className={`shrink-0 min-h-[44px] px-4 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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
  whatsAppLink: string;
  bookingType: 'presencial' | 'telemedicina';
  setBookingType: (value: 'presencial' | 'telemedicina') => void;
  bookingDate: string;
  setBookingDate: (value: string) => void;
  bookingTime: string;
  setBookingTime: (value: string) => void;
  patientName: string;
  setPatientName: (value: string) => void;
  patientPhone: string;
  setPatientPhone: (value: string) => void;
  patientEmail: string;
  setPatientEmail: (value: string) => void;
  consultReason: string;
  setConsultReason: (value: string) => void;
  isBooked: boolean;
  bookingRefCode: string;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}

const BookingPanel: React.FC<BookingPanelProps> = ({
  doctor,
  whatsAppLink,
  bookingType,
  setBookingType,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  patientName,
  setPatientName,
  patientPhone,
  setPatientPhone,
  patientEmail,
  setPatientEmail,
  consultReason,
  setConsultReason,
  isBooked,
  bookingRefCode,
  onSubmit,
  onReset,
}) => (
  <aside
    id="agendamiento"
    className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs scroll-mt-20"
  >
    <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Agendar cita</h2>

    <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
      <button
        type="button"
        onClick={() => setBookingType('presencial')}
        className={`flex-1 min-h-[44px] px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          bookingType === 'presencial'
            ? 'bg-white text-violet-700 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Presencial
      </button>
      <button
        type="button"
        onClick={() => setBookingType('telemedicina')}
        className={`flex-1 min-h-[44px] px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          bookingType === 'telemedicina'
            ? 'bg-white text-violet-700 shadow-2xs'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Telemedicina
      </button>
    </div>

    <div className="space-y-1.5 mb-5 pb-5 border-b border-slate-100">
      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
        Dirección
      </p>
      <div className="flex items-start gap-2 text-sm text-slate-700">
        <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">{doctor.institution}</p>
          <p className="text-xs text-slate-500">{doctor.location}</p>
        </div>
      </div>
    </div>

    {!isBooked ? (
      <form onSubmit={onSubmit} className="space-y-4">
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
          <label className="text-xs font-bold text-slate-700">Correo Electrónico</label>
          <input
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="paciente@correo.com"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Fecha Deseada</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Horario de Preferencia</label>
          <select
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            className={inputClass}
          >
            <option value="09:00 AM">09:00 AM (Mañana)</option>
            <option value="10:00 AM">10:00 AM (Mañana)</option>
            <option value="11:30 AM">11:30 AM (Mañana)</option>
            <option value="02:30 PM">02:30 PM (Tarde)</option>
            <option value="04:00 PM">04:00 PM (Tarde)</option>
            <option value="05:30 PM">05:30 PM (Tarde)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Motivo de Consulta</label>
          <select
            value={consultReason}
            onChange={(e) => setConsultReason(e.target.value)}
            className={inputClass}
          >
            <option value="Primera consulta de valoración">Primera consulta de valoración</option>
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
          <span>Agendar</span>
        </button>
      </form>
    ) : (
      <div className="bg-violet-50 border border-violet-200/80 rounded-2xl p-5 text-center space-y-3 animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900">Cita solicitada</h3>
          <p className="text-xs text-slate-600">
            {bookingDate} · {bookingTime} ·{' '}
            {bookingType === 'presencial' ? 'Presencial' : 'Telemedicina'}
          </p>
        </div>
        <div className="inline-block bg-white px-3 py-1.5 rounded-xl border border-violet-300 text-xs font-mono font-bold text-violet-900">
          {bookingRefCode}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          Programar otra cita
        </button>
      </div>
    )}

    <a
      href={whatsAppLink}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 w-full min-h-[44px] py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
    >
      <MessageCircle className="w-4 h-4 text-violet-600" />
      <span>Enviar mensaje por WhatsApp</span>
    </a>
    {doctor.phone && (
      <p className="mt-2 text-[11px] text-center text-slate-400">{doctor.phone}</p>
    )}
  </aside>
);

export const DoctorOnePager: React.FC<DoctorOnePagerProps> = ({ doctor, onBack }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('experiencia');
  const [openAccordion, setOpenAccordion] = useState<string | null>('rethus');
  const [previewDoc, setPreviewDoc] = useState<CredentialDoc | null>(null);
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(null);

  const [bookingType, setBookingType] = useState<'presencial' | 'telemedicina'>('presencial');
  const [bookingDate, setBookingDate] = useState('2026-08-25');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [consultReason, setConsultReason] = useState('Primera consulta de valoración');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRefCode, setBookingRefCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const successCases: SuccessCase[] = [
    {
      id: 'case-1',
      patientName: 'Laura Marcela R.',
      procedure: 'Rinoplastia Ultrasónica & Armonización',
      rating: 5,
      timeAgo: 'Hace 2 semanas',
      comment:
        'Excelente atención y resultados completamente naturales. El proceso de recuperación fue guiado paso a paso con máxima dedicación.',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      category: 'Facial',
    },
    {
      id: 'case-2',
      patientName: 'Carlos Eduardo V.',
      procedure: 'Perfiloplastia & Definición Mandibular',
      rating: 5,
      timeAgo: 'Hace 1 mes',
      comment:
        'Profesionalismo del más alto nivel. Su acreditación RETHUS y trayectoria me brindaron total tranquilidad durante todo el procedimiento.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      category: 'Estructural',
    },
    {
      id: 'case-3',
      patientName: 'Sofía Andrea M.',
      procedure: 'Blefaroplastia Estructural & Rejuvenecimiento',
      rating: 5,
      timeAgo: 'Hace 1 mes y medio',
      comment:
        'Increíble cambio sutil y armónico. La Dra. explica con toda claridad y calidez en cada consulta de valoración.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      category: 'Oculoplastia',
    },
  ];

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

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    const ref = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRefCode(ref);
    setIsBooked(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const whatsAppMessage = encodeURIComponent(
    `Hola Dr./Dra. ${doctor.fullName}, vi su perfil verificado en HealthBit y me gustaría consultar disponibilidad para una cita de valoración en ${doctor.specialty}.`
  );
  const cleanPhone = doctor.phone ? doctor.phone.replace(/[^0-9]/g, '') : '573124567890';
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppMessage}`;

  const bookingPanelProps: BookingPanelProps = {
    doctor,
    whatsAppLink,
    bookingType,
    setBookingType,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    patientName,
    setPatientName,
    patientPhone,
    setPatientPhone,
    patientEmail,
    setPatientEmail,
    consultReason,
    setConsultReason,
    isBooked,
    bookingRefCode,
    onSubmit: handleBookingSubmit,
    onReset: () => setIsBooked(false),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] pb-24 lg:pb-16">
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
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-violet-500">
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1.5 -right-1.5 bg-violet-600 text-white p-1.5 rounded-2xl border-2 border-white"
                    title="Especialista verificado RETHUS"
                  >
                    <ShieldCheck className="w-4 h-4 text-violet-200" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                      <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                      RETHUS: {doctor.rethusCode}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-[11px] font-bold whitespace-nowrap">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      {doctor.rating} ({doctor.reviewsCount || 142} opiniones)
                    </span>
                  </div>

                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {doctor.fullName}
                    </h1>
                    <p className="text-sm font-bold text-violet-700 mt-0.5">{doctor.specialty}</p>
                    {doctor.subspecialty && (
                      <p className="text-xs text-slate-500 font-medium">{doctor.subspecialty}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                    <span className="font-medium truncate">{doctor.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-5 mt-5 border-t border-slate-100">
                <a
                  href="#agendamiento"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar cita</span>
                </a>
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 font-bold text-sm transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-violet-600" />
                  <span>Enviar mensaje</span>
                </a>
              </div>
            </div>

            <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'experiencia' && (
              <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Sobre mí</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{doctor.biography}</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Especialista en</h3>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                      {doctor.specialty}
                    </li>
                    {doctor.subspecialty && (
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                        {doctor.subspecialty}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 min-h-[44px]">
                    <Building2 className="w-4 h-4 text-violet-600 shrink-0" />
                    <span className="font-medium truncate">{doctor.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5 min-h-[44px]">
                    <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                    <span className="font-medium truncate">{doctor.location}</span>
                  </div>
                </div>
              </section>
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

                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
                  <div>
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(openAccordion === 'rethus' ? null : 'rethus')}
                      className="w-full min-h-[44px] px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Registro RETHUS & Licencia Médica
                          </h3>
                          <p className="text-xs text-slate-500">
                            Código: {doctor.rethusCode} · MinSalud Colombia
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-violet-600" /> Vigente
                        </span>
                        {openAccordion === 'rethus' ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {openAccordion === 'rethus' && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 space-y-3 bg-slate-50/50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                            <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                              Número de Licencia
                            </span>
                            <span className="font-bold text-slate-900 text-xs">{doctor.rethusCode}</span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                            <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                              Estado Disciplinario
                            </span>
                            <span className="font-bold text-violet-700 text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-violet-600" /> Sin Sanciones
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                            <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                              Autoridad Certificadora
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                              MinSalud / Colegio Médico
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          La habilitación del especialista fue contrastada con la base de datos nacional
                          RETHUS. El profesional cuenta con facultades para ejercer su especialidad.
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(openAccordion === 'identity' ? null : 'identity')
                      }
                      className="w-full min-h-[44px] px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Identidad y biometría</h3>
                          <p className="text-xs text-slate-500">
                            Cédula {doctor.idNumber} validada
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-indigo-600" /> Verificado
                        </span>
                        {openAccordion === 'identity' ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {openAccordion === 'identity' && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 space-y-3 bg-slate-50/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 block">Documento verificado</span>
                              <span className="text-[11px] text-slate-500">
                                Frente y reverso autenticados
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 block">Prueba de vida facial</span>
                              <span className="text-[11px] text-slate-500">
                                Micro-movimientos y biometría activa
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(openAccordion === 'societies' ? null : 'societies')
                      }
                      className="w-full min-h-[44px] px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Sociedades científicas</h3>
                          <p className="text-xs text-slate-500">Afiliaciones y colegios de especialistas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-violet-600" /> Miembro activo
                        </span>
                        {openAccordion === 'societies' ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {openAccordion === 'societies' && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-600 space-y-2 bg-slate-50/50">
                        <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                          <span className="font-bold text-slate-900 block">
                            Sociedad Colombiana de Cirugía Plástica (SCCP) & FILACP
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Miembro de número con participación en congresos y cursos de actualización
                            quirúrgica.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'credenciales' && (
              <section className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Credenciales académicas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {credentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-violet-400 hover:shadow-md transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
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
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(cred)}
                        className="mt-4 w-full min-h-[44px] py-2 px-3 rounded-xl bg-slate-50 hover:bg-violet-600 text-slate-700 hover:text-white font-bold text-xs border border-slate-200/80 hover:border-violet-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Vista previa</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'opiniones' && (
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Opiniones de pacientes</h2>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                    {successCases.length} casos
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {successCases.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCase(item)}
                      className="text-left bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col cursor-pointer group"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.procedure}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 bg-violet-50 text-violet-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-violet-200/80 whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 flex-1">
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.procedure}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.patientName} · {item.timeAgo}
                        </p>
                        <div className="flex items-center gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-3">“{item.comment}”</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:sticky lg:top-20">
            <BookingPanel {...bookingPanelProps} />
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 p-3 pointer-events-none">
        <a
          href="#agendamiento"
          className="pointer-events-auto flex items-center justify-center gap-2 min-h-[44px] w-full px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/30 border border-violet-500/40 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar cita</span>
        </a>
      </div>

      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8 border border-slate-200/80">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-5 right-5 p-2 min-h-[44px] min-w-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Cerrar visor"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500">
                  {previewDoc.institution} · {previewDoc.year}
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 relative max-h-[380px] flex items-center justify-center">
              <img
                src={previewDoc.previewUrl}
                alt={previewDoc.title}
                className="w-full h-full object-cover max-h-[380px]"
              />
              <div className="absolute bottom-3 right-3 bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Documento oficial
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between gap-3">
                <span className="font-medium text-slate-500">Registro legal</span>
                <span className="font-mono font-bold text-slate-800">{previewDoc.folio}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="font-medium text-slate-500">Convalidación</span>
                <span className="font-bold text-violet-700 flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Aprobado
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-violet-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8 border border-slate-200/80">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-5 right-5 p-2 min-h-[44px] min-w-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Cerrar detalle"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 h-64">
              <img
                src={selectedCase.imageUrl}
                alt={selectedCase.procedure}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200/80 whitespace-nowrap">
                  {selectedCase.category}
                </span>
                <span className="text-xs text-slate-400">{selectedCase.timeAgo}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{selectedCase.procedure}</h3>
              <div className="flex items-center gap-1">
                {[...Array(selectedCase.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                “{selectedCase.comment}”
              </p>
              <p className="text-xs text-slate-400 text-right">— {selectedCase.patientName}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCase(null)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
