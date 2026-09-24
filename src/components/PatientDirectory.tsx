import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  MapPin,
  Activity,
  Stethoscope,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AppointmentBooking, DoctorProfile, PublicReview } from '../types';
import { composeCardCity, composeCardPlace } from '../data/doctorPublic';
import { DoctorOnePager } from './DoctorOnePager';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const doctorWhatsAppLink = (doc: DoctorProfile) => {
  const message = encodeURIComponent(
    `Hola Dr./Dra. ${doc.fullName}, vi su perfil verificado en HealthBit y me gustaría agendar una cita presencial de valoración en ${doc.specialty}.`
  );
  const source = doc.whatsappPhone || doc.phone;
  const cleanPhone = source ? source.replace(/[^0-9]/g, '') : '573124567890';
  return `https://wa.me/${cleanPhone}?text=${message}`;
};

interface PatientDirectoryProps {
  onOpenDoctorAuth?: () => void;
  doctors: DoctorProfile[];
  reviews: PublicReview[];
  onAddReview: (review: PublicReview) => void;
  bookings: AppointmentBooking[];
  onAddBooking: (booking: AppointmentBooking) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  onOpenDoctorAuth,
  doctors,
  reviews,
  onAddReview,
  bookings,
  onAddBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('TODAS');
  const [selectedCity, setSelectedCity] = useState<string>('TODAS');
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
      normalizeStr(doc.location).includes(normQuery) ||
      (doc.department && normalizeStr(doc.department).includes(normQuery)) ||
      normalizeStr(composeCardPlace(doc)).includes(normQuery);

    const matchesSpecialty =
      selectedSpecialty === 'TODAS' ||
      normalizeStr(doc.specialty).includes(normalizeStr(selectedSpecialty));

    const matchesCity =
      selectedCity === 'TODAS' || normalizeStr(composeCardCity(doc)) === normalizeStr(selectedCity);

    return matchesQuery && matchesSpecialty && matchesCity;
  });

  const cities = [
    'TODAS',
    ...Array.from(new Set(visibleDoctors.map(composeCardCity)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'es')),
  ];

  // If a doctor is selected, render the dedicated One-Pager view
  if (selectedDoctor) {
    return (
      <DoctorOnePager
        doctor={selectedDoctor}
        onBack={() => {
          setSelectedDoctor(null);
          setBookingSuccess(false);
        }}
        reviews={reviews.filter(
          (item) => item.doctorEmail.trim().toLowerCase() === selectedDoctor.email.trim().toLowerCase()
        )}
        onAddReview={onAddReview}
        bookings={bookings.filter(
          (item) => item.doctorEmail.trim().toLowerCase() === selectedDoctor.email.trim().toLowerCase()
        )}
        onAddBooking={onAddBooking}
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
                className="inline-flex items-center gap-1.5 sm:gap-2 min-h-[44px] px-3 sm:px-4 py-2 rounded-2xl bg-slate-900 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all cursor-pointer group active:scale-95 shrink-0"
              >
                <Stethoscope className="w-4 h-4 text-violet-400 group-hover:text-white transition-colors shrink-0" />
                <span>Ingresar</span>
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
              Encuentra medicos verificados
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Todos los medicos registrados en HealthBit son verificados con el RETHUS y también en REPS.
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
              Buscar
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

        <div className="flex flex-wrap items-center gap-2">
          {cities.map((city) => {
            const count =
              city === 'TODAS'
                ? visibleDoctors.length
                : visibleDoctors.filter((doc) => normalizeStr(composeCardCity(doc)) === normalizeStr(city))
                    .length;

            return (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                  selectedCity === city
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{city === 'TODAS' ? 'Todas las ciudades' : city}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCity === city ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
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
                Prueba con otra ciudad o especialidad, o limpia los términos de búsqueda.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('TODAS');
                setSelectedCity('TODAS');
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
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/80 shadow-xs shrink-0"
                    />

                    <div className="space-y-1.5 overflow-hidden min-w-0">
                      <h3 className="font-bold text-base text-slate-900 truncate">{doc.fullName}</h3>
                      <p className="text-xs font-semibold text-violet-600 truncate">{doc.specialty}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
                          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                          RETHUS
                        </span>
                        {doc.repsReviewStatus === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
                            <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                            REPS
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                    <span className="truncate">{composeCardPlace(doc)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(doc)}
                    className="min-h-[44px] px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    Ver doctor
                  </button>
                  <a
                    href={doctorWhatsAppLink(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#128C7E] shrink-0" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
