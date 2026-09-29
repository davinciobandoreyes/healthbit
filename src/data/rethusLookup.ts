import { RethusLookup } from '../types';

const PROFESSIONS = [
  'Medicina',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Neurología',
  'Medicina interna',
];

const FORMATION_TYPES = ['Pregrado', 'Especialización'];
const ORIGINS = ['Nacional', 'Extranjero'];
const SCHOOLS = [
  'Universidad de Antioquia',
  'Universidad Nacional de Colombia',
  'Pontificia Universidad Javeriana',
  'Universidad del Valle',
];
const PLACES = ['Bogotá, D.C.', 'Medellín', 'Cali', 'Barranquilla'];
const BENEFIT_ENTITIES = ['Colegio Médico Colombiano', 'Secretaría de Salud'];

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const pick = <T,>(items: T[], hash: number, salt: number) => items[(hash + salt) % items.length];

/** Demo estable: el mismo nombre produce los mismos códigos. No inventa cédula. */
export const buildRethusLookup = (rawName: string): RethusLookup => {
  const fullName = rawName.trim().replace(/\s+/g, ' ');
  const queryKey = normalizeKey(fullName);
  const hash = hashString(queryKey);
  const year = 2008 + (hash % 16);
  const serial = String(10000 + (hash % 90000)).padStart(5, '0');
  const profession = pick(PROFESSIONS, hash, 3);
  const outcome = (['absent', 'not_enabled', 'enabled'] as const)[hash % 3];

  return {
    queryKey,
    fullName,
    outcome,
    enabled: outcome === 'enabled',
    rethusCode: `RTH-${year}-${serial}`,
    professionCode: `PROF-MED-${1000 + (hash % 9000)}`,
    formation: {
      profession,
      type: pick(FORMATION_TYPES, hash, 5),
      origin: pick(ORIGINS, hash, 8),
      entity: pick(SCHOOLS, hash, 11),
      act: String(1000 + (hash % 9000)),
    },
    benefit: {
      program: profession,
      place: pick(PLACES, hash, 13),
      entity: pick(BENEFIT_ENTITIES, hash, 17),
    },
  };
};
