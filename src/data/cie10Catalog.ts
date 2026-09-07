import { Cie10Code } from '../types';

export const CIE10_CATALOG: Cie10Code[] = [
  { code: 'Z00.0', label: 'Examen médico general' },
  { code: 'Z01.8', label: 'Examen especial especificado' },
  { code: 'Z76.8', label: 'Personas en contacto con servicios de salud por otras circunstancias' },
  { code: 'Z41.1', label: 'Procedimiento estético' },
  { code: 'Z42.0', label: 'Cuidados posteriores a cirugía plástica de cabeza y cuello' },
  { code: 'Z42.1', label: 'Cuidados posteriores a cirugía plástica de mama' },
  { code: 'Z42.8', label: 'Cuidados posteriores a cirugía plástica de otras partes del cuerpo' },
  { code: 'Z48.0', label: 'Atención del vendaje y de las suturas' },
  { code: 'Z48.8', label: 'Otros cuidados posteriores a cirugía' },
  { code: 'Z51.8', label: 'Otra atención médica especificada' },
  { code: 'M95.0', label: 'Deformidad adquirida de la nariz' },
  { code: 'J34.2', label: 'Desviación del tabique nasal' },
  { code: 'J34.3', label: 'Hipertrofia de los cornetes nasales' },
  { code: 'J34.8', label: 'Otros trastornos especificados de la nariz y de los senos paranasales' },
  { code: 'R06.0', label: 'Disnea' },
  { code: 'R06.5', label: 'Respiración con la boca' },
  { code: 'R09.8', label: 'Otros síntomas y signos de los sistemas circulatorio y respiratorio' },
  { code: 'H02.3', label: 'Blefarocalasia' },
  { code: 'H02.4', label: 'Ptosis del párpado' },
  { code: 'H02.8', label: 'Otros trastornos especificados del párpado' },
  { code: 'L57.4', label: 'Cutis laxa senil' },
  { code: 'L90.5', label: 'Cicatriz y fibrosis de la piel' },
  { code: 'L91.0', label: 'Cicatriz hipertrófica' },
  { code: 'L98.8', label: 'Otros trastornos especificados de la piel y del tejido subcutáneo' },
  { code: 'E65', label: 'Adiposidad localizada' },
  { code: 'E66.9', label: 'Obesidad, no especificada' },
  { code: 'N64.8', label: 'Otros trastornos especificados de la mama' },
  { code: 'N62', label: 'Hipertrofia de la mama' },
  { code: 'Q83.8', label: 'Otras malformaciones congénitas de la mama' },
  { code: 'Q18.8', label: 'Otras malformaciones congénitas especificadas de cara y cuello' },
  { code: 'Q30.0', label: 'Atresia de las narinas' },
  { code: 'Q67.4', label: 'Otras anomalías congénitas del cráneo, cara y maxilares' },
  { code: 'M95.1', label: 'Oreja en coliflor' },
  { code: 'Q17.5', label: 'Oreja prominente' },
  { code: 'K07.1', label: 'Anomalías de la relación entre los maxilares y la base del cráneo' },
  { code: 'K13.0', label: 'Enfermedades de los labios' },
  { code: 'R23.8', label: 'Otros cambios de la piel y del tejido subcutáneo' },
  { code: 'L70.0', label: 'Acné vulgar' },
  { code: 'L81.4', label: 'Otras hiperpigmentaciones de melanina' },
  { code: 'L90.8', label: 'Otros trastornos atróficos de la piel' },
  { code: 'T81.0', label: 'Hemorragia y hematoma que complican un procedimiento' },
  { code: 'T81.4', label: 'Infección consecutiva a procedimiento' },
  { code: 'T81.8', label: 'Otras complicaciones de procedimientos' },
  { code: 'T88.8', label: 'Otras complicaciones especificadas de la atención médica y quirúrgica' },
  { code: 'R51', label: 'Cefalea' },
  { code: 'R52.9', label: 'Dolor, no especificado' },
  { code: 'R50.9', label: 'Fiebre, no especificada' },
  { code: 'L03.9', label: 'Celulitis, no especificada' },
  { code: 'T78.4', label: 'Alergia no especificada' },
  { code: 'T78.1', label: 'Otras reacciones a alimentos, no clasificadas en otra parte' },
  { code: 'J30.4', label: 'Rinitis alérgica, no especificada' },
  { code: 'J32.9', label: 'Sinusitis crónica, no especificada' },
  { code: 'G47.3', label: 'Apnea del sueño' },
  { code: 'I10', label: 'Hipertensión esencial (primaria)' },
  { code: 'E11.9', label: 'Diabetes mellitus tipo 2 sin complicaciones' },
  { code: 'J45.9', label: 'Asma, no especificada' },
  { code: 'F41.9', label: 'Trastorno de ansiedad, no especificado' },
  { code: 'Z71.8', label: 'Otras consultas especificadas' },
  { code: 'Z09.0', label: 'Examen de seguimiento después de cirugía por otras afecciones' },
  { code: 'Z09.8', label: 'Examen de seguimiento después de otro tratamiento por otras afecciones' },
  { code: 'S00.3', label: 'Traumatismo superficial de la nariz' },
  { code: 'S01.2', label: 'Herida de la nariz' },
  { code: 'S02.2', label: 'Fractura de huesos nasales' },
  { code: 'L72.0', label: 'Quiste epidérmico' },
  { code: 'D23.3', label: 'Tumor benigno de la piel de otras partes y de las no especificadas de la cara' },
  { code: 'D17.9', label: 'Tumor lipomatoso benigno, sitio no especificado' },
  { code: 'M79.3', label: 'Paniculitis, no especificada' },
  { code: 'R22.0', label: 'Tumoración, masa o prominencia localizada en la cabeza' },
  { code: 'R22.2', label: 'Tumoración, masa o prominencia localizada en el tronco' },
  { code: 'Z41.8', label: 'Otros procedimientos con fines estéticos' },
  { code: 'Z53.8', label: 'Procedimiento no realizado por otras razones' },
];

export const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const searchCie10 = (query: string, limit = 8): Cie10Code[] => {
  const q = normalizeSearch(query.trim());
  if (!q) return [];
  return CIE10_CATALOG.filter(
    (item) => normalizeSearch(item.code).includes(q) || normalizeSearch(item.label).includes(q)
  ).slice(0, limit);
};
