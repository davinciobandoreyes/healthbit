import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  MapPin,
  Building2,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  Award,
  FileText,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Clock,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Lock,
  UserCheck,
  Share2,
  Check,
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface DoctorOnePagerProps {
  doctor: DoctorProfile;
  onBack: () => void;
}

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

export const DoctorOnePager: React.FC<DoctorOnePagerProps> = ({ doctor, onBack }) => {
  // Accordion state for Verification section
  const [openAccordion, setOpenAccordion] = useState<string | null>('rethus');

  // Credential Preview Modal State (In-situ document viewer)
  const [previewDoc, setPreviewDoc] = useState<CredentialDoc | null>(null);

  // Selected Success Case for zoom/inspection
  const [selectedCase, setSelectedCase] = useState<SuccessCase | null>(null);

  // Booking Form State
  const [bookingType, setBookingType] = useState<'presencial' | 'telemedicina'>('presencial');
  const [bookingDate, setBookingDate] = useState('2026-08-25');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [consultReason, setConsultReason] = useState('Primera consulta de valoración');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRefCode, setBookingRefCode] = useState('');

  // Toast / copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Cases of success for the specialist
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

  // Official Medical Credentials
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      {/* Top Floating Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver al Directorio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Compartir expediente verificado"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
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

            <a
              href="#agendamiento"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8 animate-fadeIn">
        {/* HERO: Perfil del Doctor */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with Verified Ring */}
            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-3 border-violet-500 shadow-md shadow-violet-500/10">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-1.5 rounded-2xl shadow-md border-2 border-white flex items-center gap-1"
                title="Especialista Verificado RETHUS Nivel 4"
              >
                <ShieldCheck className="w-4 h-4 text-violet-200" />
              </div>
            </div>

            {/* Main Info */}
            <div className="space-y-3 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                  RETHUS: {doctor.rethusCode}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {doctor.rating} ({doctor.reviewsCount || 142} valoraciones)
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.fullName}
                </h1>
                <p className="text-sm sm:text-base font-bold text-violet-700 mt-0.5">
                  {doctor.specialty}
                </p>
                {doctor.subspecialty && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    {doctor.subspecialty}
                  </p>
                )}
              </div>

              {/* Concise Doctor Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {doctor.biography}
              </p>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 pt-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-violet-600 shrink-0" />
                  <span className="font-medium truncate">{doctor.institution}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                  <span className="font-medium truncate">{doctor.location}</span>
                </div>
              </div>

              {/* Quick Action Navigation Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <a
                  href="#agendamiento"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Cita</span>
                </a>

                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-violet-950 hover:bg-violet-900 text-violet-300 border border-violet-700/50 font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-violet-400" />
                  <span>WhatsApp Consultorio</span>
                </a>

                <a
                  href="#credenciales"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Ver Credenciales</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 1. SECCIÓN: VERIFICACIÓN OFICIAL (ACORDEÓN COMPACTO) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Verificación Oficial RETHUS & MinSalud
              </h2>
            </div>
            <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
              100% Autenticado
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
            {/* Accordion Item 1: RETHUS & Licencia */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setOpenAccordion(openAccordion === 'rethus' ? null : 'rethus')
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Registro RETHUS & Licencia Médica Habilitada
                    </h3>
                    <p className="text-xs text-slate-500">
                      Código Oficial: {doctor.rethusCode} • MinSalud Colombia
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-violet-600" /> Vigente y Activo
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
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                        Número de Licencia
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {doctor.rethusCode}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                        Estado Disciplinario
                      </span>
                      <span className="font-bold text-violet-700 text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-violet-600" /> Sin Sanciones
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                        Autoridad Certificadora
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        MinSalud / Colegio Médico
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    La habilitación del especialista fue contrastada en tiempo real con la base de datos nacional RETHUS. El profesional cuenta con plenas facultades para ejercer su especialidad.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion Item 2: Identidad y Biometría Facial */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setOpenAccordion(openAccordion === 'identity' ? null : 'identity')
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Identidad Ciudadana & Biometría Facial 3D
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cédula de Ciudadanía {doctor.idNumber} Validada
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> 99.8% Liveness Match
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
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">DNI Oficial Verificado</span>
                        <span className="text-[11px] text-slate-500">Frente y reverso autenticados</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Prueba de Vida Facial</span>
                        <span className="text-[11px] text-slate-500">Micro-movimientos y biometría activa</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion Item 3: Sociedades Médicas y Membresías */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setOpenAccordion(openAccordion === 'societies' ? null : 'societies')
                }
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Sociedades Científicas y Membresías Gremiales
                    </h3>
                    <p className="text-xs text-slate-500">
                      Afiliaciones gremiales y colegios de especialistas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-purple-600" /> Miembro Activo
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
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">
                      Sociedad Colombiana de Cirugía Plástica (SCCP) & FILACP
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Miembro de número con participación continua en congresos internacionales y cursos de actualización quirúrgica.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN: CREDENCIALES & DIPLOMAS (PREVIEW IN-SITU) */}
        <section id="credenciales" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Credenciales Académicas & Títulos
                </h2>
                <p className="text-xs text-slate-500">
                  Documentos oficiales digitalizados disponibles para preview inmediato
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-violet-400 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {cred.year}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-violet-700 transition-colors">
                      {cred.title}
                    </h3>
                    <p className="text-xs text-violet-600 font-semibold mt-0.5">
                      {cred.type}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {cred.institution}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {cred.folio}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(cred)}
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-violet-600 text-slate-700 hover:text-white font-bold text-xs border border-slate-200 hover:border-violet-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Vista Previa del Documento</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SECCIÓN: PACIENTES Y CASOS DE ÉXITO */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Pacientes y Casos de Éxito
                </h2>
                <p className="text-xs text-slate-500">
                  Fotografías y testimonios de procedimientos realizados
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {successCases.length} Casos Destacados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {successCases.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCase(item)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-violet-300 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.procedure}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-violet-950/80 text-violet-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-violet-500/30">
                      {item.category}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-xs font-bold block truncate">
                        {item.procedure}
                      </span>
                      <span className="text-[11px] text-slate-300 flex items-center gap-1">
                        Paciente: {item.patientName} • {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 italic">
                      "{item.comment}"
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 border-t border-slate-100 flex items-center justify-between text-xs text-violet-700 font-bold group-hover:text-violet-800">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Ver Detalle del Caso
                  </span>
                  <span className="text-slate-400">→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECCIÓN: AGENDAMIENTO & CONTACTO DIRECTO POR WHATSAPP */}
        <section id="agendamiento" className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Agendamiento de Citas & Contacto Directo
              </h2>
              <p className="text-xs text-slate-500">
                Reserva tu consulta oficial o comunícate directamente con el consultorio
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Online Booking Form (2 Columns) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              {!isBooked ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-violet-600" />
                      Solicitar Cita de Valoración
                    </h3>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setBookingType('presencial')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
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
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          bookingType === 'telemedicina'
                            ? 'bg-white text-violet-700 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Telemedicina
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Ej. Santiago Morales"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+57 300 000 0000"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Correo Electrónico</label>
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="paciente@correo.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Fecha Deseada</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Horario de Preferencia</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none"
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
                      <label className="font-bold text-slate-700">Motivo de Consulta</label>
                      <select
                        value={consultReason}
                        onChange={(e) => setConsultReason(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-violet-600 focus:outline-none"
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
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar</span>
                  </button>
                </form>
              ) : (
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-md shadow-violet-600/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      ¡Cita Médica Solicitada con Éxito!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Hemos registrado tu solicitud para el <strong>{bookingDate}</strong> a las{' '}
                      <strong>{bookingTime}</strong> en modalidad{' '}
                      <strong>{bookingType === 'presencial' ? 'Presencial' : 'Telemedicina'}</strong>.
                    </p>
                  </div>
                  <div className="inline-block bg-white px-4 py-2 rounded-xl border border-violet-300 text-xs font-mono font-bold text-violet-900">
                    Código de Reserva: {bookingRefCode}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsBooked(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Programar otra cita
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct WhatsApp & Contact Card (1 Column) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                  <MessageCircle className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-950/60 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                    Atención Inmediata
                  </span>
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    WhatsApp del Consultorio
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Comunícate directamente con la secretaría médica y el equipo de la Dra.{' '}
                    {doctor.fullName} para dudas previas, cotizaciones o agendamiento express.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Tiempo de respuesta: <strong>&lt; 15 minutos</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>Línea autenticada y cifrada</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-700/60">
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-violet-500 hover:bg-violet-400 active:scale-98 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950 text-violet-500" />
                  <span>Iniciar Chat en WhatsApp</span>
                </a>
                <p className="text-[10px] text-center text-slate-400">
                  Tel: {doctor.phone || '+57 (604) 448-9210'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CREDENTIAL PREVIEW MODAL (IN-SITU DOCUMENT VIEWER) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Cerrar visor"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {previewDoc.institution} • {previewDoc.year}
                </p>
              </div>
            </div>

            {/* Document Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative max-h-[380px] flex items-center justify-center shadow-inner">
              <img
                src={previewDoc.previewUrl}
                alt={previewDoc.title}
                className="w-full h-full object-cover max-h-[380px]"
              />
              <div className="absolute bottom-3 right-3 bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Documento Oficial Notariado
              </div>
            </div>

            {/* Verification Metadata Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">Registro Legal:</span>
                <span className="font-mono font-bold text-slate-800">{previewDoc.folio}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-500">Estado de Convalidación:</span>
                <span className="font-bold text-violet-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Aprobado & Auténtico
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-violet-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS CASE ZOOM MODAL */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Cerrar detalle"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64">
              <img
                src={selectedCase.imageUrl}
                alt={selectedCase.procedure}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
                  {selectedCase.category}
                </span>
                <span className="text-xs text-slate-400">{selectedCase.timeAgo}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900">
                {selectedCase.procedure}
              </h3>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(selectedCase.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                "{selectedCase.comment}"
              </p>

              <p className="text-xs text-slate-400 text-right">
                — {selectedCase.patientName} (Paciente Verificado)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCase(null)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
