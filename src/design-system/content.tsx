import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  BarChart3,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  HeartPulse,
  Home,
  MapPin,
  Plus,
  Search,
  Settings,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Star,
  Stethoscope,
  Upload,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { SheetPopover } from '../components/SheetPopover';
import { AMark, Mark, Stage } from './Topic';

export type TopicStatus = 'Use' | 'Current' | "Don't";
export type TopicGroup = 'Foundations' | 'Components' | 'Patterns' | 'Content';

export type TopicSpec = {
  name: string;
  value: string;
  className: string;
  source: string;
  status: TopicStatus;
};

export type TopicGuidance = { status: TopicStatus; text: string };
export type TopicAnatomy = { part: string; note: string };
export type TopicAnnotation = { n: number; note: string };
export type TopicA11y = { n: number; note: string; status?: TopicStatus };

export type DesignTopic = {
  id: string;
  group: TopicGroup;
  label: string;
  purpose: string;
  Specimen: React.FC;
  annotations?: TopicAnnotation[];
  a11y?: TopicA11y[];
  anatomy?: TopicAnatomy[];
  specs: TopicSpec[];
  guidance: TopicGuidance[];
};

export const GROUPS: TopicGroup[] = ['Foundations', 'Components', 'Patterns', 'Content'];

const fieldClass =
  'w-full min-h-[44px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600 focus:bg-white';
const searchClass =
  'w-full min-h-[44px] bg-white border border-slate-200/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600';
const ctaClass =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 border border-violet-500/40 cursor-pointer whitespace-nowrap';
const formButtonClass =
  'inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const compactButtonClass =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95';
const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer';
const ghostButtonClass =
  'inline-flex items-center justify-center min-h-[44px] px-3 py-2 text-slate-500 hover:text-slate-700 font-bold text-xs cursor-pointer';
