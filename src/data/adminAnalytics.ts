export const ANALYTICS_CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga'] as const;

export type AnalyticsCityName = (typeof ANALYTICS_CITIES)[number];
export type AnalyticsCityFilter = 'TODAS' | AnalyticsCityName;
export type AnalyticsPeriod = 7 | 30 | 90;

export interface FunnelStep {
  id: string;
  label: string;
  count: number;
  /** People who left between the previous step and this one. */
  lost: number;
  /** Share of the previous step that left. Null on the first step. */
  lostRate: number | null;
  /** Bar length: this step as a share of the first step. */
  shareOfStart: number;
  isLargestDrop: boolean;
}

export interface Kpi {
  id: string;
  label: string;
  value: number;
  previous: number;
  /** Relative change vs the previous window. Null when the previous window is 0. */
  delta: number | null;
  format: 'count' | 'percent';
}

export interface VisitPoint {
  date: string;
  label: string;
  visits: number;
}

export interface RankedAction {
  id: string;
  label: string;
  count: number;
  share: number;
}

export interface AnalyticsReading {
  fromLabel: string;
  toLabel: string;
  lost: number;
  lostRate: number;
  tightestCity: AnalyticsCityName | null;
  visitsPerDoctor: number;
}

export interface CityRow {
  city: AnalyticsCityName;
  visits: number;
  profiles: number;
  bookings: number;
  conversion: number;
  verifiedDoctors: number;
  visitsPerDoctor: number;
}

export interface AnalyticsSnapshot {
  kpis: Kpi[];
  reading: AnalyticsReading | null;
  patientFunnel: FunnelStep[];
  doctorFunnel: FunnelStep[];
  degreeSkipped: number;
  visits: VisitPoint[];
  patientActions: RankedAction[];
  registrationActions: RankedAction[];
  cities: CityRow[];
  rethus: {
    approvalRate: number;
    previousApprovalRate: number;
    medianDays: number;
    previousMedianDays: number;
    paused: number;
  };
  empty: boolean;
}

interface DaySlice {
  date: string;
  city: AnalyticsCityName;
  visits: number;
  searchOrFilter: number;
  profiles: number;
  intent: number;
  bookings: number;
  regStart: number;
  regAccount: number;
  regRethus: number;
  regReps: number;
  regId: number;
  regSelfie: number;
  regComplete: number;
  degreeSkipped: number;
  actionSearch: number;
  actionCity: number;
  actionSpecialty: number;
  actionWhatsapp: number;
  actionAgenda: number;
  rethusSubmitted: number;
  rethusApproved: number;
  queueDays: number[];
}

const CITY_WEIGHT: Record<AnalyticsCityName, number> = {
  Bogotá: 1,
  Medellín: 0.72,
  Cali: 0.48,
  Barranquilla: 0.31,
  Bucaramanga: 0.22,
};

const VERIFIED_DOCTORS: Record<AnalyticsCityName, number> = {
  Bogotá: 18,
  Medellín: 11,
  Cali: 7,
  Barranquilla: 4,
  Bucaramanga: 3,
};

const PAUSED_PROFILES: Record<AnalyticsCityName, number> = {
  Bogotá: 2,
  Medellín: 1,
  Cali: 1,
  Barranquilla: 0,
  Bucaramanga: 0,
};

const HISTORY_DAYS = 180;

const hash = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const clampStep = (previous: number, ratio: number, jitter: number) => {
  const next = Math.round(previous * (ratio + (jitter - 0.5) * 0.06));
  return Math.max(0, Math.min(previous, next));
};

const formatDayLabel = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }).replace('.', '');
};

