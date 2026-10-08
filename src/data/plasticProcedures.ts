export interface PlasticProcedure {
  id: string;
  label: string;
}

export interface PlasticProcedureGroup {
  id: string;
  label: string;
  items: PlasticProcedure[];
}

export const PLASTIC_PROCEDURE_GROUPS: PlasticProcedureGroup[] = [
  {
    id: 'facial',
    label: 'Cirugía facial',
    items: [
      { id: 'rinoplastia', label: 'Rinoplastia' },
      { id: 'blefaroplastia', label: 'Blefaroplastia' },
      { id: 'ritidoplastia', label: 'Ritidoplastia' },
      { id: 'otoplastia', label: 'Otoplastia' },
      { id: 'mentoplastia', label: 'Mentoplastia' },
      { id: 'bichectomia', label: 'Bichectomía' },
      { id: 'frontoplastia', label: 'Frontoplastia' },
      { id: 'trasplante-capilar', label: 'Trasplante capilar' },
    ],
  },
  {
    id: 'corporal',
    label: 'Estética corporal y mamaria',
    items: [
      { id: 'mamoplastia', label: 'Mamoplastia' },
      { id: 'mastopexia', label: 'Mastopexia' },
      { id: 'explantacion', label: 'Explantación mamaria' },
      { id: 'lipoescultura', label: 'Lipoescultura' },
      { id: 'abdominoplastia', label: 'Abdominoplastia' },
      { id: 'mommy-makeover', label: 'Mommy makeover' },
      { id: 'gluteoplastia', label: 'Gluteoplastia' },
      { id: 'cirugia-intima', label: 'Cirugía íntima' },
      { id: 'post-bariatrica', label: 'Contorno post-bariátrico' },
    ],
  },
  {
    id: 'reconstructiva',
    label: 'Cirugía reconstructiva',
    items: [
      { id: 'reconstruccion-mamaria', label: 'Reconstrucción mamaria' },
      { id: 'mano', label: 'Mano y microcirugía' },
      { id: 'quemados', label: 'Quemados' },
      { id: 'labio-paladar', label: 'Labio y paladar hendido' },
      { id: 'craneofacial', label: 'Craneofacial' },
      { id: 'biopolimeros', label: 'Retiro de biopolímeros' },
      { id: 'cicatrices', label: 'Cicatrices y tumores de piel' },
    ],
  },
  {
    id: 'no-quirurgico',
    label: 'No quirúrgicos',
    items: [
      { id: 'botox', label: 'Toxina botulínica' },
      { id: 'hialuronico', label: 'Ácido hialurónico' },
      { id: 'bioestimuladores', label: 'Bioestimuladores' },
      { id: 'hilos', label: 'Hilos de sustentación' },
      { id: 'laser', label: 'Láser' },
    ],
  },
];

export const PLASTIC_PROCEDURES: PlasticProcedure[] = PLASTIC_PROCEDURE_GROUPS.flatMap((group) => group.items);

export const isPlasticSurgeonSpecialty = (specialty: string) =>
  specialty
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .includes('plastic');
