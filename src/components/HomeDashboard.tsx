import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Star,
  Eye,
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  FileCheck,
  FileText,
  ArrowUpRight,
  UserPlus,
  FilePlus,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  Percent,
  Filter,
  SlidersHorizontal,
  Check,
  ShieldAlert,
  Sparkles,
  Mail,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { DateRangePreset, DoctorProfile, DoctorPortalTab } from '../types';
import { INITIAL_PATIENTS } from '../data/mockPatients';

interface HomeDashboardProps {
  doctor: DoctorProfile;
  onNavigateToTab: (tab: DoctorPortalTab) => void;
  emailNotice?: string | null;
  onDismissEmailNotice?: () => void;
}

type ChartViewType = 'bars' | 'lines';

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  doctor,
  onNavigateToTab,
  emailNotice,
  onDismissEmailNotice,
}) => {
  const [selectedRange, setSelectedRange] = useState<DateRangePreset>('7d');
  const [customStartDate, setCustomStartDate] = useState('2026-07-15');
  const [customEndDate, setCustomEndDate] = useState('2026-08-13');
  const [appliedCustomDates, setAppliedCustomDates] = useState<{ start: string; end: string }>({
    start: '2026-07-15',
    end: '2026-08-13',
  });
  const [isCustomApplied, setIsCustomApplied] = useState<boolean>(false);
  const [chartView, setChartView] = useState<ChartViewType>('bars');

  const patientStats = useMemo(() => {
    const total = INITIAL_PATIENTS.length;
    const postOp = INITIAL_PATIENTS.filter((p) => p.status === 'post_op_active').length;
    const preOp = INITIAL_PATIENTS.filter((p) => p.status === 'pre_op').length;
    const completed = INITIAL_PATIENTS.filter((p) => p.status === 'completed').length;
    return { total, postOp, preOp, completed };
  }, []);

  const handleApplyCustomDates = () => {
    setAppliedCustomDates({
      start: customStartDate,
      end: customEndDate,
    });
    setIsCustomApplied(true);
    setTimeout(() => {
      setIsCustomApplied(false);
    }, 2500);
  };

  // Dynamic metrics calculation depending on date range filter
  const metricsData = useMemo(() => {
    switch (selectedRange) {
      case '3d':
        return {
          appointments: 6,
          appointmentsDiff: '+12% vs 3 días prev.',
          reviews: 4,
          avgRating: 5.0,
          reviewsDiff: '100% satisfacción reciente',
          profileViews: 160,
          viewsDiff: '+15% actividad reciente',
          chartData: [
            { label: 'Día 1', appointments: 2, views: 50 },
            { label: 'Día 2', appointments: 3, views: 60 },
            { label: 'Día 3', appointments: 1, views: 50 },
          ],
        };
      case '7d':
        return {
          appointments: 14,
          appointmentsDiff: '+18% vs semana previa',
          reviews: 8,
          avgRating: 5.0,
          reviewsDiff: '100% comentarios 5 estrellas',
          profileViews: 340,
          viewsDiff: '+12% esta semana',
          chartData: [
            { label: 'Lun', appointments: 2, views: 45 },
            { label: 'Mar', appointments: 3, views: 58 },
            { label: 'Mié', appointments: 1, views: 39 },
            { label: 'Jue', appointments: 4, views: 62 },
            { label: 'Vie', appointments: 3, views: 50 },
            { label: 'Sáb', appointments: 1, views: 46 },
            { label: 'Dom', appointments: 0, views: 40 },
          ],
        };
      case '90d':
        return {
          appointments: 142,
          appointmentsDiff: '+28% vs trimestre ant.',
          reviews: 94,
          avgRating: 4.9,
          reviewsDiff: '98.5% recomendación global',
          profileViews: 3840,
          viewsDiff: '+35% tráfico RETHUS',
          chartData: [
            { label: 'Mes 1', appointments: 42, views: 1100 },
            { label: 'Mes 2', appointments: 48, views: 1320 },
            { label: 'Mes 3', appointments: 52, views: 1420 },
          ],
        };
      case 'custom':
        return {
          appointments: 36,
          appointmentsDiff: `${appliedCustomDates.start} al ${appliedCustomDates.end}`,
          reviews: 24,
          avgRating: 4.95,
          reviewsDiff: 'Periodo personalizado',
          profileViews: 920,
          viewsDiff: 'Tráfico en rango seleccionado',
          chartData: [
            { label: 'P1', appointments: 8, views: 210 },
            { label: 'P2', appointments: 10, views: 240 },
            { label: 'P3', appointments: 9, views: 230 },
            { label: 'P4', appointments: 9, views: 240 },
          ],
        };
      case '30d':
      default:
        return {
          appointments: 48,
          appointmentsDiff: '+24% vs mes anterior',
          reviews: 32,
          avgRating: 4.9,
          reviewsDiff: '4.9 de 5.0 (142 valoraciones)',
          profileViews: 1280,
          viewsDiff: '+38% pacientes únicos',
          chartData: [
            { label: 'Sem 1', appointments: 10, views: 280 },
            { label: 'Sem 2', appointments: 12, views: 310 },
            { label: 'Sem 3', appointments: 14, views: 350 },
            { label: 'Sem 4', appointments: 12, views: 340 },
          ],
        };
    }
  }, [selectedRange, appliedCustomDates]);

  const doctorDisplayName = doctor.fullName
    .replace(/^(Dr\.|Dra\.|Doctora|Doctor)\s+/i, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(' ');

  return (
    <div className="space-y-5 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inicio
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Resumen clínico, demanda y estado de tu perfil
          </p>
        </div>
      </div>

      {/* Doctor Welcome Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 text-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0 max-w-full">
            <p className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
              Hola, {doctorDisplayName}
            </p>
            <p className="text-xs text-slate-300 truncate">
              {doctor.specialty} • {doctor.institution}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              doctor.verifiedStatus.rethus
                ? 'bg-violet-500/20 text-violet-300 border border-violet-400/30'
                : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {doctor.verifiedStatus.rethus
                ? 'Habilitación RETHUS Verificada'
                : doctor.rethusReviewStatus === 'denied'
                  ? 'RETHUS no confirmado'
                  : 'RETHUS pendiente de verificación'}
            </span>
          </span>
        </div>
      </div>

      {doctor.isPaused && (
        <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tu perfil está pausado. No apareces en el buscador de pacientes hasta que el equipo HealthBit lo reactive.
          </p>
        </div>
      )}

      {emailNotice && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{emailNotice}</p>
          </div>
          {onDismissEmailNotice && (
            <button
              type="button"
              onClick={onDismissEmailNotice}
              className="text-[11px] font-bold text-slate-500 hover:text-violet-700 whitespace-nowrap cursor-pointer"
            >
              Cerrar
            </button>
          )}
        </div>
      )}

      {/* 2. Analítica de Pacientes (Core Patient Analytics Section) */}
      <section id="analitica-de-pacientes" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
              <Users className="w-3 h-3" />
              <span>Información Central</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mt-0.5">
              Analítica de Pacientes
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Estado clínico en tiempo real
          </span>
        </div>

        {/* Unified Card Container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">Distribución de Expedientes</h3>
                <p className="text-[11px] text-slate-400 truncate">Estatus de pacientes registrados en la plataforma</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
              {patientStats.total} Totales
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Item 1: Total Pacientes */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  Registrados
                </span>
                <Users className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {patientStats.total}
              </div>
              <div className="text-[10px] font-medium text-violet-700 mt-0.5 truncate">
                Digitalizados
              </div>
            </div>

            {/* Item 2: Post-Op Activo */}
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider truncate">
                  Post-Op Activo
                </span>
                <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {patientStats.postOp}
              </div>
              <div className="text-[10px] font-medium text-indigo-700 mt-0.5 truncate">
                Seguimiento
              </div>
            </div>

            {/* Item 3: Pre-Quirúrgicos */}
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider truncate">
                  Pre-Op
                </span>
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {patientStats.preOp}
              </div>
              <div className="text-[10px] font-medium text-amber-700 mt-0.5 truncate">
                Valoración
              </div>
            </div>

            {/* Item 4: Altas Médicas */}
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider truncate">
                  Altas
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {patientStats.completed}
              </div>
              <div className="text-[10px] font-medium text-indigo-700 mt-0.5 truncate">
                Alta Médica
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Rendimiento y Citas (Matching Analytics Section Layout & Consistency) */}
      <section id="rendimiento-y-citas" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
              <Calendar className="w-3 h-3" />
              <span>Métricas de Consultorio</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 mt-0.5">
              Rendimiento y Citas
            </h2>
          </div>

          {/* Period Filter Options */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 rounded-2xl p-1 shadow-2xs self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSelectedRange('7d')}
              className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedRange === '7d'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              7 días
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('3d')}
              className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedRange === '3d'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              3 días
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('90d')}
              className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedRange === '90d'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              3 meses
            </button>
            <button
              type="button"
              onClick={() => setSelectedRange('custom')}
              title="Rango de fecha personalizado"
              aria-label="Rango de fecha personalizado"
              className={`min-h-[36px] p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                selectedRange === 'custom'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Custom Date Pickers (if custom selected) */}
        {selectedRange === 'custom' && (
          <div className="bg-violet-50/80 border border-violet-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs animate-fadeIn shadow-2xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="font-bold text-violet-950 flex items-center gap-1.5 shrink-0">
                <Calendar className="w-4 h-4 text-violet-600" /> Rango Personalizado:
              </span>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 font-semibold">Desde:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-white border border-violet-300 rounded-xl px-3 py-1.5 text-slate-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 font-semibold">Hasta:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-white border border-violet-300 rounded-xl px-3 py-1.5 text-slate-800 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-2xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCustomDates}
              className={`inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0 active:scale-95 ${
                isCustomApplied
                  ? 'bg-violet-700 text-white ring-2 ring-violet-400'
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
            >
              {isCustomApplied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>¡Aplicado!</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Aplicar</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* 2-Column Grid Matrix for Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Column 1: Métricas de Demanda y Reputación */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">Resumen de Demanda</h3>
                  <p className="text-[11px] text-slate-400 truncate">Citas y visibilidad del consultorio</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                {metricsData.appointments} Citas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Item 1: Citas Agendadas */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                    Citas Agendadas
                  </span>
                  <Calendar className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {metricsData.appointments}
                </div>
                <div className="text-[10px] font-medium text-violet-700 mt-0.5 truncate">
                  {metricsData.appointmentsDiff}
                </div>
              </div>

              {/* Item 2: Vistas de Perfil */}
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider truncate">
                    Vistas Perfil
                  </span>
                  <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {metricsData.profileViews.toLocaleString()}
                </div>
                <div className="text-[10px] font-medium text-indigo-700 mt-0.5 truncate">
                  {metricsData.viewsDiff}
                </div>
              </div>

              {/* Item 3: Calificación */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider truncate">
                    Calificación
                  </span>
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {metricsData.avgRating} ★
                </div>
                <div className="text-[10px] font-medium text-amber-700 mt-0.5 truncate">
                  {metricsData.reviews} valoraciones
                </div>
              </div>

              {/* Item 4: Tasa de Conversión */}
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider truncate">
                    Conversión
                  </span>
                  <Percent className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {metricsData.profileViews > 0
                    ? ((metricsData.appointments / metricsData.profileViews) * 100).toFixed(1)
                    : '3.8'}%
                </div>
                <div className="text-[10px] font-medium text-indigo-700 mt-0.5 truncate">
                  Vistas a Cita
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Gráfico de Dinámica de Citas y Tráfico */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">Dinámica y Tráfico</h3>
                  <p className="text-[11px] text-slate-400 truncate">Comparativa de demanda en el tiempo</p>
                </div>
              </div>

              {/* Chart Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setChartView('bars')}
                  className={`min-h-[28px] px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    chartView === 'bars'
                      ? 'bg-white text-violet-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Gráfico de Barras"
                >
                  Barras
                </button>
                <button
                  type="button"
                  onClick={() => setChartView('lines')}
                  className={`min-h-[28px] px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    chartView === 'lines'
                      ? 'bg-white text-violet-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Gráfico de Líneas"
                >
                  Líneas
                </button>
              </div>
            </div>

            {/* Interactive Graph */}
            <div className="w-full h-44 sm:h-48 select-none">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'bars' ? (
                  <BarChart
                    data={metricsData.chartData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fill: '#7c3aed', fontSize: 9, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: '#4f46e5', fontSize: 9, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const apts = payload.find((p) => p.dataKey === 'appointments')?.value as number ?? 0;
                          const views = payload.find((p) => p.dataKey === 'views')?.value as number ?? 0;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-[11px] space-y-1 font-['Plus_Jakarta_Sans',sans-serif]">
                              <div className="font-bold text-slate-200 border-b border-slate-700/80 pb-1">{label}</div>
                              <div className="flex justify-between gap-3 text-violet-300">
                                <span>Citas:</span>
                                <strong className="font-mono">{apts}</strong>
                              </div>
                              <div className="flex justify-between gap-3 text-indigo-300">
                                <span>Vistas:</span>
                                <strong className="font-mono">{views}</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="appointments"
                      name="Citas"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={22}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="views"
                      name="Vistas"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                ) : (
                  <LineChart
                    data={metricsData.chartData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fill: '#7c3aed', fontSize: 9, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: '#4f46e5', fontSize: 9, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const apts = payload.find((p) => p.dataKey === 'appointments')?.value as number ?? 0;
                          const views = payload.find((p) => p.dataKey === 'views')?.value as number ?? 0;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-[11px] space-y-1 font-['Plus_Jakarta_Sans',sans-serif]">
                              <div className="font-bold text-slate-200 border-b border-slate-700/80 pb-1">{label}</div>
                              <div className="flex justify-between gap-3 text-violet-300">
                                <span>Citas:</span>
                                <strong className="font-mono">{apts}</strong>
                              </div>
                              <div className="flex justify-between gap-3 text-indigo-300">
                                <span>Vistas:</span>
                                <strong className="font-mono">{views}</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="appointments"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#8b5cf6' }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="views"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#4f46e5' }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
      </div>
  );
};
