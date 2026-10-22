import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  MapPin,
  Sparkles,
  Stethoscope,
  ArrowRight,
  ChevronLeft,
  ScanFace,
  PersonStanding,
  HeartPulse,
  Syringe,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { AppointmentBooking, DoctorProfile, PublicReview, RethusLookup } from '../types';
import { composeCardCity, composeCardPlace } from '../data/doctorPublic';
import { buildRethusLookup } from '../data/rethusLookup';
import { isPlasticSurgeonSpecialty, PLASTIC_PROCEDURE_GROUPS } from '../data/plasticProcedures';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  facial: ScanFace,
  corporal: PersonStanding,
  reconstructiva: HeartPulse,
  'no-quirurgico': Syringe,
};
import { DoctorOnePager } from './DoctorOnePager';
import { LegalPage, LegalPageId, SiteFooter } from './LegalPages';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const shortDoctorName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const hasPrefix = /^(Dr\.|Dra\.)$/i.test(parts[0] || '');
  const prefix = hasPrefix ? parts[0] : '';
  const names = hasPrefix ? parts.slice(1) : parts;
  const shown = [prefix, ...names.slice(0, 3)].filter(Boolean).join(' ');
  return { shown, truncated: names.length > 3 };
};

const catalogPills = (focusAreas: string[] | undefined) => {
  const selected = new Set(focusAreas || []);
  const groups: string[] = [];
  const items: string[] = [];
  for (const group of PLASTIC_PROCEDURE_GROUPS) {
    const matched = group.items.filter((item) => selected.has(item.label));
    if (matched.length === 0) continue;
    groups.push(group.label);
    items.push(...matched.map((item) => item.label));
  }
  return [...groups, ...items];
};

const SpecialtyMore: React.FC<{ items: string[] }> = ({ items }) => {
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const place = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setBox({ top: rect.bottom + 6, left: rect.left });
  };
  return (
    <span
      tabIndex={0}
      className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold cursor-default"
      onMouseEnter={(e) => place(e.currentTarget)}
      onMouseLeave={() => setBox(null)}
      onFocus={(e) => place(e.currentTarget)}
      onBlur={() => setBox(null)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      Ver más
      {box && (
        <span
          style={{ top: box.top, left: box.left }}
          className="fixed z-50 w-max max-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-md"
        >
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item} className="text-xs font-medium text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </span>
      )}
    </span>
  );
};

const doctorWhatsAppLink = (doc: DoctorProfile) => {
  const message = encodeURIComponent(
    `Hola Dr./Dra. ${doc.fullName}, vi su perfil verificado en Plasty y me gustaría agendar una cita presencial de valoración en ${doc.specialty}.`
  );
  const source = doc.whatsappPhone || doc.phone;
  const cleanPhone = source ? source.replace(/[^0-9]/g, '') : '573124567890';
  return `https://wa.me/${cleanPhone}?text=${message}`;
};

const LookupRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-3">
    <dt className="text-slate-500 shrink-0">{label}</dt>
    <dd className="font-medium text-slate-900 text-right">{value}</dd>
  </div>
);

