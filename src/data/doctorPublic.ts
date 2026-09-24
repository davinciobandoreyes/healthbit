import {
  AppointmentBooking,
  DayAvailability,
  DoctorProfile,
  DoctorTitlePrefix,
  PublicReview,
  WeekdayKey,
  WeeklyAvailability,
} from '../types';

export const WEEKDAY_KEYS: WeekdayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
};

export const defaultDayAvailability = (): DayAvailability => ({
  enabled: true,
  start: '07:00',
  end: '17:00',
});

export const defaultWeeklyAvailability = (): WeeklyAvailability => ({
  mon: defaultDayAvailability(),
  tue: defaultDayAvailability(),
  wed: defaultDayAvailability(),
  thu: defaultDayAvailability(),
  fri: defaultDayAvailability(),
  sat: defaultDayAvailability(),
});

export const splitDoctorName = (
  fullName: string
): { titlePrefix: DoctorTitlePrefix; firstName: string; lastName: string } => {
  let rest = fullName.trim();
  let titlePrefix: DoctorTitlePrefix = '';
  if (/^Dra\.\s+/i.test(rest)) {
    titlePrefix = 'Dra.';
    rest = rest.replace(/^Dra\.\s+/i, '');
  } else if (/^Dr\.\s+/i.test(rest)) {
    titlePrefix = 'Dr.';
    rest = rest.replace(/^Dr\.\s+/i, '');
  }
  const parts = rest.split(/\s+/).filter(Boolean);
  if (parts.length <= 2) {
    return { titlePrefix, firstName: parts[0] || '', lastName: parts.slice(1).join(' ') };
  }
  return {
    titlePrefix,
    firstName: parts.slice(0, -2).join(' '),
    lastName: parts.slice(-2).join(' '),
  };
};

export const composeDisplayName = (doctor: Pick<DoctorProfile, 'fullName' | 'firstName' | 'lastName' | 'titlePrefix'>): string => {
  if (doctor.firstName || doctor.lastName) {
    const prefix = doctor.titlePrefix ? `${doctor.titlePrefix} ` : '';
    return `${prefix}${doctor.firstName ?? ''} ${doctor.lastName ?? ''}`.replace(/\s+/g, ' ').trim();
  }
  return doctor.fullName;
};

export const composeLocation = (doctor: Pick<DoctorProfile, 'location' | 'officeCity' | 'officeAddress'>): string => {
  if (doctor.officeCity || doctor.officeAddress) {
    return [doctor.officeCity, doctor.officeAddress].filter(Boolean).join(' — ');
  }
  return doctor.location;
};

export const composeFocusAreas = (doctor: DoctorProfile): string[] => {
  if (doctor.focusAreas && doctor.focusAreas.length > 0) return doctor.focusAreas;
  return [doctor.specialty, doctor.subspecialty].filter(Boolean) as string[];
};

export const hydrateDoctorProfile = (doctor: DoctorProfile): DoctorProfile => {
  const names = splitDoctorName(doctor.fullName);
  const cityFromLocation = doctor.location.split('—')[0]?.trim() || doctor.location;
  const addressFromLocation = doctor.location.includes('—')
    ? doctor.location.split('—').slice(1).join('—').trim()
    : '';
  return {
    ...doctor,
    firstName: doctor.firstName || names.firstName,
    lastName: doctor.lastName || names.lastName,
    titlePrefix: doctor.titlePrefix ?? names.titlePrefix,
    whatsappPhone: doctor.whatsappPhone || doctor.phone,
    officeCity: doctor.officeCity || cityFromLocation,
    officeAddress: doctor.officeAddress || addressFromLocation,
    focusAreas: composeFocusAreas(doctor),
    weeklyAvailability: doctor.weeklyAvailability || defaultWeeklyAvailability(),
  };
};

export const weekdayFromISO = (iso: string): WeekdayKey | 'sun' => {
  const [y, m, d] = iso.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  return map[day];
};

export const isTimeInRange = (time: string, start: string, end: string): boolean =>
  time >= start && time <= end;

export const CAMILA_EMAIL = 'dra.restrepo@javeriana.edu.co';

