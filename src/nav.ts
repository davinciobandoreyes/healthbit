import { Home, FileText, Users, Settings, ShieldCheck, type LucideIcon } from 'lucide-react';
import { DoctorPortalTab } from './types';

export interface AppNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const PORTAL_NAV_ITEMS: AppNavItem[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export const ADMIN_NAV_ITEMS: AppNavItem[] = [
  { id: 'rethus', label: 'Revisión RETHUS', icon: ShieldCheck },
];

export const isPortalNavActive = (itemId: string, currentTab: DoctorPortalTab): boolean =>
  itemId === currentTab || (itemId === 'patients' && currentTab === 'patient-photos');
