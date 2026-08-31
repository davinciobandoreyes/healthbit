import React from 'react';
import { Activity, ShieldCheck, LogOut } from 'lucide-react';

interface HeaderProps {
  doctorName?: string;
  doctorAvatar?: string;
  specialty?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  doctorName = 'Dra. María Camila Gómez',
  doctorAvatar = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
  specialty = 'Cirugía Plástica de Mamas',
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo: HealthBit */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-400 text-white flex items-center justify-center shadow-xs shadow-violet-200 shrink-0">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                Health<span className="text-violet-600">Bit</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200/80 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                <ShieldCheck className="w-3 h-3 text-violet-600" /> RETHUS
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-normal truncate">
              Portal Oficial del Especialista
            </span>
          </div>
        </div>

        {/* User Status & Mini Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex-col text-right hidden md:flex">
            <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
              {doctorName}
            </span>
            <span className="text-[10px] text-violet-600 font-semibold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span> Médico Activo
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-violet-500/60 shadow-xs shrink-0">
            <img src={doctorAvatar} alt={doctorName} className="w-full h-full object-cover" />
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="inline-flex items-center justify-center min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1.5">Salir</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

