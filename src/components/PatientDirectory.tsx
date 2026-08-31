import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  X,
  Building2,
  FileText,
  BadgeCheck,
  Activity,
  Stethoscope,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DoctorProfile } from '../types';
import { DoctorOnePager } from './DoctorOnePager';

interface PatientDirectoryProps {
  onOpenDoctorAuth?: () => void;
  doctors: DoctorProfile[];
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({ onOpenDoctorAuth, doctors }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('TODAS');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const scrollNavRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const specialties = [
    'TODAS',
    'Cirugía Plástica',
    'Cardiología',
    'Dermatología',
    'Pediatría',
    'Neurología',
    'Oftalmología',
    'Ginecología',
    'Ortopedia',
    'Medicina Interna',
    'Otorrinolaringología',
    'Endocrinología',
  ];

  const updateScrollButtons = () => {
    if (scrollNavRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollNavRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const navEl = scrollNavRef.current;
    if (navEl) {
      navEl.addEventListener('scroll', updateScrollButtons, { passive: true });
      window.addEventListener('resize', updateScrollButtons);
      return () => {
        navEl.removeEventListener('scroll', updateScrollButtons);
        window.removeEventListener('resize', updateScrollButtons);
      };
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollNavRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollNavRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const normalizeStr = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const visibleDoctors = doctors.filter((doc) => doc.verifiedStatus.rethus && !doc.isPaused);

  const filteredDoctors = visibleDoctors.filter((doc) => {
    const normQuery = normalizeStr(searchQuery);
    const matchesQuery =
      normalizeStr(doc.fullName).includes(normQuery) ||
      normalizeStr(doc.rethusCode).includes(normQuery) ||
      normalizeStr(doc.specialty).includes(normQuery) ||
      (doc.subspecialty && normalizeStr(doc.subspecialty).includes(normQuery)) ||
      normalizeStr(doc.location).includes(normQuery);

    const matchesSpecialty =
      selectedSpecialty === 'TODAS' ||
      normalizeStr(doc.specialty).includes(normalizeStr(selectedSpecialty));

    return matchesQuery && matchesSpecialty;
  });

  // If a doctor is selected, render the dedicated One-Pager view
  if (selectedDoctor) {
    return (
      <DoctorOnePager
        doctor={selectedDoctor}
        onBack={() => {
          setSelectedDoctor(null);
          setBookingSuccess(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Public Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* HealthBit Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-400 text-white flex items-center justify-center shadow-xs shadow-violet-200">
              <Activity className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div className="flex items-center leading-none">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Health<span className="text-violet-600">Bit</span>
              </span>
            </div>
          </div>

          {/* Doctor Portal Access Button */}
          {onOpenDoctorAuth && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenDoctorAuth}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all cursor-pointer group active:scale-95 shrink-0"
              >
                <Stethoscope className="w-4 h-4 text-violet-400 group-hover:text-white transition-colors shrink-0" />
                <span>
                  <span className="sm:hidden">Ingresar</span>
                  <span className="hidden sm:inline">¿Eres Médico? Iniciar Sesión / Registro</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Directory Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8 animate-fadeIn">
        {/* Search Header Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 relative overflow-hidden border border-slate-800">
          <div className="max-w-2xl space-y-3 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Encuentra y Verifica a tu Médico
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Todos los medicos registrados en HealthBit son verificados con el RETHUS.
            </p>
          </div>

          {/* Real-time Search Input Box */}
          <div className="relative z-10 bg-white rounded-2xl p-2 shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl border border-slate-200">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="w-5 h-5 text-violet-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busca por nombre, especialidad o cédula"
                className="w-full text-xs sm:text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            <button className="px-6 py-3 bg-violet-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-violet-700 shadow-md shadow-violet-600/20 transition-all cursor-pointer shrink-0">
              Buscar Médico
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Menu for Specialties */}
        <div className="relative bg-white/70 backdrop-blur-xs border border-slate-200/80 rounded-2xl p-1.5 sm:p-2 shadow-2xs overflow-hidden">
          {/* Left Scroll Navigation Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Desplazar a la izquierda"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-xl bg-white/95 text-slate-700 hover:text-violet-700 hover:bg-violet-50 border border-slate-200 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Left Fade Gradient Mask */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/80 to-transparent z-10 rounded-l-2xl pointer-events-none" />
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollNavRef}
            className="flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 scrollbar-none select-none"
          >
            {specialties.map((cat) => {
              const count =
                cat === 'TODAS'
                  ? visibleDoctors.length
                  : visibleDoctors.filter((d) =>
                      normalizeStr(d.specialty).includes(normalizeStr(cat))
                    ).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedSpecialty(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                    selectedSpecialty === cat
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      selectedSpecialty === cat
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Fade Gradient Mask */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white via-white/80 to-transparent z-10 rounded-r-2xl pointer-events-none" />
          )}

          {/* Right Scroll Navigation Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Desplazar a la derecha"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-xl bg-white/95 text-slate-700 hover:text-violet-700 hover:bg-violet-50 border border-slate-200 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Doctor Cards Grid or Empty State */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">No encontramos especialistas</h3>
              <p className="text-xs text-slate-500">
                Prueba buscando por otra especialidad o limpia los términos de búsqueda.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('TODAS');
              }}
              className="px-4 py-2 rounded-xl bg-violet-50 text-violet-700 font-bold text-xs hover:bg-violet-100 transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          /* Grid View (Current) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.fullName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/80 shadow-xs"
                      />
                      <div
                        className="absolute -bottom-1 -right-1 bg-violet-600 text-white p-1 rounded-full shadow-xs"
                        title="Verificado RETHUS"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                        {doc.fullName}
                      </h3>
                      <p className="text-xs font-semibold text-violet-600 truncate">{doc.specialty}</p>
                      <p className="text-[11px] font-mono text-slate-400">RETHUS: {doc.rethusCode}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{doc.biography}"
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                      <span className="truncate">{doc.institution}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-violet-600 text-slate-800 hover:text-white border border-slate-200 hover:border-violet-600 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BadgeCheck className="w-4 h-4 text-violet-600 group-hover:text-white" />
                  <span>Ver Expediente & Agendar</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