const buildHistory = (): DaySlice[] => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const rows: DaySlice[] = [];

  for (let dayIndex = 0; dayIndex < HISTORY_DAYS; dayIndex += 1) {
    const date = new Date(end);
    date.setDate(end.getDate() - (HISTORY_DAYS - 1 - dayIndex));
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const weekday = date.getDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.62 : 1;

    ANALYTICS_CITIES.forEach((city, cityIndex) => {
      const seed = dayIndex * 17 + cityIndex * 131;
      const wave = 0.86 + hash(seed) * 0.28;
      const visits = Math.max(8, Math.round(380 * CITY_WEIGHT[city] * weekend * wave));
      const searchOrFilter = clampStep(visits, 0.64, hash(seed + 1));
      const profiles = clampStep(searchOrFilter, 0.66, hash(seed + 2));
      const intent = clampStep(profiles, 0.46, hash(seed + 3));
      const bookings = clampStep(intent, 0.38, hash(seed + 4));
      const regStart = Math.max(1, Math.round(visits * (0.045 + hash(seed + 5) * 0.02)));
      const regAccount = clampStep(regStart, 0.78, hash(seed + 6));
      const regRethus = clampStep(regAccount, 0.72, hash(seed + 7));
      const regReps = clampStep(regRethus, 0.9, hash(seed + 8));
      const regId = clampStep(regReps, 0.84, hash(seed + 9));
      const regSelfie = clampStep(regId, 0.91, hash(seed + 10));
      const regComplete = clampStep(regSelfie, 0.95, hash(seed + 11));
      const degreeSkipped = Math.min(regComplete, Math.round(regComplete * (0.32 + hash(seed + 12) * 0.08)));
      const rethusSubmitted = regRethus;
      const rethusApproved = clampStep(rethusSubmitted, 0.81, hash(seed + 13));
      const queueDays = Array.from({ length: rethusSubmitted }, (_, reviewIndex) =>
        Math.max(1, Math.round(1 + hash(seed + 40 + reviewIndex) * 6)),
      );

      rows.push({
        date: iso,
        city,
        visits,
        searchOrFilter,
        profiles,
        intent,
        bookings,
        regStart,
        regAccount,
        regRethus,
        regReps,
        regId,
        regSelfie,
        regComplete,
        degreeSkipped,
        actionSearch: Math.round(searchOrFilter * (0.72 + hash(seed + 14) * 0.08)),
        actionCity: Math.round(searchOrFilter * (0.41 + hash(seed + 15) * 0.08)),
        actionSpecialty: Math.round(searchOrFilter * (0.54 + hash(seed + 16) * 0.08)),
        actionWhatsapp: Math.round(intent * (0.58 + hash(seed + 17) * 0.08)),
        actionAgenda: Math.round(intent * (0.64 + hash(seed + 18) * 0.08)),
        rethusSubmitted,
        rethusApproved,
        queueDays,
      });
    });
  }

  return rows;
};

const HISTORY = buildHistory();

const sum = (rows: DaySlice[], key: keyof DaySlice) =>
  rows.reduce((total, row) => total + (row[key] as number), 0);

const median = (values: number[]) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const withDrops = (steps: { id: string; label: string; count: number }[]): FunnelStep[] => {
  const start = steps[0]?.count || 1;
  const enriched = steps.map((step, index) => {
    const previous = index === 0 ? null : steps[index - 1].count;
    const lost = previous === null ? 0 : Math.max(0, previous - step.count);
    const lostRate = previous === null || previous === 0 ? null : lost / previous;
    return {
      ...step,
      lost,
      lostRate,
      shareOfStart: step.count / start,
      isLargestDrop: false,
    };
  });
  let largest = -1;
  enriched.forEach((step, index) => {
    if (step.lostRate === null) return;
    if (largest === -1 || step.lostRate > (enriched[largest].lostRate ?? 0)) largest = index;
  });
  if (largest >= 0) enriched[largest].isLargestDrop = true;
  return enriched;
};

const rankActions = (items: { id: string; label: string; count: number }[]): RankedAction[] => {
  const sorted = [...items].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count ?? 0;
  return sorted.map((item) => ({ ...item, share: max === 0 ? 0 : item.count / max }));
};

const windowRows = (period: AnalyticsPeriod, city: AnalyticsCityFilter, offsetPeriods: number) => {
  const dates = [...new Set(HISTORY.map((row) => row.date))];
  const end = dates.length - offsetPeriods * period;
  const start = end - period;
  const selected = new Set(dates.slice(Math.max(0, start), Math.max(0, end)));
  return HISTORY.filter((row) => selected.has(row.date) && (city === 'TODAS' || row.city === city));
};

const kpi = (id: string, label: string, value: number, previous: number, format: Kpi['format']): Kpi => ({
  id,
  label,
  value,
  previous,
  delta: previous === 0 ? null : (value - previous) / previous,
  format,
});

