import { LandingTemplateId } from '../types';

export type TemplateTier = 'free' | 'paid' | 'custom';

export interface PublicTemplate {
  id: LandingTemplateId | 'medida';
  name: string;
  blurb: string;
  tier: TemplateTier;
  priceLabel?: string;
}

export const PUBLIC_TEMPLATES: PublicTemplate[] = [
  {
    id: 'consulta',
    name: 'Consulta',
    blurb: 'Foto, especialidad y la agenda arriba para reservar.',
    tier: 'free',
  },
  {
    id: 'historia',
    name: 'Historia',
    blurb: 'Biografía y trayectoria primero. La cita queda al final.',
    tier: 'free',
  },
  {
    id: 'estudio',
    name: 'Estudio',
    blurb: 'Foto grande y procedimientos antes que el texto.',
    tier: 'free',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    blurb: 'Nombre grande y la biografía como cita.',
    tier: 'paid',
    priceLabel: '$49.000 / mes',
  },
  {
    id: 'clinica',
    name: 'Clínica',
    blurb: 'Sede, verificación y agenda en la misma vista.',
    tier: 'paid',
    priceLabel: '$79.000 / mes',
  },
  {
    id: 'medida',
    name: 'A medida',
    blurb: 'Una página hecha para tu práctica. No cambia la plantilla actual.',
    tier: 'custom',
    priceLabel: 'Desde $1.200.000',
  },
];

export const isLandingTemplateId = (value: string | undefined): value is LandingTemplateId =>
  value === 'consulta' ||
  value === 'historia' ||
  value === 'estudio' ||
  value === 'editorial' ||
  value === 'clinica';

export const templateById = (id: string) => PUBLIC_TEMPLATES.find((item) => item.id === id);

export const isTemplateSelectable = (id: string, unlocked: string[] | undefined) => {
  const template = templateById(id);
  if (!template || template.tier === 'custom') return false;
  if (template.tier === 'free') return true;
  return (unlocked || []).includes(id);
};
