import React from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import { REPS_SERVICE_TYPES, RepsPractice, RepsServiceType } from '../types';

interface RepsVerificationStepProps {
  practice: RepsPractice;
  submitted: boolean;
  onChange: (practice: RepsPractice) => void;
}

const inputClass =
  'w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all';

export const RepsVerificationStep: React.FC<RepsVerificationStepProps> = ({
  practice,
  submitted,
  onChange,
}) => {
  const toggleService = (service: RepsServiceType) => {
    const selected = practice.serviceTypes.includes(service);
    onChange({
      ...practice,
      serviceTypes: selected
        ? practice.serviceTypes.filter((item) => item !== service)
        : [...practice.serviceTypes, service],
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Habilitación REPS
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Indica la sede donde prestas el servicio y los grupos habilitados. El equipo HealthBit revisará tu REPS.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <label htmlFor="reps-site" className="block text-xs font-bold text-slate-700">
            Sede o consultorio <span className="text-rose-500">*</span>
          </label>
          <input
            id="reps-site"
            type="text"
            value={practice.siteName}
            onChange={(e) => onChange({ ...practice, siteName: e.target.value })}
            className={`${inputClass} font-semibold`}
            placeholder="Ej. Consultorio Chapinero"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="reps-city" className="block text-xs font-bold text-slate-700">
              Ciudad <span className="text-rose-500">*</span>
            </label>
            <input
              id="reps-city"
              type="text"
              value={practice.city}
              onChange={(e) => onChange({ ...practice, city: e.target.value })}
              className={inputClass}
              placeholder="Ej. Bogotá"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reps-address" className="block text-xs font-bold text-slate-700">
              Dirección <span className="text-rose-500">*</span>
            </label>
            <input
              id="reps-address"
              type="text"
              value={practice.address}
              onChange={(e) => onChange({ ...practice, address: e.target.value })}
              className={inputClass}
              placeholder="Ej. Calle 72 # 10-20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Tipos de servicio <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 max-w-full">
            {REPS_SERVICE_TYPES.map((service) => {
              const active = practice.serviceTypes.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  aria-pressed={active}
                  className={`min-h-[44px] px-3 py-2 rounded-full border text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    active
                      ? 'bg-violet-50 text-violet-800 border-violet-200/80'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {submitted && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>REPS en revisión</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-white border border-amber-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                Pendiente
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
              <span>
                {practice.siteName} · {practice.city}. {practice.serviceTypes.join(', ')}. Puedes seguir con la cédula.
                Aparecer en el buscador sigue dependiendo de la aprobación RETHUS.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
