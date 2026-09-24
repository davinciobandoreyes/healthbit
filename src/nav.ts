import { BarChart3, Calendar, FileText, Home, Settings, ShieldCheck, Star, Users, type LucideIcon } from 'lucide-react';
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
  { id: 'appointments', label: 'Citas', icon: Calendar },
  { id: 'reviews', label: 'Opiniones', icon: Star },
  { id: 'settings', label: 'Perfil', icon: Settings },
];

export const PORTAL_NAV_MOBILE: AppNavItem[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'patients', label: 'Pacientes', icon: Users },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'appointments', label: 'Cita', icon: Calendar },
  { id: 'settings', label: 'Perfil', icon: Settings },
];

export const ADMIN_NAV_ITEMS: AppNavItem[] = [
  { id: 'rethus', label: 'Revisión RETHUS', icon: ShieldCheck },
  { id: 'analitica', label: 'Analítica', icon: BarChart3 },
];

export const isPortalNavActive = (itemId: string, currentTab: DoctorPortalTab): boolean =>
  itemId === currentTab ||
  (itemId === 'patients' && currentTab === 'patient-photos') ||
  (itemId === 'appointments' && currentTab === 'reviews');

export const shouldShowSidebar = (depth: number): boolean => depth < 2;