const RethusSearchFeedback: React.FC<{
  phase: 'searching' | 'found';
  progress: number;
  name: string;
  outcome: RethusLookup['outcome'];
}> = ({ phase, progress, name, outcome }) => {
  const step =
    progress < 34 ? 'Consultando RETHUS' : progress < 67 ? 'Revisando habilitación' : 'Confirmando códigos';

  if (phase === 'found') {
    const scene =
      outcome === 'absent'
        ? {
            title: 'No aparece en RETHUS',
            border: 'border-slate-200/80',
            iconClass: 'bg-slate-100 text-slate-400',
            icon: <Search className="w-8 h-8" />,
            scan: true,
          }
        : outcome === 'not_enabled'
          ? {
              title: 'Aparece en RETHUS, no habilitado',
              border: 'border-amber-200',
              iconClass: 'rethus-to-amber',
              icon: <ShieldCheck className="w-8 h-8" />,
              scan: false,
            }
          : {
              title: 'Sí aparece en RETHUS',
              border: 'border-violet-200',
              iconClass: 'bg-violet-50 text-violet-600',
              icon: <ShieldCheck className="w-8 h-8" />,
              scan: false,
            };

    return (
      <section
        className={`bg-white border ${scene.border} rounded-3xl p-6 max-w-lg w-full mx-auto text-center space-y-3 rethus-pop`}
        aria-live="polite"
      >
        <div className={`relative mx-auto w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden ${scene.iconClass}`}>
          {scene.icon}
          {scene.scan && <span className="rethus-scan absolute left-2 right-2 h-0.5 bg-slate-400" />}
        </div>
        <h2 className="text-base font-bold text-slate-900">{scene.title}</h2>
        <p className="text-sm text-slate-600">{name}</p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-slate-200/80 rounded-3xl p-5 max-w-lg w-full mx-auto text-center space-y-3" aria-live="polite">
      <p className="text-sm font-bold text-slate-900">{step}</p>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-violet-600 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-slate-500">Consulta demo. No abre un perfil en Plasty.</p>
    </section>
  );
};

const RethusLookupPanel: React.FC<{ lookup: RethusLookup }> = ({ lookup }) => (
  <section className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 max-w-lg w-full mx-auto">
    <div className="space-y-2">
      <h2 className="font-bold text-base text-slate-900">{lookup.fullName}</h2>
      {lookup.outcome === 'absent' ? (
        <p className="text-xs text-slate-500">No aparece en RETHUS. Consulta demo. No tiene perfil en Plasty.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
              En RETHUS
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${
                lookup.enabled
                  ? 'bg-violet-50 text-violet-800 border-violet-200/80'
                  : 'bg-amber-50 text-amber-800 border-amber-200/80'
              }`}
            >
              {lookup.enabled ? 'Habilitado' : 'No habilitado'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {lookup.outcome === 'not_enabled'
              ? 'El registro existe y no tiene facultad para ejercer. Consulta demo. No tiene perfil en Plasty.'
              : 'Consulta demo. Esta persona está en RETHUS y no tiene perfil en Plasty.'}
          </p>
        </>
      )}
    </div>
    {lookup.outcome !== 'absent' && (
    <>
    <div className="space-y-1">
      <h3 className="text-xs font-bold text-slate-900">Códigos</h3>
      <dl className="grid grid-cols-1 gap-1 text-xs">
        <LookupRow label="Código RETHUS" value={lookup.rethusCode} />
        <LookupRow label="Código profesión" value={lookup.professionCode} />
      </dl>
    </div>
    <div className="space-y-1">
      <h3 className="text-xs font-bold text-slate-900">Formación</h3>
      <dl className="grid grid-cols-1 gap-1 text-xs">
        <LookupRow label="Profesión" value={lookup.formation.profession} />
        <LookupRow label="Tipo" value={lookup.formation.type} />
        <LookupRow label="Origen" value={lookup.formation.origin} />
        <LookupRow label="Entidad" value={lookup.formation.entity} />
        <LookupRow label="Acto" value={lookup.formation.act} />
      </dl>
    </div>
    <div className="space-y-1">
      <h3 className="text-xs font-bold text-slate-900">Prestación</h3>
      <dl className="grid grid-cols-1 gap-1 text-xs">
        <LookupRow label="Programa" value={lookup.benefit.program} />
        <LookupRow label="Lugar" value={lookup.benefit.place} />
        <LookupRow label="Entidad" value={lookup.benefit.entity} />
      </dl>
    </div>
    </>
    )}
  </section>
);

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
  const [searchDraft, setSearchDraft] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rethusLookups, setRethusLookups] = useState<Record<string, RethusLookup>>({});
  const [rethusRun, setRethusRun] = useState<{ key: string; phase: 'searching' | 'found' | 'ready'; progress: number } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('TODAS');
  const [selectedCity, setSelectedCity] = useState<string>('TODAS');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [legalPage, setLegalPage] = useState<LegalPageId | null>(null);

  const normalizeStr = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const visibleDoctors = doctors.filter(
    (doc) => doc.verifiedStatus.rethus && !doc.isPaused && isPlasticSurgeonSpecialty(doc.specialty)
  );

  const doctorOffersProcedure = (doc: DoctorProfile, procedureId: string) => {
    const procedure = PLASTIC_PROCEDURE_GROUPS.flatMap((group) => group.items).find((item) => item.id === procedureId);
    if (!procedure) return false;
    const needle = normalizeStr(procedure.label);
    const haystack = [
      doc.specialty,
      doc.subspecialty || '',
      doc.biography,
      ...(doc.focusAreas || []),
    ]
      .map(normalizeStr)
      .join(' ');
    return haystack.includes(needle);
  };

  const doctorMatchesQuery = (doc: DoctorProfile, normQuery: string) => {
    const matchesIdentity =
      normalizeStr(doc.fullName).includes(normQuery) ||
      normalizeStr(doc.rethusCode).includes(normQuery) ||
      normalizeStr(doc.specialty).includes(normQuery) ||
      Boolean(doc.subspecialty && normalizeStr(doc.subspecialty).includes(normQuery)) ||
      normalizeStr(doc.location).includes(normQuery) ||
      Boolean(doc.department && normalizeStr(doc.department).includes(normQuery)) ||
      normalizeStr(composeCardPlace(doc)).includes(normQuery);

    if (!normQuery) return matchesIdentity;

    const matchesCatalog = PLASTIC_PROCEDURE_GROUPS.some((group) => {
      if (normalizeStr(group.label).includes(normQuery)) {
        return group.items.some((procedure) => doctorOffersProcedure(doc, procedure.id));
      }
      return group.items.some(
        (procedure) =>
          normalizeStr(procedure.label).includes(normQuery) && doctorOffersProcedure(doc, procedure.id)
      );
    });

    return matchesIdentity || matchesCatalog;
  };

  const filteredDoctors = visibleDoctors.filter((doc) => {
    const normQuery = normalizeStr(searchQuery);
    const matchesQuery = doctorMatchesQuery(doc, normQuery);

    const activeGroup = PLASTIC_PROCEDURE_GROUPS.find((group) => group.id === selectedGroup);
    const matchesSpecialty =
      selectedSpecialty !== 'TODAS'
        ? doctorOffersProcedure(doc, selectedSpecialty)
        : !activeGroup || activeGroup.items.some((procedure) => doctorOffersProcedure(doc, procedure.id));

    const matchesCity =
      selectedCity === 'TODAS' || normalizeStr(composeCardCity(doc)) === normalizeStr(selectedCity);

    return matchesQuery && matchesSpecialty && matchesCity;
  });

  const cities = [
    'TODAS',
    ...Array.from(new Set(visibleDoctors.map(composeCardCity)))
      .filter((city): city is string => Boolean(city))
      .sort((a, b) => a.localeCompare(b, 'es')),
  ];

  const queryText = searchQuery.trim();
  const queryKey = normalizeStr(queryText);
  const matchesHealthBitQuery = (doc: DoctorProfile) => doctorMatchesQuery(doc, queryKey);

  const healthBitQueryMatch = queryKey.length > 0 && visibleDoctors.some(matchesHealthBitQuery);
  const queryIsCatalogTerm =
    queryKey.length > 0 &&
    PLASTIC_PROCEDURE_GROUPS.some(
      (group) =>
        normalizeStr(group.label).includes(queryKey) ||
        group.items.some((procedure) => normalizeStr(procedure.label).includes(queryKey))
    );
  const lookupEligible = queryText.length >= 3 && !healthBitQueryMatch && !queryIsCatalogTerm;
  const activeLookup = lookupEligible
    ? rethusLookups[queryKey] ?? buildRethusLookup(queryText)
    : null;

  useEffect(() => {
    if (!lookupEligible || rethusLookups[queryKey]) return;
    setRethusLookups((current) =>
      current[queryKey] ? current : { ...current, [queryKey]: buildRethusLookup(queryText) }
    );
  }, [lookupEligible, queryKey, queryText, rethusLookups]);

  useEffect(() => {
    if (!lookupEligible) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 400 : 2000;
    const started = performance.now();
    let frame = 0;
    setRethusRun({ key: queryKey, phase: 'searching', progress: 0 });
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - started) / duration);
      if (ratio < 1) {
        setRethusRun({ key: queryKey, phase: 'searching', progress: Math.round(ratio * 100) });
        frame = requestAnimationFrame(tick);
        return;
      }
      setRethusRun({ key: queryKey, phase: 'found', progress: 100 });
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lookupEligible, queryKey]);

  useEffect(() => {
    if (!rethusRun || rethusRun.phase !== 'found' || rethusRun.key !== queryKey) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(
      () => setRethusRun({ key: queryKey, phase: 'ready', progress: 100 }),
      reduceMotion ? 200 : 900
    );
    return () => window.clearTimeout(timer);
  }, [rethusRun, queryKey]);

  const returnHome = () => {
    setSearchDraft('');
    setSearchQuery('');
    setSelectedGroup(null);
    setSelectedSpecialty('TODAS');
    setSelectedCity('TODAS');
    setRethusRun(null);
  };

  const searchApplied = searchQuery.trim() !== '';
  const rethusRunMatches = Boolean(rethusRun && rethusRun.key === queryKey);
  const rethusReady = lookupEligible && rethusRunMatches && rethusRun?.phase === 'ready';
  const rethusSearching = lookupEligible && !rethusReady;
  const showCancel = searchApplied && !rethusSearching;

  const procedureCount = (procedureId: string) =>
    visibleDoctors.filter((doc) => doctorOffersProcedure(doc, procedureId)).length;

  const openGroup = PLASTIC_PROCEDURE_GROUPS.find((group) => group.id === selectedGroup) ?? null;

  const resultCount = filteredDoctors.length;

  const heroVisible = searchQuery.trim() === '' && selectedCity === 'TODAS';

  const searchForm = !lookupEligible ? (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSearchQuery(searchDraft);
      }}
    >
      <div className="flex items-center min-h-[44px] min-w-0 rounded-2xl bg-white border border-slate-200/80">
        <label className="shrink-0 border-r border-slate-200/80">
          <span className="sr-only">Ciudad</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="min-h-[44px] max-w-[9.5rem] sm:max-w-[12rem] bg-transparent pl-3 pr-2 text-xs font-bold text-slate-700 cursor-pointer outline-none"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === 'TODAS' ? 'Todas las ciudades' : city}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 items-center gap-2 min-w-0 pl-3 pr-1.5">
          <Search className="w-4 h-4 text-violet-600 shrink-0" />
          <span className="sr-only">Buscar médicos</span>
          <input
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Nombre, especialidad o cédula"
            className="w-full min-w-0 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
          {showCancel ? (
            <button
              type="button"
              onClick={returnHome}
              className="sm:hidden min-h-[32px] shrink-0 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="submit"
              disabled={rethusSearching}
              className="sm:hidden min-h-[32px] shrink-0 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buscar
            </button>
          )}
        </label>
      </div>
    </form>
  ) : null;

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
      <style>{`
        @keyframes rethus-pop { from { transform: scale(0.86); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes rethus-scan { from { top: 8px; opacity: 0.95; } to { top: 48px; opacity: 0; } }
        @keyframes rethus-amber { to { background-color: #fffbeb; color: #b45309; } }
        .rethus-pop { animation: rethus-pop 0.45s ease; }
        .rethus-scan { animation: rethus-scan 0.9s ease forwards; }
        .rethus-to-amber { background-color: #f5f3ff; color: #7c3aed; animation: rethus-pop 0.45s ease, rethus-amber 0.55s ease 0.35s forwards; }
        @media (prefers-reduced-motion: reduce) {
          .rethus-pop, .rethus-scan, .rethus-to-amber { animation: none; }
          .rethus-to-amber { background-color: #fffbeb; color: #b45309; }
        }
      `}</style>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-400 text-white flex items-center justify-center shadow-xs shadow-violet-200">
              <Sparkles className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              P<span className="text-violet-600">lasty</span>
            </span>
          </div>

          {onOpenDoctorAuth && (
            <button
              onClick={onOpenDoctorAuth}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3 sm:px-4 py-2 rounded-2xl bg-slate-900 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all cursor-pointer group active:scale-95 shrink-0"
            >
              <Stethoscope className="w-4 h-4 text-violet-400 group-hover:text-white transition-colors shrink-0" />
              <span>Ingresar</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform shrink-0 hidden sm:block" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4 animate-fadeIn">
        {legalPage ? (
          <LegalPage page={legalPage} onBack={() => setLegalPage(null)} />
        ) : (
        <>
        {heroVisible && (
          <section className="relative min-h-44 sm:min-h-52 border border-slate-200/80 rounded-3xl overflow-hidden">
            <img
              src="/hero-doctores-verificados.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/15" />
            <div className="relative flex min-h-44 sm:min-h-52 flex-col justify-center gap-3 px-4 py-4 sm:px-6 max-w-xl">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Encuentra cirujanos plásticos <span className="text-violet-300">verificados</span>
                </h1>
                <p className="text-sm text-slate-200">Especialistas con RETHUS y REPS revisados.</p>
              </div>
              {searchForm}
            </div>
          </section>
        )}

        {!heroVisible && searchApplied && (
          <button
            type="button"
            onClick={returnHome}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl text-violet-700 font-bold text-sm hover:bg-violet-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        )}

        {!heroVisible && searchForm}

        {!searchApplied && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedGroup(null);
                setSelectedSpecialty('TODAS');
              }}
              className={`min-h-[44px] w-full rounded-full border px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                !selectedGroup
                  ? 'border-violet-600 bg-violet-50 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 shrink-0 ${!selectedGroup ? 'text-violet-700' : 'text-violet-600'}`} />
              <span className="text-xs font-bold text-slate-900 leading-tight">Todas</span>
            </button>
            {PLASTIC_PROCEDURE_GROUPS.map((group) => {
              const active = selectedGroup === group.id;
              const Icon = CATEGORY_ICONS[group.id] ?? ScanFace;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(group.id);
                    setSelectedSpecialty('TODAS');
                  }}
                  className={`min-h-[44px] w-full rounded-full border px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    active
                      ? 'border-violet-600 bg-violet-50 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-violet-700' : 'text-violet-600'}`} />
                  <span className="text-xs font-bold text-slate-900 leading-tight text-left">{group.label}</span>
                </button>
              );
            })}
          </div>
          {openGroup && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              <button
                type="button"
                onClick={() => setSelectedSpecialty('TODAS')}
                className={`min-h-[44px] px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  selectedSpecialty === 'TODAS'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Toda la categoría
              </button>
              {openGroup.items.map((procedure) => {
                const count = procedureCount(procedure.id);
                const active = selectedSpecialty === procedure.id;
                return (
                  <button
                    key={procedure.id}
                    type="button"
                    onClick={() => setSelectedSpecialty(procedure.id)}
                    className={`min-h-[44px] px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
                      active
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{procedure.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        )}

        {!lookupEligible && (
        <p className="text-sm font-bold text-slate-900">
          {resultCount} {resultCount === 1 ? 'médico' : 'médicos'}
        </p>
        )}

        {lookupEligible && !rethusReady ? (
          <RethusSearchFeedback
            phase={rethusRunMatches && rethusRun?.phase === 'found' ? 'found' : 'searching'}
            progress={rethusRunMatches ? rethusRun?.progress ?? 0 : 0}
            name={queryText}
            outcome={activeLookup?.outcome ?? 'enabled'}
          />
        ) : activeLookup && rethusReady ? (
          <RethusLookupPanel lookup={activeLookup} />
        ) : resultCount === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-800">No encontramos especialistas</h2>
              <p className="text-xs text-slate-500">
                Prueba con otro procedimiento o ciudad, o limpia los términos de búsqueda.
              </p>
            </div>
            <button
              onClick={returnHome}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-violet-50 text-violet-700 font-bold text-xs hover:bg-violet-100 transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fadeIn">
            {filteredDoctors.map((doc) => {
              const name = shortDoctorName(doc.fullName);
              const specialties = catalogPills(doc.focusAreas);
              return (
              <article
                key={doc.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedDoctor(doc)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDoctor(doc);
                  }
                }}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 cursor-pointer text-left"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatarUrl}
                    alt=""
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-violet-500/80 shadow-xs shrink-0"
                  />
                  <div className="space-y-2 overflow-hidden min-w-0 flex-1">
                    <h2
                      className="relative font-bold text-lg text-slate-900 truncate group/name"
                      title={name.truncated ? doc.fullName : undefined}
                    >
                      {name.shown}
                      {name.truncated && (
                        <span className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden max-w-xs rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-md group-hover/name:block">
                          {doc.fullName}
                        </span>
                      )}
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {specialties.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold"
                        >
                          {item}
                        </span>
                      ))}
                      {specialties.length > 3 && <SpecialtyMore items={specialties} />}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
                        <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                        RETHUS
                      </span>
                      {doc.publicLayout === 'landing' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap">
                          Landing
                        </span>
                      )}
                      {doc.repsReviewStatus === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
                          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                          REPS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-violet-600 shrink-0" />
                  <span className="truncate">{composeCardPlace(doc)}</span>
                </div>
                <a
                  href={doctorWhatsAppLink(doc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Escríbeme a ${doc.fullName}`}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="min-h-[44px] w-full rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-all inline-flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#128C7E]" />
                  Escríbeme
                </a>
              </article>
              );
            })}
          </div>
        )}
        </>
        )}
      </main>
      <SiteFooter onOpen={setLegalPage} />
    </div>
  );
};