export const getAnalytics = (period: AnalyticsPeriod, city: AnalyticsCityFilter): AnalyticsSnapshot => {
  const current = windowRows(period, city, 0);
  const previous = windowRows(period, city, 1);
  const visits = sum(current, 'visits');
  const prevVisits = sum(previous, 'visits');
  const profiles = sum(current, 'profiles');
  const prevProfiles = sum(previous, 'profiles');
  const bookings = sum(current, 'bookings');
  const prevBookings = sum(previous, 'bookings');
  const conversion = visits === 0 ? 0 : bookings / visits;
  const prevConversion = prevVisits === 0 ? 0 : prevBookings / prevVisits;

  const patientFunnel = withDrops([
    { id: 'visit', label: 'Visita al directorio', count: visits },
    { id: 'filter', label: 'Búsqueda o filtro', count: sum(current, 'searchOrFilter') },
    { id: 'profile', label: 'Apertura de ficha', count: profiles },
    { id: 'intent', label: 'WhatsApp o agenda', count: sum(current, 'intent') },
    { id: 'booking', label: 'Reserva confirmada', count: bookings },
  ]);
  const previousPatientFunnel = withDrops([
    { id: 'visit', label: 'Visita al directorio', count: prevVisits },
    { id: 'filter', label: 'Búsqueda o filtro', count: sum(previous, 'searchOrFilter') },
    { id: 'profile', label: 'Apertura de ficha', count: prevProfiles },
    { id: 'intent', label: 'WhatsApp o agenda', count: sum(previous, 'intent') },
    { id: 'booking', label: 'Reserva confirmada', count: prevBookings },
  ]);

  const doctorFunnel = withDrops([
    { id: 'start', label: 'Empieza registro', count: sum(current, 'regStart') },
    { id: 'account', label: 'Cuenta creada', count: sum(current, 'regAccount') },
    { id: 'rethus', label: 'RETHUS enviado', count: sum(current, 'regRethus') },
    { id: 'reps', label: 'REPS enviado', count: sum(current, 'regReps') },
    { id: 'id', label: 'Cédula', count: sum(current, 'regId') },
    { id: 'selfie', label: 'Selfie', count: sum(current, 'regSelfie') },
    { id: 'done', label: 'Registro completo', count: sum(current, 'regComplete') },
  ]);

  const dates = [...new Set(current.map((row) => row.date))];
  const visitSeries = dates.map((date) => ({
    date,
    label: formatDayLabel(date),
    visits: current.filter((row) => row.date === date).reduce((total, row) => total + row.visits, 0),
  }));

  const patientActions = rankActions([
    { id: 'profile', label: 'Abrir ficha', count: profiles },
    { id: 'search', label: 'Buscar', count: sum(current, 'actionSearch') },
    { id: 'city', label: 'Filtrar ciudad', count: sum(current, 'actionCity') },
    { id: 'specialty', label: 'Filtrar especialidad', count: sum(current, 'actionSpecialty') },
    { id: 'whatsapp', label: 'WhatsApp', count: sum(current, 'actionWhatsapp') },
    { id: 'agenda', label: 'Abrir agenda', count: sum(current, 'actionAgenda') },
    { id: 'book', label: 'Reservar', count: bookings },
  ]).slice(0, 5);

  const registrationActions = rankActions([
    { id: 'register', label: 'Empezar registro', count: sum(current, 'regStart') },
    { id: 'send-rethus', label: 'Enviar RETHUS', count: sum(current, 'regRethus') },
    { id: 'send-reps', label: 'Enviar REPS', count: sum(current, 'regReps') },
  ]);

  const cities = ANALYTICS_CITIES.map((name) => {
    const rows = current.filter((row) => row.city === name);
    const cityVisits = sum(rows, 'visits');
    const cityProfiles = sum(rows, 'profiles');
    const cityBookings = sum(rows, 'bookings');
    const doctors = VERIFIED_DOCTORS[name];
    return {
      city: name,
      visits: cityVisits,
      profiles: cityProfiles,
      bookings: cityBookings,
      conversion: cityVisits === 0 ? 0 : cityBookings / cityVisits,
      verifiedDoctors: doctors,
      visitsPerDoctor: doctors === 0 ? 0 : cityVisits / doctors,
    };
  }).sort((a, b) => b.visitsPerDoctor - a.visitsPerDoctor);

  const dropIndex = patientFunnel.findIndex((step) => step.isLargestDrop);
  const drop = dropIndex > 0 ? patientFunnel[dropIndex] : null;
  const previousLost = drop ? previousPatientFunnel.find((step) => step.id === drop.id)?.lost ?? 0 : 0;
  const tightest = city === 'TODAS' ? cities[0] : undefined;
  const reading: AnalyticsReading | null = drop
    ? {
        fromLabel: patientFunnel[dropIndex - 1].label,
        toLabel: drop.label,
        lost: drop.lost,
        lostRate: drop.lostRate ?? 0,
        tightestCity: tightest?.city ?? null,
        visitsPerDoctor: tightest?.visitsPerDoctor ?? 0,
      }
    : null;

  const submitted = sum(current, 'rethusSubmitted');
  const approved = sum(current, 'rethusApproved');
  const prevSubmitted = sum(previous, 'rethusSubmitted');
  const prevApproved = sum(previous, 'rethusApproved');
  const queueDays = current.flatMap((row) => row.queueDays);
  const prevQueueDays = previous.flatMap((row) => row.queueDays);
  const pausedCities: AnalyticsCityName[] = city === 'TODAS' ? [...ANALYTICS_CITIES] : [city];
  let paused = 0;
  for (const name of pausedCities) paused += PAUSED_PROFILES[name];

  return {
    kpis: [
      kpi('visits', 'Visitas al directorio', visits, prevVisits, 'count'),
      kpi('bookings', 'Reservas confirmadas', bookings, prevBookings, 'count'),
      kpi('conversion', 'Visita → reserva', conversion, prevConversion, 'percent'),
      kpi('lost', 'Personas perdidas en la caída', drop?.lost ?? 0, previousLost, 'count'),
    ],
    reading,
    patientFunnel,
    doctorFunnel,
    degreeSkipped: sum(current, 'degreeSkipped'),
    visits: visitSeries,
    patientActions,
    registrationActions,
    cities,
    rethus: {
      approvalRate: submitted === 0 ? 0 : approved / submitted,
      previousApprovalRate: prevSubmitted === 0 ? 0 : prevApproved / prevSubmitted,
      medianDays: median(queueDays),
      previousMedianDays: median(prevQueueDays),
      paused,
    },
    empty: visits === 0,
  };
};