export const INITIAL_PUBLIC_REVIEWS: PublicReview[] = [
  {
    id: 'rev-1',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Laura Marcela R.',
    location: 'Medellín, Colombia — Torre Médica El Tesoro',
    rating: 5,
    timeAgo: 'Hace 2 semanas',
    comment:
      'Excelente atención y resultados completamente naturales. El proceso de recuperación fue guiado paso a paso con máxima dedicación.',
    visible: true,
  },
  {
    id: 'rev-2',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Carlos Eduardo V.',
    location: 'Universidad de Antioquia — SCCP',
    rating: 5,
    timeAgo: 'Hace 1 mes',
    comment:
      'Profesionalismo del más alto nivel. Su acreditación RETHUS y trayectoria me brindaron total tranquilidad durante todo el procedimiento.',
    visible: true,
  },
  {
    id: 'rev-3',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Sofía Andrea M.',
    location: 'Medellín, Colombia — Torre Médica El Tesoro',
    rating: 4,
    timeAgo: 'Hace 1 mes y medio',
    comment:
      'Increíble cambio sutil y armónico. La Dra. explica con toda claridad y calidez en cada consulta de valoración.',
    visible: true,
  },
  {
    id: 'rev-4',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Andrés Felipe T.',
    location: 'Medellín, Colombia — Torre Médica El Tesoro',
    rating: 2,
    timeAgo: 'Hace 3 meses',
    comment:
      'La consulta se sintió apresurada y salí con dudas sobre el plan. Esperaba más tiempo para resolver preguntas.',
    visible: true,
  },
  {
    id: 'rev-5',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Diana Carolina P.',
    location: 'Universidad de Antioquia — SCCP',
    rating: 1,
    timeAgo: 'Hace 4 meses',
    comment:
      'Tuve que reprogramar dos veces y la espera en sala fue larga. No volvería a agendar en ese horario.',
    visible: true,
  },
  {
    id: 'rev-6',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Valentina Ríos C.',
    location: 'Medellín, Colombia — Torre Médica El Tesoro',
    rating: 5,
    timeAgo: 'Hace un momento',
    comment:
      'La valoración fue clara y sin presiones. Quedé muy tranquila con el plan que me propuso.',
    visible: false,
  },
  {
    id: 'rev-7',
    doctorEmail: CAMILA_EMAIL,
    patientName: 'Julián Andrés G.',
    location: 'Universidad de Antioquia — SCCP',
    rating: 2,
    timeAgo: 'Hace un momento',
    comment: 'El consultorio estaba lleno y la cita empezó tarde. La explicación se sintió corta.',
    visible: false,
  },
];

const today = new Date();
const isoInDays = (n: number): string => {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const INITIAL_BOOKINGS: AppointmentBooking[] = [
  {
    id: 'bk-1',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-184293',
    patientName: 'Santiago Morales',
    patientPhone: '3005551122',
    dateISO: isoInDays(2),
    time: '09:00',
    reason: 'Primera consulta de valoración',
    createdAt: isoInDays(-3),
    status: 'pending_confirm',
  },
  {
    id: 'bk-2',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-209441',
    patientName: 'Laura Marcela R.',
    patientPhone: '3108883344',
    dateISO: isoInDays(5),
    time: '15:30',
    reason: 'Control postoperatorio',
    createdAt: isoInDays(-1),
    status: 'confirmed',
  },
  {
    id: 'bk-3',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-177002',
    patientName: 'Carlos Eduardo V.',
    patientPhone: '3152227788',
    dateISO: isoInDays(-4),
    time: '10:30',
    reason: 'Valoración rinoplastia',
    createdAt: isoInDays(-10),
    status: 'confirmed',
  },
  {
    id: 'bk-4',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-220118',
    patientName: 'Mariana López',
    patientPhone: '3014447788',
    dateISO: isoInDays(0),
    time: '11:00',
    reason: 'Control de herida',
    createdAt: isoInDays(-1),
    status: 'pending_confirm',
  },
  {
    id: 'bk-5',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-221903',
    patientName: 'Felipe Navarro',
    patientPhone: '3127770099',
    dateISO: isoInDays(1),
    time: '08:30',
    reason: 'Consulta de seguimiento',
    createdAt: isoInDays(-2),
    status: 'confirmed',
  },
  {
    id: 'bk-6',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-198770',
    patientName: 'Diana Carolina P.',
    patientPhone: '3001112233',
    dateISO: isoInDays(3),
    time: '16:00',
    reason: 'Valoración preoperatoria',
    createdAt: isoInDays(-5),
    status: 'cancelled',
  },
  {
    id: 'bk-7',
    doctorEmail: CAMILA_EMAIL,
    refCode: 'HB-230441',
    patientName: 'Ricardo Peña',
    patientPhone: '3156667788',
    dateISO: '',
    time: '',
    reason: 'Quiere agendar valoración de rinoplastia',
    createdAt: isoInDays(-1),
    status: 'pending_confirm',
  },
];
