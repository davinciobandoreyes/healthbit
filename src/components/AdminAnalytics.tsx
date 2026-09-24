import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ANALYTICS_CITIES,
  AnalyticsCityFilter,
  AnalyticsPeriod,
  FunnelStep,
  getAnalytics,
  Kpi,
  RankedAction,
} from '../data/adminAnalytics';

const PERIODS: { id: AnalyticsPeriod; label: string }[] = [
  { id: 7, label: '7 días' },
  { id: 30, label: '30 días' },
  { id: 90, label: '90 días' },
];

const countFmt = (value: number) => Math.round(value).toLocaleString('es-CO');
const percentFmt = (value: number) => `${(value * 100).toFixed(1)}%`;

const Delta = ({ delta }: { delta: number | null }) => {
  if (delta === null || Math.abs(delta) < 0.01) {
    return <p className="mt-1 text-[11px] font-bold text-slate-500">Sin cambio claro</p>;
  }
  const sign = delta > 0 ? '+' : '';
  return (
    <p className={`mt-1 text-[11px] font-bold ${delta < 0 ? 'text-slate-500' : 'text-emerald-700'}`}>
      {sign}
      {(delta * 100).toFixed(1)}% vs periodo anterior
    </p>
  );
};

const FunnelChart = ({ steps }: { steps: FunnelStep[] }) => (
  <ol className="space-y-3">
    {steps.map((step) => (
      <li key={step.id}>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <span className={`text-xs font-bold ${step.isLargestDrop ? 'text-amber-800' : 'text-slate-800'}`}>
            {step.label}
          </span>
          <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
            {countFmt(step.count)}
            {step.lostRate !== null && (
              <span className={step.isLargestDrop ? 'text-amber-700' : 'text-slate-400'}>
                {' '}
                · se pierden {countFmt(step.lost)} ({percentFmt(step.lostRate)})
              </span>
            )}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${step.isLargestDrop ? 'bg-amber-500' : 'bg-violet-600'}`}
            style={{ width: `${Math.max(2, step.shareOfStart * 100)}%` }}
          />
        </div>
      </li>
    ))}
  </ol>
);

const ActionList = ({ actions }: { actions: RankedAction[] }) => (
  <ol className="space-y-2.5">
    {actions.map((action, index) => (
      <li key={action.id}>
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <span className="text-xs font-bold text-slate-800">
            {index + 1}. {action.label}
          </span>
          <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">{countFmt(action.count)}</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-violet-600" style={{ width: `${Math.max(2, action.share * 100)}%` }} />
        </div>
      </li>
    ))}
  </ol>
);

const Detail = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full min-h-[44px] px-4 sm:px-5 py-3 flex items-center justify-between gap-3 text-left cursor-pointer"
      >
        <span className="text-sm font-bold text-slate-900">{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 sm:px-5 pb-4 sm:pb-5">{children}</div>}
    </section>
  );
};

const KpiCard = ({ item }: { item: Kpi }) => (
  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
    <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
      {item.format === 'percent' ? percentFmt(item.value) : countFmt(item.value)}
    </p>
    <Delta delta={item.delta} />
  </div>
);

export const AdminAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>(30);
  const [city, setCity] = useState<AnalyticsCityFilter>('TODAS');
  const [lens, setLens] = useState<'ux' | 'negocio'>('ux');
  const [showRegistration, setShowRegistration] = useState(false);
  const data = useMemo(() => getAnalytics(period, city), [period, city]);
  const reading = data.reading;
  const completed = data.doctorFunnel[data.doctorFunnel.length - 1]?.count ?? 0;
  const cityMax = data.cities[0]?.visitsPerDoctor || 1;
  const uxKpis = data.kpis.filter((item) => item.id === 'lost');
  const businessKpis = data.kpis.filter((item) => item.id !== 'lost');

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Analítica</h1>
          <p className="text-xs sm:text-sm text-slate-600">Cifras de demostración. No hay medición en servidor.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-1 bg-white border border-slate-200/80 rounded-xl p-1">
            {PERIODS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPeriod(item.id)}
                className={`min-h-[44px] px-3 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                  period === item.id ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="min-h-[44px] bg-white border border-slate-200/80 rounded-xl px-3 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">Ciudad</span>
            <select
              value={city}
              onChange={(event) => setCity(event.target.value as AnalyticsCityFilter)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer min-h-[44px]"
            >
              <option value="TODAS">Todas las ciudades</option>
              {ANALYTICS_CITIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-slate-200/80 rounded-xl p-1 w-full sm:w-fit" role="tablist">
        {([
          ['ux', 'UX'],
          ['negocio', 'Negocio'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={lens === id}
            onClick={() => setLens(id)}
            className={`min-h-[44px] flex-1 sm:flex-none px-4 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
              lens === id ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {data.empty || !reading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
          <p className="text-sm font-bold text-slate-900">No hay actividad en este corte.</p>
          <p className="text-xs text-slate-500 mt-1">Prueba otro periodo o todas las ciudades.</p>
        </div>
      ) : (
        <>
          {lens === 'ux' ? (
            <>
              <section className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  Entre {reading.fromLabel.toLowerCase()} y {reading.toLabel.toLowerCase()} se pierden {countFmt(reading.lost)} personas ({percentFmt(reading.lostRate)}).
                </p>
              </section>
              <section className="grid sm:grid-cols-3 gap-3">
                {uxKpis.map((item) => (
                  <div key={item.id}>
                    <KpiCard item={item} />
                  </div>
                ))}
              </section>
            </>
          ) : (
            <>
              <section className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {reading.tightestCity
                    ? `${reading.tightestCity} tiene más visitas por médico verificado (${Math.round(reading.visitsPerDoctor).toLocaleString('es-CO')}).`
                    : `En ${city}, ${percentFmt(businessKpis.find((item) => item.id === 'conversion')?.value ?? 0)} de las visitas terminan en reserva.`}
                </p>
              </section>
              <section className="grid sm:grid-cols-3 gap-3">
                {businessKpis.map((item) => (
                  <div key={item.id}>
                    <KpiCard item={item} />
                  </div>
                ))}
              </section>
              {city === 'TODAS' && (
                <section className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
                  <h2 className="text-sm font-bold text-slate-900">¿Dónde hay más visitas por médico?</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5 mb-3">La fila en ámbar es la más ajustada. Elige una ciudad para ver solo esa.</p>
                  <ol className="space-y-1">
                    {data.cities.map((row, index) => (
                      <li key={row.city}>
                        <button
                          type="button"
                          onClick={() => setCity(row.city)}
                          className="w-full min-h-[44px] flex items-center gap-3 text-left cursor-pointer rounded-xl px-1"
                        >
                          <span className={`w-28 shrink-0 text-xs font-bold whitespace-nowrap ${index === 0 ? 'text-amber-800' : 'text-slate-800'}`}>
                            {row.city}
                          </span>
                          <span className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <span
                              className={`block h-full rounded-full ${index === 0 ? 'bg-amber-500' : 'bg-violet-600'}`}
                              style={{ width: `${Math.max(8, (row.visitsPerDoctor / cityMax) * 100)}%` }}
                            />
                          </span>
                          <span className="w-16 text-right text-[11px] font-bold text-slate-600 whitespace-nowrap">
                            {Math.round(row.visitsPerDoctor).toLocaleString('es-CO')}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
            </>
          )}

          {lens === 'ux' && (
            <>
          <Detail title="Embudo del paciente">
            <p className="text-[11px] text-slate-400 mb-4">La barra es el porcentaje de quienes visitaron. El ámbar es donde se pierde más gente.</p>
            <FunnelChart steps={data.patientFunnel} />
          </Detail>

          <Detail title="Embudo del registro">
            <p className="text-[11px] text-slate-400 mb-4">
              Grado omitido: {countFmt(data.degreeSkipped)} de {countFmt(completed)} completos. Es opcional, no cuenta como abandono.
            </p>
            <FunnelChart steps={data.doctorFunnel} />
          </Detail>

          <Detail title="Qué hacen los pacientes">
            <ActionList actions={data.patientActions} />
            <button
              type="button"
              onClick={() => setShowRegistration((value) => !value)}
              aria-expanded={showRegistration}
              className="mt-4 min-h-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              {showRegistration ? 'Ocultar registro' : 'Ver registro'}
            </button>
            {showRegistration && (
              <div className="mt-3">
                <ActionList actions={data.registrationActions} />
              </div>
            )}
          </Detail>

          <Detail title="Visitas por día">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.visits} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={period === 7 ? 0 : period === 30 ? 4 : 13}
                  />
                  <YAxis
                    tick={{ fill: '#7c3aed', fontSize: 9, fontWeight: 700 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const visits = (payload[0]?.value as number) ?? 0;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-[11px]">
                          <strong>
                            {label} · {countFmt(visits)} {visits === 1 ? 'visita' : 'visitas'}
                          </strong>
                        </div>
                      );
                    }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#7c3aed" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Detail>
            </>
          )}

          {lens === 'negocio' && (
          <Detail title="Revisión RETHUS">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Aprobación del periodo</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{percentFmt(data.rethus.approvalRate)}</p>
                <Delta delta={data.rethus.previousApprovalRate === 0 ? null : (data.rethus.approvalRate - data.rethus.previousApprovalRate) / data.rethus.previousApprovalRate} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mediana de días en cola</p>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {data.rethus.medianDays.toLocaleString('es-CO', { maximumFractionDigits: 1 })}
                </p>
                <Delta
                  delta={
                    data.rethus.previousMedianDays === 0
                      ? null
                      : (data.rethus.medianDays - data.rethus.previousMedianDays) / data.rethus.previousMedianDays
                  }
                />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Perfiles pausados</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{countFmt(data.rethus.paused)}</p>
                <p className="mt-1 text-[11px] font-bold text-slate-500">Ahora. No salen en el buscador.</p>
              </div>
            </div>
          </Detail>
          )}
        </>
      )}
    </main>
  );
};