const whatsAppClass =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl bg-[#128C7E] hover:bg-[#0e7a6e] text-white font-bold text-sm shadow-sm border border-[#0a5c52] cursor-pointer active:scale-95';

const WhatsAppMark: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Swatch: React.FC<{ name: string; hex: string; className: string; token?: string }> = ({ name, hex, className, token }) => (
  <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white">
    <div className={`h-14 ${className}`} />
    <div className="px-3 py-2 space-y-0.5">
      <p className="text-xs font-bold text-slate-900">{name}</p>
      <p className="text-[11px] font-mono text-slate-500">{hex}</p>
      {token ? <p className="text-[11px] font-mono text-slate-400 break-all">{token}</p> : null}
    </div>
  </div>
);

const ColorSpecimen: React.FC = () => (
  <div className="space-y-4">
    <Stage label="Theme tokens">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Swatch name="Indigo ink" hex="#4f46e5" className="bg-indigo-ink" token="--color-indigo-ink" />
        <Swatch name="Porcelain" hex="#f8fafc" className="bg-porcelain border-b border-slate-200/80" token="--color-porcelain" />
        <Swatch name="Paper" hex="#ffffff" className="bg-paper-white border-b border-slate-200/80" token="--color-paper-white" />
        <Swatch name="Verified" hex="#8b5cf6" className="bg-verified" token="--color-verified" />
        <Swatch name="Text secondary" hex="#475569" className="bg-text-secondary" token="--color-text-secondary" />
        <Swatch name="Text tertiary" hex="#94a3b8" className="bg-text-tertiary" token="--color-text-tertiary" />
        <Swatch name="Border" hex="#e2e8f0" className="bg-border-subtle" token="--color-border-subtle" />
        <Swatch name="Surface tertiary" hex="#f1f5f9" className="bg-surface-tertiary" token="--color-surface-tertiary" />
        <Swatch name="Lavender mist" hex="#c7d2fe" className="bg-lavender-mist" token="--color-lavender-mist" />
      </div>
    </Stage>
    <Stage label="Semantic roles" tone="white">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Swatch name="Primary" hex="#7c3aed" className="bg-violet-600" />
        <Swatch name="Primary hover" hex="#6d28d9" className="bg-violet-700" />
        <Swatch name="Verified badge" hex="violet-50 / violet-700" className="bg-violet-50" />
        <Swatch name="Pending" hex="amber-50 / amber-700" className="bg-amber-50" />
        <Swatch name="Info" hex="indigo-50 / indigo-700" className="bg-indigo-50" />
        <Swatch name="Clinical / error" hex="rose-50 / rose-700" className="bg-rose-50" />
        <Swatch name="Canvas" hex="#f8fafc" className="bg-slate-50 border-b border-slate-200/80" />
        <Swatch name="WhatsApp" hex="#128C7E" className="bg-[#128C7E]" />
        <Swatch name="Don't · purple" hex="purple-600" className="bg-purple-600" />
      </div>
    </Stage>
  </div>
);

const TypeSpecimen: React.FC = () => (
  <Stage tone="white">
    <p className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Display / H1</p>
    <p className="text-base sm:text-lg font-bold text-slate-900">Subtitle H2</p>
    <p className="text-xs sm:text-sm font-bold text-slate-900">Card title H3</p>
    <p className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">128</p>
    <p className="text-xs sm:text-sm text-slate-600">Body. Diagnósticos, descripciones e inputs.</p>
    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Microcopy / badge</p>
    <div className="grid sm:grid-cols-2 gap-3 pt-2">
      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Inter · loaded</p>
        <p className="text-sm font-semibold">Encuentra doctores verificados</p>
      </div>
      <div className="rounded-xl bg-slate-50 border border-amber-200/80 p-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">Plus Jakarta Sans · not loaded in the app</p>
        <p className="text-sm font-semibold">Encuentra doctores verificados</p>
      </div>
    </div>
  </Stage>
);

const SpaceSpecimen: React.FC = () => (
  <Stage>
    <div className="flex flex-wrap items-end gap-3">
      {[
        ['p-4', 'p-4'],
        ['p-5', 'p-5'],
        ['p-6', 'p-6'],
        ['p-8', 'p-8'],
      ].map(([label, pad]) => (
        <div key={label} className={`bg-white border border-slate-200/80 rounded-xl ${pad}`}>
          <div className="bg-violet-100 rounded-md px-2 py-1 text-[11px] font-bold text-violet-700">{label}</div>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 rounded-lg bg-violet-600" />
      <span className="w-8 h-8 rounded-lg bg-violet-400" />
      <span className="text-[11px] font-bold text-slate-500">gap-2</span>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="h-10 rounded-xl bg-white border border-slate-200/80" />
      <div className="h-10 rounded-xl bg-white border border-slate-200/80" />
    </div>
    <button type="button" className="min-h-[44px] px-4 rounded-xl bg-white border border-slate-200/80 text-xs font-bold">
      44px target
    </button>
  </Stage>
);

const RadiusSpecimen: React.FC = () => (
  <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-6 sm:p-8">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">rounded-3xl · 24px shell</p>
    <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">rounded-2xl · 16px card</p>
      <div className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-2.5 text-xs text-slate-600">rounded-xl · 12px field</div>
      <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-violet-600 text-white text-[11px] font-bold">rounded-full</span>
    </div>
  </div>
);

const ElevationSpecimen: React.FC = () => (
  <div className="grid sm:grid-cols-3 gap-4">
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4">
      <p className="text-xs font-bold">Card</p>
      <p className="text-[11px] text-slate-500 mt-1">shadow-xs + border</p>
    </div>
    <div className="rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30 border border-violet-500/40 px-4 py-3 text-xs font-bold text-center">
      Floating CTA
    </div>
    <div className="rounded-2xl bg-slate-900/60 p-4">
      <div className="rounded-xl bg-white shadow-2xl p-3">
        <p className="text-xs font-bold">Modal</p>
        <p className="text-[11px] text-slate-500">shadow-2xl</p>
      </div>
    </div>
  </div>
);

const LayoutSpecimen: React.FC = () => (
  <Stage>
    {[
      ['max-w-7xl', 'Directory', 'w-full'],
      ['max-w-6xl', 'Ficha + 340px agenda', 'w-11/12'],
      ['max-w-3xl', 'Alta and historia clínica', 'w-8/12'],
      ['max-w-2xl', 'Registro', 'w-6/12'],
    ].map(([token, use, width]) => (
      <div key={token}>
        <div className={`${width} max-w-full h-8 rounded-xl bg-violet-100 border border-violet-200/80`} />
        <p className="text-[11px] text-slate-600 mt-1">
          <span className="font-mono font-bold text-slate-800">{token}</span> · {use}
        </p>
      </div>
    ))}
    <p className="text-[11px] text-slate-500">Sidebar 232px, collapsed 72px, only at lg and depth 1. Bottom bar h-16.</p>
  </Stage>
);

const BreakpointSpecimen: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {[
      ['default', 'One column'],
      ['sm · 640', 'Page padding px-6'],
      ['md · 768', 'Cards in two columns'],
      ['lg · 1024', 'Sidebar replaces the tab bar'],
    ].map(([name, note]) => (
      <div key={name} className="rounded-2xl bg-white border border-slate-200/80 p-3 shadow-xs">
        <p className="text-xs font-bold text-slate-900">{name}</p>
        <p className="text-[11px] text-slate-500 mt-1">{note}</p>
      </div>
    ))}
  </div>
);

const ZIndexSpecimen: React.FC = () => (
  <div className="relative h-36 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden">
    <div className="absolute left-4 top-4 right-16 h-14 rounded-xl bg-white border border-slate-200/80 shadow-xs px-3 py-2 z-10">
      <p className="text-xs font-bold">z-40</p>
      <p className="text-[11px] text-slate-500">Header, sidebar, floating CTA</p>
    </div>
    <div className="absolute left-16 bottom-4 right-4 h-16 rounded-xl bg-violet-600 text-white px-3 py-2 shadow-lg z-20">
      <p className="text-xs font-bold">z-50</p>
      <p className="text-[11px] text-violet-100">Tab bar, sheet, centered modal</p>
    </div>
  </div>
);

const MotionSpecimen: React.FC = () => (
  <Stage>
    <button type="button" className={ctaClass}>
      Press · active:scale-95
    </button>
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-600">animate-spin</span>
    </div>
    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2">
      animate-fadeIn is applied across the product and has no @keyframes in index.css. This box does not fade.
    </p>
  </Stage>
);

const iconGroups: { label: string; icons: [string, LucideIcon][] }[] = [
  { label: 'Nav', icons: [['Home', Home], ['Users', Users], ['FileText', FileText], ['Calendar', Calendar], ['Star', Star], ['Settings', Settings], ['ShieldCheck', ShieldCheck], ['BarChart3', BarChart3]] },
  { label: 'Action', icons: [['Search', Search], ['Plus', Plus], ['X', X], ['ArrowLeft', ArrowLeft], ['Upload', Upload], ['Check', Check], ['Share2', Share2], ['Filter', Filter]] },
  { label: 'Status', icons: [['CheckCircle2', CheckCircle2], ['AlertCircle', AlertCircle], ['AlertTriangle', AlertTriangle], ['Clock', Clock], ['ShieldAlert', ShieldAlert], ['Award', Award]] },
  { label: 'Clinical', icons: [['Stethoscope', Stethoscope], ['HeartPulse', HeartPulse], ['MapPin', MapPin], ['Building2', Building2], ['Camera', Camera]] },
];

const IconSpecimen: React.FC = () => (
  <div className="space-y-4">
    {iconGroups.map((group) => (
      <Stage key={group.label} label={group.label} tone="white">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {group.icons.map(([name, Icon]) => (
            <div key={name} className="flex items-center gap-2 min-h-[44px]">
              <Icon className="w-4 h-4 text-slate-700" />
              <Icon className="w-5 h-5 text-violet-600 stroke-[2.5]" />
              <span className="text-[11px] font-mono text-slate-500">{name}</span>
            </div>
          ))}
        </div>
      </Stage>
    ))}
    <div className="flex gap-3">
      {[
        ['bg-violet-50 text-violet-600', 'violet'],
        ['bg-indigo-50 text-indigo-600', 'indigo'],
        ['bg-amber-50 text-amber-600', 'amber'],
      ].map(([box, label]) => (
        <div key={label} className="text-center">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${box}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-bold text-slate-500 mt-1">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

const ButtonSpecimen: React.FC = () => (
  <Stage tone="white">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className={ctaClass}>Subir documento</button>
      <button type="button" className={formButtonClass}>Continuar</button>
      <button type="button" className={compactButtonClass}>Guardar</button>
      <button type="button" className={secondaryButtonClass}>Volver</button>
      <button type="button" className={ghostButtonClass}>Omitir</button>
      <button type="button" className={whatsAppClass}><WhatsAppMark /> Escríbenos</button>
      <button type="button" className={formButtonClass} disabled>Continuar</button>
    </div>
  </Stage>
);

const BadgeSpecimen: React.FC = () => (
  <Stage>
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">RETHUS verificado</span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">En revisión</span>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[11px] font-bold whitespace-nowrap">Cirugía plástica</span>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold whitespace-nowrap">Presencial</span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold whitespace-nowrap"><AlertTriangle className="w-3.5 h-3.5" /> Alergia</span>
      <span className="text-xs font-bold text-slate-700">Sede <span className="text-rose-500">*</span></span>
    </div>
  </Stage>
);

const FieldSpecimen: React.FC = () => (
  <Stage tone="white">
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-700">Nombre</span>
      <input className={fieldClass} defaultValue="María Camila Gómez" />
    </label>
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-700">Buscar</span>
      <span className="relative block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input className={searchClass} placeholder="Nombre del médico" />
      </span>
    </label>
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-700">Nota</span>
      <textarea className={`${fieldClass} min-h-[96px] resize-y`} defaultValue="Sin información" />
    </label>
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-700">Ciudad</span>
      <select className={fieldClass} defaultValue="bogota">
        <option value="bogota">Bogotá</option>
        <option value="medellin">Medellín</option>
      </select>
    </label>
    <label className="flex items-center gap-2 min-h-[44px] text-xs font-bold text-slate-700">
      <input type="checkbox" defaultChecked className="w-4 h-4 text-violet-600 rounded border-slate-300" />
      Acepto los términos
    </label>
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-700">Contraseña <span className="text-rose-500">*</span></span>
      <input className="w-full min-h-[44px] bg-rose-50/40 border border-rose-400 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none" defaultValue="••••" />
      <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Las contraseñas no coinciden</span>
    </label>
    <label className="block space-y-1">
      <span className="text-xs font-bold text-slate-400">Deshabilitado</span>
      <input disabled className={`${fieldClass} opacity-40 cursor-not-allowed`} defaultValue="No editable" />
    </label>
  </Stage>
);

const IconButtonSpecimen: React.FC = () => (
  <Stage>
    <div className="flex items-center gap-3">
      <button type="button" aria-label="Cerrar" className="min-h-[44px] min-w-[44px] rounded-full bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center cursor-pointer">
        <X className="w-4 h-4" />
      </button>
      <button type="button" aria-label="Quitar archivo" className="min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  </Stage>
);

const FilterSpecimen: React.FC = () => {
  const [active, setActive] = useState('Todos');
  const pills = ['Todos', 'Agendadas', 'Realizadas'];
  return (
    <Stage tone="white">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Mark n={1} />
          <label className="relative flex-1 block">
            <span className="sr-only">Buscar</span>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input className={searchClass} placeholder="Buscar paciente" />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Mark n={2} />
          <div className="flex gap-2 overflow-x-auto">
          {pills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => setActive(pill)}
              className={`min-h-[44px] px-3 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer ${
                active === pill ? 'bg-violet-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pill}
            </button>
          ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};

const CardSpecimen: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
    <article className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <Mark n={1} />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">Diploma de especialización</h3>
        </div>
        <span className="text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">Acreditado</span>
      </div>
      <p className="text-[11px] text-slate-500 truncate">Universidad Javeriana</p>
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-[11px] text-slate-500">2022</span>
        <span className="inline-flex items-center gap-2">
          <Mark n={2} />
          <button type="button" className="min-h-[44px] px-3 text-xs font-bold text-violet-700 cursor-pointer">Ver diploma</button>
        </span>
      </div>
    </article>
  </div>
);

const StepperSpecimen: React.FC = () => (
  <Stage tone="white">
    <div className="flex items-center gap-2">
      <span className="flex flex-col items-center gap-1">
        <Mark n={2} />
        <span className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">1</span>
      </span>
      <span className="h-0.5 flex-1 bg-violet-600" />
      <span className="flex flex-col items-center gap-1">
        <Mark n={1} />
        <span className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center ring-4 ring-violet-100">2</span>
      </span>
      <span className="h-0.5 flex-1 bg-slate-200" />
      <span className="flex flex-col items-center gap-1">
        <Mark n={3} />
        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold flex items-center justify-center">3</span>
      </span>
    </div>
    <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
      <div className="h-full w-1/3 bg-violet-600 rounded-full" />
    </div>
  </Stage>
);

const SheetSpecimen: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Stage>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2">
          <Mark n={1} />
          <button type="button" className={compactButtonClass} onClick={() => setOpen(true)}>Abrir sheet</button>
        </span>
        <span className="inline-flex items-center gap-2">
          <Mark n={2} />
          <span className="w-10 h-1 rounded-full bg-slate-300" />
        </span>
      </div>
      {open ? (
        <SheetPopover titleId="ds-sheet-title" title="Agendar cita" closeLabel="Cerrar" onClose={() => setOpen(false)}>
          <div className="px-3 pb-4">
            <p className="text-sm font-bold text-slate-900">Visita presencial</p>
            <p className="text-xs text-slate-600 mt-1">Reserva demo. Este sheet no guarda nada.</p>
          </div>
        </SheetPopover>
      ) : null}
    </Stage>
  );
};

const NavigationSpecimen: React.FC = () => {
  const [tab, setTab] = useState('Inicio');
  const [collapsed, setCollapsed] = useState(false);
  const tabs = [
    ['Inicio', Home],
    ['Pacientes', Users],
    ['Cita', Calendar],
    ['Perfil', Settings],
  ] as const;
  return (
    <div className="space-y-4">
      <Stage label="Bottom tab" tone="white">
        <div className="flex items-center gap-2 mb-2">
          <Mark n={1} />
          <span className="text-[11px] font-bold text-slate-500">Active tab</span>
        </div>
        <div className="relative rounded-2xl border-t border-slate-200/80 bg-white/85 overflow-hidden">
          <div className="flex items-end justify-around h-16">
            {tabs.map(([label, Icon]) => {
              const selected = tab === label;
              return (
                <button key={label} type="button" onClick={() => setTab(label)} className="relative flex flex-col items-center justify-center flex-1 h-full cursor-pointer">
                  {selected ? <span className="absolute top-1.5 w-10 h-1 rounded-full bg-violet-600" /> : null}
                  <Icon className={`w-5 h-5 ${selected ? 'text-violet-600 stroke-[2.5]' : 'text-slate-400 stroke-[1.8]'}`} />
                  <span className={`text-[11px] font-bold mt-0.5 ${selected ? 'text-violet-700' : 'text-slate-400'}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Stage>
      <Stage label={collapsed ? 'Sidebar collapsed · 72px' : 'Sidebar · 232px'}>
        <div className={`bg-white border border-slate-200/80 rounded-2xl p-2 ${collapsed ? 'w-[72px]' : 'w-[232px]'} max-w-full`}>
          <button
            type="button"
            className={`w-full min-h-[44px] flex items-center rounded-xl text-xs font-bold text-violet-700 bg-violet-50 ${collapsed ? 'justify-center' : 'gap-2.5 px-3'}`}
          >
            <Home className="w-5 h-5 stroke-[2.5] shrink-0" />
            {collapsed ? null : <span>Inicio</span>}
          </button>
          <button type="button" onClick={() => setCollapsed((value) => !value)} className="w-full min-h-[44px] mt-1 text-[11px] font-bold text-slate-500 cursor-pointer">
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </Stage>
      <div className="flex flex-wrap items-center gap-2">
        <Mark n={2} />
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap"><ShieldCheck className="w-3.5 h-3.5" /> RETHUS</span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold whitespace-nowrap"><Clock className="w-3.5 h-3.5" /> REPS en revisión</span>
      </div>
    </div>
  );
};

const AccessibilitySpecimen: React.FC = () => (
  <Stage tone="white">
    <div className="flex flex-wrap items-center gap-2">
      <Mark n={1} />
      <AMark n={1} />
      <button type="button" className={compactButtonClass}>Continuar</button>
    </div>
    <p className="text-xs text-slate-600">The violet circle is the task. The indigo square is the accessibility fact. Both sit beside the control.</p>
  </Stage>
);

const ContentSpecimen: React.FC = () => (
  <Stage tone="white">
    <div className="flex flex-wrap gap-2">
      {['Continuar', 'Ver', 'Guardar', 'Ingresar'].map((verb) => (
        <span key={verb} className="min-h-[44px] inline-flex items-center px-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold">{verb}</span>
      ))}
    </div>
    <p className="text-xs text-slate-600">RETHUS, REPS, Pre-Op, Post-Op Activo.</p>
    <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2">Correo enviado es un aviso en pantalla. No hay SMTP.</p>
    <p className="text-[11px] text-slate-500">Badges stay on one line with whitespace-nowrap. Touch targets stay at least 44px.</p>
  </Stage>
);

const StatusSpecimen: React.FC = () => (
  <Stage>
    <ul className="space-y-2 text-xs text-slate-700">
      <li className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2"><span className="font-bold">Don't</span> · bg-purple-* in patient photos. Primary is violet-600.</li>
      <li className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2"><span className="font-bold">Don't</span> · Material Symbols. Icons are lucide-react. MobileFrame is unused.</li>
      <li className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2"><span className="font-bold">Don't</span> · DM Sans and Phosphor on dashboard.html. That file is the internal map.</li>
      <li className="rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-2"><span className="font-bold">Current</span> · animate-fadeIn has no keyframes. Gemini fallback success is not a verification seal.</li>
      <li className="rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-2"><span className="font-bold">Current</span> · text-slate-400 (#94a3b8) is below WCAG AA for small text. Recorded, not changed.</li>
    </ul>
  </Stage>
);

export const TOPICS: DesignTopic[] = [
  {
    id: 'color',
    group: 'Foundations',
    label: 'Color',
    purpose: 'Nine CSS variables name the brand neutrals. Screens mostly use Tailwind violet, slate, amber, indigo, and rose directly.',
    Specimen: ColorSpecimen,
    anatomy: [
      { part: 'Token', note: 'The --color-* variable in src/index.css.' },
      { part: 'Role', note: 'What the color means: primary, pending, clinical, canvas.' },
    ],
    specs: [
      { name: 'Indigo ink', value: '#4f46e5', className: 'bg-indigo-ink', source: 'index.css', status: 'Use' },
      { name: 'Porcelain', value: '#f8fafc', className: 'bg-porcelain', source: 'index.css', status: 'Use' },
      { name: 'Paper', value: '#ffffff', className: 'bg-paper-white', source: 'index.css', status: 'Use' },
      { name: 'Verified', value: '#8b5cf6', className: 'bg-verified', source: 'index.css', status: 'Use' },
      { name: 'Text secondary', value: '#475569', className: 'text-text-secondary', source: 'index.css', status: 'Use' },
      { name: 'Text tertiary', value: '#94a3b8', className: 'text-text-tertiary', source: 'index.css', status: 'Current' },
      { name: 'Border', value: '#e2e8f0', className: 'border-border-subtle', source: 'index.css', status: 'Use' },
      { name: 'Surface tertiary', value: '#f1f5f9', className: 'bg-surface-tertiary', source: 'index.css', status: 'Use' },
      { name: 'Lavender mist', value: '#c7d2fe', className: 'bg-lavender-mist', source: 'index.css', status: 'Use' },
      { name: 'Primary', value: '#7c3aed', className: 'bg-violet-600', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Primary hover', value: '#6d28d9', className: 'hover:bg-violet-700', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Pending', value: 'amber-50 / amber-700', className: 'bg-amber-50 text-amber-700', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Clinical', value: 'rose-50 / rose-700', className: 'bg-rose-50 text-rose-700', source: 'PatientDetailView.tsx', status: 'Use' },
      { name: 'WhatsApp', value: '#128C7E', className: 'bg-[#128C7E]', source: 'DoctorOnePager.tsx', status: 'Use' },
      { name: 'Purple drift', value: 'purple-600', className: 'bg-purple-600', source: 'PatientPhotosSection.tsx', status: "Don't" },
    ],
    guidance: [
      { status: 'Use', text: 'Primary actions are violet-600, hover violet-700. Pending review is amber. Clinical risk, required marks, and field errors are rose.' },
      { status: 'Use', text: 'WhatsApp stays #128C7E. It is the only green in the product.' },
      { status: 'Current', text: 'Most screens use raw Tailwind classes. The CSS variables exist and are rarely referenced.' },
      { status: 'Current', text: 'text-slate-400 (#94a3b8) fails WCAG AA for small text. It stays the tertiary color until a product change.' },
      { status: "Don't", text: 'Do not add purple, new ramps, or the dark palette from dashboard.html.' },
    ],
  },
  {
    id: 'type',
    group: 'Foundations',
    label: 'Type',
    purpose: 'Inter is the face the app loads. Plus Jakarta Sans is requested by the portal and is not in index.html, so the product falls back to Inter.',
    Specimen: TypeSpecimen,
    specs: [
      { name: 'UI face', value: 'Inter', className: "font-['Inter',sans-serif]", source: 'index.html', status: 'Use' },
      { name: 'Display face', value: 'Plus Jakarta Sans', className: "font-['Plus_Jakarta_Sans',sans-serif]", source: 'App.tsx', status: 'Current' },
      { name: 'Display', value: '20–24px / 900', className: 'text-xl sm:text-2xl font-black tracking-tight', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'H2', value: '16–18px / 700', className: 'text-base sm:text-lg font-bold', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'H3', value: '12–14px / 700', className: 'text-xs sm:text-sm font-bold', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'KPI', value: '20–24px / 900', className: 'text-xl sm:text-2xl font-black tracking-tight', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Body', value: '12–14px / 400', className: 'text-xs sm:text-sm text-slate-600', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Microcopy', value: '10–11px / 700', className: 'text-[10px] sm:text-[11px] font-bold uppercase tracking-wider', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Use Inter for new UI. Weights in the product are 400, 600, 700, and 900.' },
      { status: 'Current', text: 'Portal roots set Plus Jakarta Sans. index.html does not load it, so those screens render Inter.' },
      { status: "Don't", text: 'Do not add a third typeface.' },
    ],
  },
  {
    id: 'space',
    group: 'Foundations',
    label: 'Space',
    purpose: 'Spacing follows the Tailwind scale already in the screens. Touch targets stay at least 44px, and the main continue button is 48px.',
    Specimen: SpaceSpecimen,
    specs: [
      { name: 'Page', value: '16px / 24px', className: 'px-4 sm:px-6', source: 'PatientDirectory.tsx', status: 'Use' },
      { name: 'Card padding', value: '16–32px', className: 'p-4 p-5 p-6 p-8', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Stack', value: '20px', className: 'space-y-5', source: 'PatientsSection.tsx', status: 'Use' },
      { name: 'Inline', value: '8px', className: 'gap-2', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Grid', value: '12px / 16px', className: 'gap-3 sm:gap-4', source: 'DocumentsSection.tsx', status: 'Use' },
      { name: 'Section', value: '24px', className: 'gap-6', source: 'PatientDetailView.tsx', status: 'Use' },
      { name: 'Touch', value: '44px', className: 'min-h-[44px]', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Continue', value: '48px', className: 'min-h-[48px]', source: 'VerificationFlow.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Page gutter is px-4, sm:px-6. Related items use gap-2. Card grids use gap-3 sm:gap-4.' },
      { status: 'Use', text: 'Every control that can be tapped is at least 44px tall.' },
    ],
  },
  {
    id: 'radius',
    group: 'Foundations',
    label: 'Radius',
    purpose: 'Inner radius is the outer radius minus the padding, so nested corners do not fight.',
    Specimen: RadiusSpecimen,
    anatomy: [
      { part: 'Shell', note: 'rounded-3xl, 24px. Modals, sheets, page sections.' },
      { part: 'Card', note: 'rounded-2xl, 16px.' },
      { part: 'Control', note: 'rounded-xl, 12px. Fields and compact buttons.' },
      { part: 'Pill', note: 'rounded-full. Badges, filters, floating CTA.' },
    ],
    specs: [
      { name: 'Shell', value: '24px', className: 'rounded-3xl', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Card', value: '16px', className: 'rounded-2xl', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Field', value: '12px', className: 'rounded-xl', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Pill', value: '9999px', className: 'rounded-full', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'A 24px shell with p-6 holds a 16px card. A 16px card holds a 12px field.' },
      { status: 'Current', text: 'The floating CTA is a pill. The registro continue button is rounded-2xl. Compact actions are rounded-xl. See Button.' },
    ],
  },
  {
    id: 'elevation',
    group: 'Foundations',
    label: 'Elevation',
    purpose: 'Cards stay flat with a hairline border. Shadow is reserved for floating actions, modals, and sheets.',
    Specimen: ElevationSpecimen,
    specs: [
      { name: 'Card', value: 'shadow-xs', className: 'shadow-xs border border-slate-200/80', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Card alt', value: 'shadow-2xs', className: 'shadow-2xs border border-slate-200/80', source: 'Header.tsx', status: 'Use' },
      { name: 'Floating CTA', value: 'violet shadow-lg', className: 'shadow-lg shadow-violet-600/30', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Modal', value: 'shadow-2xl', className: 'shadow-2xl bg-slate-900/60 backdrop-blur-xs', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Sheet', value: 'slate-950/80', className: 'bg-slate-950/80 shadow-2xl', source: 'SheetPopover.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'A standard card always has a border. Shadow alone is not the edge.' },
      { status: 'Use', text: 'Centered modals use slate-900/60. The bottom sheet uses slate-950/80.' },
    ],
  },
  {
    id: 'layout',
    group: 'Foundations',
    label: 'Layout',
    purpose: 'Width follows the job: a wide directory, a ficha with a 340px agenda, and a single column for forms.',
    Specimen: LayoutSpecimen,
    specs: [
      { name: 'Directory', value: '80rem', className: 'max-w-7xl', source: 'PatientDirectory.tsx', status: 'Use' },
      { name: 'Ficha', value: '72rem + 340px', className: 'max-w-6xl lg:grid-cols-[minmax(0,1fr)_340px]', source: 'DoctorOnePager.tsx', status: 'Use' },
      { name: 'Alta', value: '48rem', className: 'max-w-3xl', source: 'PatientCreateView.tsx', status: 'Use' },
      { name: 'Registro', value: '42rem', className: 'max-w-2xl', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'Sidebar', value: '232 / 72', className: 'w-[232px] w-[72px]', source: 'AppSidebar.tsx', status: 'Use' },
      { name: 'Depth', value: 'depth < 2', className: 'shouldShowSidebar', source: 'nav.ts', status: 'Use' },
      { name: 'Tab bar', value: '64px', className: 'h-16', source: 'BottomTabBar.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'The sidebar shows at lg and only at depth 1. Alta, ficha, and historia clínica hide it.' },
      { status: 'Use', text: 'On small screens the portal uses the bottom tab bar instead of the sidebar.' },
    ],
  },
  {
    id: 'breakpoints',
    group: 'Foundations',
    label: 'Breakpoints',
    purpose: 'The product is mobile first. sm pads the page, md splits cards, and lg swaps the tab bar for the sidebar.',
    Specimen: BreakpointSpecimen,
    specs: [
      { name: 'Default', value: '0', className: 'grid-cols-1', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'sm', value: '640px', className: 'sm:', source: 'Tailwind', status: 'Use' },
      { name: 'md', value: '768px', className: 'md:grid-cols-2', source: 'DocumentsSection.tsx', status: 'Use' },
      { name: 'lg', value: '1024px', className: 'lg:flex hidden lg:hidden', source: 'AppSidebar.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Build the phone layout first. Add sm, md, and lg only where the product already changes.' },
      { status: "Don't", text: 'Do not introduce a new breakpoint.' },
    ],
  },
  {
    id: 'z-index',
    group: 'Foundations',
    label: 'Z-index',
    purpose: 'Two layers cover the product. Sticky chrome sits at 40. Overlays and the tab bar sit at 50.',
    Specimen: ZIndexSpecimen,
    specs: [
      { name: 'Chrome', value: '40', className: 'z-40', source: 'Header.tsx', status: 'Use' },
      { name: 'Overlay', value: '50', className: 'z-50', source: 'SheetPopover.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Header, sidebar, and the floating CTA use z-40. Tab bar, sheets, and centered modals use z-50.' },
      { status: "Don't", text: 'Do not add z-30 or z-60 for a one-off.' },
    ],
  },
  {
    id: 'motion',
    group: 'Foundations',
    label: 'Motion',
    purpose: 'Press feedback is a 95% scale. Spinners use the browser spin. The fade class used everywhere is not defined.',
    Specimen: MotionSpecimen,
    specs: [
      { name: 'Press', value: 'scale 0.95', className: 'active:scale-95 transition-all', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Spinner', value: 'rotate', className: 'animate-spin', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'Sidebar', value: '200ms width', className: 'transition-[width] duration-200', source: 'AppSidebar.tsx', status: 'Use' },
      { name: 'Fade', value: 'undefined', className: 'animate-fadeIn', source: 'index.css', status: 'Current' },
      { name: 'Scan', value: '2.5s', className: 'animate-scan', source: 'index.css', status: 'Current' },
    ],
    guidance: [
      { status: 'Use', text: 'Buttons that commit an action use active:scale-95. Waiting states use the violet spinner.' },
      { status: 'Current', text: 'animate-fadeIn is on many roots and has no keyframes, so it does nothing.' },
      { status: 'Current', text: 'animate-scan belongs to document capture. It is not a general motion token.' },
    ],
  },
  {
    id: 'icons',
    group: 'Components',
    label: 'Icons',
    purpose: 'Icons come from lucide-react. Metric icons sit in a 36px rounded container. Active nav icons use a 2.5 stroke.',
    Specimen: IconSpecimen,
    anatomy: [
      { part: 'Glyph', note: 'w-4 h-4 in content, w-5 h-5 in navigation, w-3.5 h-3.5 in dense rows.' },
      { part: 'Container', note: 'w-9 h-9 rounded-xl with a violet, indigo, or amber tint.' },
    ],
    specs: [
      { name: 'Content', value: '16px', className: 'w-4 h-4', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Nav', value: '20px', className: 'w-5 h-5 stroke-[2.5]', source: 'BottomTabBar.tsx', status: 'Use' },
      { name: 'Dense', value: '14px', className: 'w-3.5 h-3.5', source: 'PatientDetailView.tsx', status: 'Use' },
      { name: 'Container', value: '36px', className: 'w-9 h-9 rounded-xl bg-violet-50 text-violet-600', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Pick from the nav, action, status, and clinical sets already in the product.' },
      { status: "Don't", text: 'Do not import Material Symbols or Phosphor. SpecialistDashboard and MobileFrame are not sources.' },
    ],
  },
  {
    id: 'button',
    group: 'Components',
    label: 'Button',
    purpose: 'Three primary shapes exist. The floating CTA is the rule for a fixed action. Registro uses a wider rounded-2xl continue button.',
    Specimen: ButtonSpecimen,
    annotations: [
      { n: 1, note: 'A disabled Continuar stays in place so the person still sees the action. The page says why it is unavailable next to it.' },
      { n: 2, note: 'WhatsApp sends them out of Plasty, so it is never the only way to finish the task.' },
    ],
    a11y: [
      { n: 1, note: 'State. Disabled Continuar exposes the disabled state, not only a faded color.' },
      { n: 2, note: 'Name. WhatsApp is a link out, with the visible name Escríbenos.' },
    ],
    anatomy: [
      { part: 'Label', note: 'Short verb: Continuar, Guardar, Ver, Subir documento.' },
      { part: 'Icon', note: 'Optional, gap-2, placed before the label.' },
    ],
    specs: [
      { name: 'Floating', value: 'pill / 44px', className: 'rounded-full bg-violet-600 shadow-lg shadow-violet-600/30', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Form', value: '16px radius / 48px', className: 'min-h-[48px] rounded-2xl bg-violet-600', source: 'VerificationFlow.tsx', status: 'Current' },
      { name: 'Compact', value: '12px radius / 44px', className: 'min-h-[44px] rounded-xl bg-violet-600', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'Secondary', value: 'slate-100', className: 'bg-slate-100 hover:bg-slate-200 rounded-2xl', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'Ghost', value: 'text only', className: 'text-slate-500 hover:text-slate-700', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'WhatsApp', value: '#128C7E', className: 'bg-[#128C7E] hover:bg-[#0e7a6e]', source: 'DoctorOnePager.tsx', status: 'Use' },
      { name: 'Disabled', value: '40% opacity', className: 'disabled:opacity-40 disabled:cursor-not-allowed', source: 'VerificationFlow.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'A fixed page action is the violet pill. A paired back action is slate-100. Hover is violet-700. Press scales to 95%.' },
      { status: 'Current', text: 'The registro continue button is rounded-2xl and 48px. Copy that only inside a stepped form.' },
      { status: 'Use', text: 'WhatsApp is the green button, once, for Escríbenos. It is not a second primary.' },
    ],
  },
  {
    id: 'badge',
    group: 'Components',
    label: 'Badge',
    purpose: 'Badges name a status in one line. Color carries the role: violet verified, amber pending, indigo info, slate neutral, rose clinical.',
    Specimen: BadgeSpecimen,
    annotations: [
      { n: 1, note: 'The word carries the state. Color supports it.' },
      { n: 2, note: 'Amber means a person still has to review. Rose means clinical risk or a field error.' },
    ],
    a11y: [
      { n: 1, note: 'State. The word is the state. Amber and rose are not the only signal.' },
      { n: 2, note: 'Text. The words stay on one line.' },
    ],
    specs: [
      { name: 'Verified', value: 'violet', className: 'bg-violet-50 text-violet-700 border-violet-200/80 rounded-full', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Pending', value: 'amber', className: 'bg-amber-50 text-amber-700 border-amber-200/80 uppercase tracking-wider', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'Info', value: 'indigo', className: 'bg-indigo-50 text-indigo-700 border-indigo-200/80', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Neutral', value: 'slate', className: 'bg-slate-100 text-slate-700 rounded-full', source: 'DoctorLanding.tsx', status: 'Use' },
      { name: 'Clinical', value: 'rose', className: 'bg-rose-50 text-rose-700 border-rose-200', source: 'PatientDetailView.tsx', status: 'Use' },
      { name: 'Required', value: 'rose-500', className: 'text-rose-500', source: 'RepsVerificationStep.tsx', status: 'Use' },
      { name: 'Line', value: 'nowrap', className: 'whitespace-nowrap', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Amber means waiting for a person to review. Rose means clinical risk or a field error. Do not swap them.' },
      { status: 'Use', text: 'Keep the label on one line. A badge does not wrap onto a second line.' },
    ],
  },
  {
    id: 'field',
    group: 'Components',
    label: 'Field',
    purpose: 'Forms use a slate-300 border on porcelain. Search in a filter bar uses a slate-200/80 border on white and a 16px radius.',
    Specimen: FieldSpecimen,
    annotations: [
      { n: 1, note: 'A mismatch keeps what they typed, turns the border rose, and puts one sentence under the field.' },
      { n: 2, note: 'Focus moves to that field. The field is not cleared.' },
    ],
    a11y: [
      { n: 1, note: 'Name. The visible label names the field.' },
      { n: 2, note: 'State. An error keeps the text, sets the field invalid, and puts the sentence under it.' },
      { n: 3, note: 'Focus. Focus is the violet border only. The product removes the browser ring with outline-none.', status: 'Current' },
    ],
    anatomy: [
      { part: 'Label', note: 'text-xs font-bold. Required mark is a rose asterisk.' },
      { part: 'Control', note: '44px, rounded-xl, text-xs.' },
      { part: 'Error', note: 'border-rose-400, rose tint, text-rose-600 under the field.' },
    ],
    specs: [
      { name: 'Form', value: 'slate-300', className: 'bg-slate-50 border-slate-300 rounded-xl focus:border-violet-600 focus:bg-white', source: 'VerificationFlow.tsx', status: 'Current' },
      { name: 'Search', value: 'slate-200/80', className: 'bg-white border-slate-200/80 rounded-2xl focus:border-violet-600', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Textarea', value: '96px min', className: 'min-h-[96px] resize-y', source: 'ClinicalHistoryFlow.tsx', status: 'Use' },
      { name: 'Error', value: 'rose-400', className: 'border-rose-400 bg-rose-50/40 text-rose-600', source: 'VerificationFlow.tsx', status: 'Use' },
      { name: 'Focus', value: 'border only', className: 'outline-none focus:border-violet-600', source: 'VerificationFlow.tsx', status: 'Current' },
      { name: 'Disabled', value: '40%', className: 'disabled:opacity-40', source: 'VerificationFlow.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Focus turns the border violet-600 and the fill white. Click a field above to see it.' },
      { status: 'Use', text: 'New filter bars use the search field. Stepped forms keep the slate-300 field until they are rebuilt.' },
      { status: 'Current', text: 'outline-none removes the browser focus ring. Focus is communicated by the border only.' },
    ],
  },
  {
    id: 'icon-button',
    group: 'Components',
    label: 'Icon button',
    purpose: 'Icon-only controls keep a 44px hit area. Close is a white circle. Remove shifts to rose on hover.',
    Specimen: IconButtonSpecimen,
    annotations: [
      { n: 1, note: 'The accessible name says what will happen (Cerrar, Quitar archivo) because there is no visible verb.' },
    ],
    a11y: [
      { n: 1, note: 'Name. The name is Cerrar or Quitar archivo. The icon is not the name.' },
      { n: 2, note: 'Target. The hit area is at least 44 by 44px.' },
    ],
    specs: [
      { name: 'Hit area', value: '44px', className: 'min-h-[44px] min-w-[44px]', source: 'SheetPopover.tsx', status: 'Use' },
      { name: 'Close', value: 'white circle', className: 'rounded-full bg-white border-slate-200/80', source: 'SheetPopover.tsx', status: 'Use' },
      { name: 'Remove', value: 'rose hover', className: 'hover:text-rose-600 hover:bg-rose-50 rounded-xl', source: 'DegreeValidationStep.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Give every icon button an aria-label in Spanish: Cerrar, Quitar archivo.' },
      { status: 'Use', text: 'Rose on hover means remove or a destructive secondary. It is not the primary action.' },
    ],
  },
  {
    id: 'filter-bar',
    group: 'Patterns',
    label: 'Filter bar',
    purpose: 'Search sits on the left. Category pills sit on the right and scroll sideways when they overflow.',
    Specimen: FilterSpecimen,
    annotations: [
      { n: 1, note: 'Choosing a pill does not erase the search text.' },
      { n: 2, note: 'One pill is active. The list updates in place.' },
    ],
    a11y: [
      { n: 1, note: 'State. The selected pill exposes selected, not only violet.' },
      { n: 2, note: 'Name. The search keeps its accessible name Buscar.' },
    ],
    anatomy: [
      { part: 'Search', note: 'Icon at left-3.5, rounded-2xl, violet focus border.' },
      { part: 'Active pill', note: 'bg-violet-600 text-white shadow-xs.' },
      { part: 'Inactive pill', note: 'White, slate border, hover slate-50.' },
    ],
    specs: [
      { name: 'Search', value: '16px radius', className: 'rounded-2xl border-slate-200/80 pl-10', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Active', value: 'violet-600', className: 'bg-violet-600 text-white shadow-xs font-bold', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Inactive', value: 'white', className: 'bg-white border-slate-200 text-slate-600', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'One active pill at a time. Labels stay on one line. Select a pill in the specimen to see the states.' },
      { status: 'Use', text: 'Pacientes and Documentos share this pattern. New lists should reuse it.' },
    ],
  },
  {
    id: 'card',
    group: 'Patterns',
    label: 'Record card',
    purpose: 'A document or patient card is one horizontal unit: icon, title, badge, one line of meta, then an action.',
    Specimen: CardSpecimen,
    annotations: [
      { n: 1, note: 'The whole card is not the action.' },
      { n: 2, note: 'Ver is the action, and it names what will open.' },
    ],
    a11y: [
      { n: 1, note: 'Role. Ver diploma is the button. The card itself is not a button.' },
    ],
    anatomy: [
      { part: 'Icon', note: '36px tinted container.' },
      { part: 'Title', note: 'line-clamp-1 so the row stays one line.' },
      { part: 'Badge', note: 'whitespace-nowrap, opposite the title.' },
      { part: 'Meta', note: '11px slate-500, truncated.' },
      { part: 'Action', note: 'Ver, after a slate-100 divider.' },
    ],
    specs: [
      { name: 'Grid', value: '1 / 2 cols', className: 'grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Card', value: '16px radius', className: 'rounded-2xl border-slate-200/80 shadow-xs', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Divider', value: 'slate-100', className: 'border-t border-slate-100', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Keep the card to those three rows. Do not nest another card inside it.' },
      { status: 'Use', text: 'The action label is Ver or Descargar, not a sentence.' },
    ],
  },
  {
    id: 'stepper',
    group: 'Patterns',
    label: 'Stepper',
    purpose: 'Registro shows a 32px step circle and a thin progress bar. Done and active are violet. Pending is slate.',
    Specimen: StepperSpecimen,
    annotations: [
      { n: 1, note: 'The active step is the only one they can fill.' },
      { n: 2, note: 'Completed steps stay reachable.' },
      { n: 3, note: 'Pending steps are visible and not tappable until the current step is done.' },
    ],
    a11y: [
      { n: 1, note: 'State. The active step is current.' },
      { n: 2, note: 'Role. A pending step is text until it can be used, not a button that does nothing.' },
    ],
    anatomy: [
      { part: 'Done', note: 'Filled violet circle.' },
      { part: 'Active', note: 'Filled violet circle plus ring-4 ring-violet-100.' },
      { part: 'Pending', note: 'slate-100 fill, slate-200 border, slate-400 number.' },
      { part: 'Bar', note: 'h-2 track, violet fill, 500ms ease-out in the product.' },
    ],
    specs: [
      { name: 'Circle', value: '32px', className: 'w-8 h-8 rounded-full', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Active ring', value: 'violet-100', className: 'ring-4 ring-violet-100', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Pending', value: 'slate', className: 'bg-slate-100 text-slate-400 border-slate-200', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Bar', value: '8px', className: 'h-2 bg-violet-600 rounded-full', source: 'VerificationFlow.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'The connector is 2px. Completed segments are violet. Upcoming segments are slate-200.' },
      { status: 'Use', text: 'Step 2 and step 3 still mean human review. The stepper does not call RETHUS or Verifik.' },
    ],
  },
  {
    id: 'sheet',
    group: 'Patterns',
    label: 'Sheet',
    purpose: 'Mobile sheets pin to the bottom over a dark blur, with 32px of page padding and a grabber.',
    Specimen: SheetSpecimen,
    annotations: [
      { n: 1, note: 'Cerrar or the overlay returns them to the same screen and saves nothing.' },
      { n: 2, note: 'The grabber is not a drag handle.' },
    ],
    a11y: [
      { n: 1, note: 'Role. The panel is a dialog named Agendar cita.' },
      { n: 2, note: 'Name. Cerrar is the named close control.' },
      { n: 3, note: 'Focus. The design says focus moves to Cerrar and returns to Abrir sheet. The sheet does not move focus today.', status: 'Current' },
    ],
    anatomy: [
      { part: 'Overlay', note: 'fixed inset-0 z-50, slate-950/80, blur, p-8.' },
      { part: 'Panel', note: 'rounded-3xl, slate-50, shadow-2xl. On sm the bottom radius goes square.' },
      { part: 'Grabber', note: 'w-10 h-1 slate-300, centered.' },
      { part: 'Close', note: '44px white circle with an X and an aria-label.' },
    ],
    specs: [
      { name: 'Overlay', value: 'z-50', className: 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs p-8', source: 'SheetPopover.tsx', status: 'Use' },
      { name: 'Panel', value: '24px radius', className: 'rounded-3xl sm:rounded-t-3xl sm:rounded-b-none shadow-2xl', source: 'SheetPopover.tsx', status: 'Use' },
      { name: 'Close', value: '44px', className: 'min-h-[44px] min-w-[44px] rounded-full', source: 'SheetPopover.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Open the specimen. The sheet is the same SheetPopover the ficha uses. Closing it does not navigate.' },
      { status: 'Use', text: 'On a phone the sheet sits at the bottom. Padding around the overlay is 32px.' },
    ],
  },
  {
    id: 'navigation',
    group: 'Patterns',
    label: 'Navigation',
    purpose: 'Phones use a bottom tab bar. lg uses a 232px sidebar that can collapse to 72px. Status chips sit in the page, not in the nav.',
    Specimen: NavigationSpecimen,
    annotations: [
      { n: 1, note: 'The active item is the one they are in.' },
      { n: 2, note: 'A status chip (RETHUS, REPS) is not a destination.' },
    ],
    a11y: [
      { n: 1, note: 'State. The active item is current.' },
      { n: 2, note: 'Role. A status chip is text, not a link.' },
    ],
    anatomy: [
      { part: 'Active tick', note: 'w-10 h-1 rounded-full bg-violet-600 at the top of the tab.' },
      { part: 'Active icon', note: 'violet-600, stroke 2.5. Inactive is slate-400, stroke 1.8.' },
      { part: 'Sidebar row', note: '44px, rounded-xl. Active is violet-50 / violet-700.' },
      { part: 'Chips', note: 'RETHUS violet when approved. REPS amber while pending.' },
    ],
    specs: [
      { name: 'Tab bar', value: '64px', className: 'h-16 bg-white/85 backdrop-blur-xl border-t', source: 'BottomTabBar.tsx', status: 'Use' },
      { name: 'Tick', value: '40×4', className: 'w-10 h-1 rounded-full bg-violet-600', source: 'BottomTabBar.tsx', status: 'Use' },
      { name: 'Sidebar', value: '232px', className: 'w-[232px] hidden lg:flex', source: 'AppSidebar.tsx', status: 'Use' },
      { name: 'Collapsed', value: '72px', className: 'w-[72px]', source: 'AppSidebar.tsx', status: 'Use' },
      { name: 'RETHUS', value: 'violet', className: 'bg-violet-50 text-violet-700', source: 'HomeDashboard.tsx', status: 'Use' },
      { name: 'REPS pending', value: 'amber', className: 'bg-amber-50 text-amber-700', source: 'HomeDashboard.tsx', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Portal labels: Inicio, Pacientes, Documentos, Citas, Opiniones, Perfil. Mobile says Cita, not Citas.' },
      { status: 'Use', text: 'Admin labels: Revisión RETHUS, Analítica. A chip is a status, not a navigation item.' },
    ],
  },
  {
    id: 'accessibility',
    group: 'Content',
    label: 'Accessibility',
    purpose: 'Mark accessibility beside the control with an indigo square. Keep it separate from the violet usability number.',
    Specimen: AccessibilitySpecimen,
    a11y: [
      { n: 1, note: 'Name. The accessible name is in Spanish. An icon-only control must have one. A decorative icon is hidden from the name.' },
      { n: 2, note: 'Role. Say button, link, dialog, or text field.' },
      { n: 3, note: 'State. Say disabled, selected, invalid, or current. Color is not the only signal.' },
      { n: 4, note: 'Focus. Say where focus goes when it opens, and where it returns when it closes.' },
      { n: 5, note: 'Target. The control is at least 44 by 44px.' },
      { n: 6, note: 'Text. The words stay on one line. text-slate-400 (#94a3b8) is below small-text contrast.', status: 'Current' },
    ],
    anatomy: [
      { part: 'Violet circle', note: 'Usability. What the person is trying to do.' },
      { part: 'Indigo square', note: 'Accessibility. One of name, role, state, focus, target, or text.' },
    ],
    specs: [
      { name: 'Usability mark', value: 'violet circle', className: 'rounded-full bg-violet-600', source: 'Topic.tsx', status: 'Use' },
      { name: 'Accessibility mark', value: 'indigo square', className: 'rounded-md bg-indigo-600', source: 'Topic.tsx', status: 'Use' },
      { name: 'Target', value: '44px', className: 'min-h-[44px] min-w-[44px]', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Tertiary text', value: '#94a3b8', className: 'text-slate-400', source: 'index.css', status: 'Current' },
    ],
    guidance: [
      { status: 'Use', text: 'Put both marks beside the control, not on the label. One accessibility concern per square.' },
      { status: 'Use', text: 'If the specimen already has violet numbers, leave the accessibility note in the list. Do not stack the square on the circle.' },
      { status: "Don't", text: 'Do not annotate a color swatch, a radius, or a shadow.' },
    ],
  },
  {
    id: 'content',
    group: 'Content',
    label: 'Content',
    purpose: 'Labels are short verbs. Regulated names stay as written. A mail notice says it is a demo.',
    Specimen: ContentSpecimen,
    specs: [
      { name: 'Verbs', value: 'one or two words', className: 'Continuar, Ver, Guardar, Ingresar', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Terms', value: 'official', className: 'RETHUS, REPS, Pre-Op', source: 'Contexto/design.md', status: 'Use' },
      { name: 'Mail', value: 'on screen', className: 'Correo enviado', source: 'AGENTS.md', status: 'Use' },
      { name: 'Badge line', value: 'nowrap', className: 'whitespace-nowrap', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Touch', value: '44px', className: 'min-h-[44px]', source: 'DESIGNHealthBit.md', status: 'Use' },
    ],
    guidance: [
      { status: 'Use', text: 'Write Continuar, Registrarse, Ingresar, Ver, Guardar. Skip “haga clic aquí” and “nuevo”.' },
      { status: 'Use', text: 'Say RETHUS and REPS. An email confirmation on screen is a demo notice, not a sent message.' },
      { status: 'Use', text: 'Empty clinical fields display “Sin información”.' },
    ],
  },
  {
    id: 'status',
    group: 'Content',
    label: 'Status',
    purpose: 'Use is the rule to copy. Current ships today and is not the rule. Don’t is a drift to leave behind.',
    Specimen: StatusSpecimen,
    specs: [
      { name: 'Use', value: 'copy this', className: 'violet-600, slate, amber, rose roles', source: 'DESIGNHealthBit.md', status: 'Use' },
      { name: 'Current', value: 'ships, do not spread', className: 'animate-fadeIn, outline-none, Plus Jakarta class', source: 'index.css', status: 'Current' },
      { name: "Don't", value: 'leave it', className: 'bg-purple-600', source: 'PatientPhotosSection.tsx', status: "Don't" },
    ],
    guidance: [
      { status: "Don't", text: 'Purple buttons, Material Symbols, and the dashboard.html palette are outside this system.' },
      { status: 'Current', text: 'A Gemini fallback that returns success is not proof of identity. animate-fadeIn is not a defined motion token.' },
      { status: 'Use', text: 'New UI copies Use. It does not invent a token to paper over Current.' },
    ],
  },
];
