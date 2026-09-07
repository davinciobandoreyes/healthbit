import React, { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search, Sparkles, X } from 'lucide-react';
import {
  Cie10Code,
  ClinicalAntecedentes,
  ClinicalExamenFisico,
  ClinicalHistory,
  ClinicalNote,
  ClinicalSistemas,
  PatientRecord,
} from '../types';
import { searchCie10 } from '../data/cie10Catalog';
import { isMissingClinicalValue } from '../lib/clinicalDisplay';

const fieldClass =
  'w-full min-h-[44px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600';

const textareaClass = `${fieldClass} min-h-[120px] resize-y`;

const STEPS = [
  { id: 1, title: 'Motivo de consulta' },
  { id: 2, title: 'Enfermedad actual' },
  { id: 3, title: 'Antecedentes' },
  { id: 4, title: 'Revisión por sistemas' },
  { id: 5, title: 'Examen físico' },
  { id: 6, title: 'Diagnóstico' },
  { id: 7, title: 'Tratamiento' },
] as const;

const NOTE_TYPE_OPTIONS: { value: ClinicalNote['noteType']; label: string }[] = [
  { value: 'consulta_inicial', label: 'Consulta inicial' },
  { value: 'control_postoperatorio', label: 'Control postoperatorio' },
  { value: 'urgencia', label: 'Urgencia' },
  { value: 'alta_medica', label: 'Alta médica' },
];

const NOTE_TITLES: Record<string, string> = {
  consulta_inicial: 'Historia clínica — Consulta inicial',
  control_postoperatorio: 'Historia clínica — Control',
  urgencia: 'Historia clínica — Urgencia',
  alta_medica: 'Historia clínica — Alta médica',
};

const ANTECEDENTE_FIELDS: { key: keyof ClinicalAntecedentes; label: string }[] = [
  { key: 'patologicos', label: 'Patológicos' },
  { key: 'farmacologicos', label: 'Farmacológicos' },
  { key: 'quirurgicos', label: 'Quirúrgicos' },
  { key: 'alergicos', label: 'Alérgicos' },
  { key: 'ginecobstetricos', label: 'Ginecoobstétricos' },
  { key: 'toxicologicos', label: 'Toxicológicos' },
  { key: 'habitos', label: 'Hábitos' },
  { key: 'familiares', label: 'Familiares' },
  { key: 'otros', label: 'Otros' },
  { key: 'personales', label: 'Personales' },
];

const SISTEMA_FIELDS: { key: keyof ClinicalSistemas; label: string }[] = [
  { key: 'cabeza', label: 'Cabeza' },
  { key: 'torso', label: 'Torso' },
  { key: 'genitales', label: 'Genitales' },
  { key: 'piernas', label: 'Piernas' },
  { key: 'brazos', label: 'Brazos' },
];

const emptyAntecedentes = (): ClinicalAntecedentes => ({
  patologicos: '',
  farmacologicos: '',
  quirurgicos: '',
  alergicos: '',
  ginecobstetricos: '',
  toxicologicos: '',
  habitos: '',
  familiares: '',
  otros: '',
  personales: '',
});

const emptySistemas = (): ClinicalSistemas => ({
  cabeza: '',
  torso: '',
  genitales: '',
  piernas: '',
  brazos: '',
});

const trimValue = (value: string) => value.trim();

const isFilled = (value: string) => !isMissingClinicalValue(value);

export interface ClinicalHistorySavePayload {
  note: ClinicalNote;
  primaryDiagnosis?: string;
  medicalHistory?: PatientRecord['medicalHistory'];
}

interface ClinicalHistoryFlowProps {
  patient: PatientRecord;
  onCancel: () => void;
  onSubmit: (payload: ClinicalHistorySavePayload) => void;
}

export const ClinicalHistoryFlow: React.FC<ClinicalHistoryFlowProps> = ({
  patient,
  onCancel,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [noteType, setNoteType] = useState<ClinicalNote['noteType']>('consulta_inicial');
  const [motivo, setMotivo] = useState('');
  const [enfermedadActual, setEnfermedadActual] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categorizeStatus, setCategorizeStatus] = useState<'idle' | 'loading' | 'gemini' | 'local'>('idle');
  const [antecedentes, setAntecedentes] = useState<ClinicalAntecedentes>(emptyAntecedentes);
  const [sistemas, setSistemas] = useState<ClinicalSistemas>(emptySistemas);
  const [examen, setExamen] = useState<ClinicalExamenFisico>({
    heartRate: '',
    respiratoryRate: '',
    painScale: '',
    glasgow: '',
  });
  const [diagnosticos, setDiagnosticos] = useState<Cie10Code[]>([]);
  const [cieQuery, setCieQuery] = useState('');
  const [tratamiento, setTratamiento] = useState('');

  const progressPercent = Math.round((step / STEPS.length) * 100);
  const stepMeta = STEPS[step - 1];
  const cieResults = useMemo(() => searchCie10(cieQuery), [cieQuery]);

  const setAntecedente = (key: keyof ClinicalAntecedentes, value: string) => {
    setAntecedentes((current) => ({ ...current, [key]: value }));
  };

  const setSistema = (key: keyof ClinicalSistemas, value: string) => {
    setSistemas((current) => ({ ...current, [key]: value }));
  };

  const addDiagnostico = (item: Cie10Code) => {
    setDiagnosticos((current) =>
      current.some((entry) => entry.code === item.code) ? current : [...current, item]
    );
    setCieQuery('');
  };

  const removeDiagnostico = (code: string) => {
    setDiagnosticos((current) => current.filter((item) => item.code !== code));
  };

  const toggleCategoria = (label: string) => {
    setCategorias((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label]
    );
  };

  const categorizeIllnessLocal = (text: string) => {
    const t = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const hits: string[] = [];
    if (/estetic|rinoplast|blefaro|lipo|implante|nariz|parpado|menton|abdomino|mento/.test(t)) {
      hits.push('Estético');
    }
    if (/respir|funcional|obstruc|olfato|vision|ronquido|apnea/.test(t)) hits.push('Funcional');
    if (/dolor|cefalea|algia|molestia/.test(t)) hits.push('Dolor');
    if (/infecc|pus|fiebre|absceso|celulitis|secrecion/.test(t)) hits.push('Infeccioso');
    if (/trauma|golpe|fractura|herida|accidente/.test(t)) hits.push('Trauma');
    if (/postop|cirug|operatori|puntos|ferula|sutura/.test(t)) hits.push('Postoperatorio');
    if (/alerg|urticaria|prurito|hinchazon/.test(t)) hits.push('Alérgico');
    return hits.length ? hits : ['Otro'];
  };

  const categorizeIllness = async () => {
    const text = enfermedadActual.trim();
    if (!text) return;
    setCategorizeStatus('loading');
    try {
      const res = await fetch('/api/categorize-illness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      const next = Array.isArray(data.categories)
        ? data.categories.filter((item: unknown) => typeof item === 'string')
        : [];
      if (!res.ok || next.length === 0) {
        setCategorias(categorizeIllnessLocal(text));
        setCategorizeStatus('local');
        return;
      }
      setCategorias(next);
      setCategorizeStatus(data.fallback ? 'local' : 'gemini');
    } catch {
      setCategorias(categorizeIllnessLocal(text));
      setCategorizeStatus('local');
    }
  };

  const goBack = () => {
    if (step === 1) {
      onCancel();
      return;
    }
    setStep((current) => current - 1);
  };

  const goNext = () => {
    if (step < STEPS.length) setStep((current) => current + 1);
  };

  const handleSave = () => {
    const historia: ClinicalHistory = {
      motivo: trimValue(motivo),
      enfermedadActual: trimValue(enfermedadActual),
      categorias,
      antecedentes: {
        patologicos: trimValue(antecedentes.patologicos),
        farmacologicos: trimValue(antecedentes.farmacologicos),
        quirurgicos: trimValue(antecedentes.quirurgicos),
        alergicos: trimValue(antecedentes.alergicos),
        ginecobstetricos: trimValue(antecedentes.ginecobstetricos),
        toxicologicos: trimValue(antecedentes.toxicologicos),
        habitos: trimValue(antecedentes.habitos),
        familiares: trimValue(antecedentes.familiares),
        otros: trimValue(antecedentes.otros),
        personales: trimValue(antecedentes.personales),
      },
      sistemas: {
        cabeza: trimValue(sistemas.cabeza),
        torso: trimValue(sistemas.torso),
        genitales: trimValue(sistemas.genitales),
        piernas: trimValue(sistemas.piernas),
        brazos: trimValue(sistemas.brazos),
      },
      examenFisico: {
        heartRate: trimValue(examen.heartRate),
        respiratoryRate: trimValue(examen.respiratoryRate),
        painScale: trimValue(examen.painScale),
        glasgow: trimValue(examen.glasgow),
      },
      diagnosticos,
      tratamiento: trimValue(tratamiento),
    };

    const subjectiveParts = [historia.motivo, historia.enfermedadActual].filter(isFilled);
    const objectiveParts = [
      ...SISTEMA_FIELDS.filter((field) => isFilled(historia.sistemas[field.key])).map(
        (field) => `${field.label}: ${historia.sistemas[field.key]}`
      ),
      ...(isFilled(historia.examenFisico.heartRate) ? [`FC: ${historia.examenFisico.heartRate}`] : []),
      ...(isFilled(historia.examenFisico.respiratoryRate)
        ? [`FR: ${historia.examenFisico.respiratoryRate}`]
        : []),
      ...(isFilled(historia.examenFisico.painScale) ? [`Dolor: ${historia.examenFisico.painScale}`] : []),
      ...(isFilled(historia.examenFisico.glasgow) ? [`Glasgow: ${historia.examenFisico.glasgow}`] : []),
    ];
    const assessment =
      historia.diagnosticos.length > 0
        ? historia.diagnosticos.map((item) => `${item.code} ${item.label}`).join('; ')
        : '';

    const note: ClinicalNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorName: 'Dra. María Camila Restrepo Gómez',
      authorRole: 'Cirujana Plástica Especialista',
      noteType,
      title: NOTE_TITLES[noteType] || 'Historia clínica',
      soap: {
        subjective: subjectiveParts.join('\n'),
        objective: objectiveParts.join(' · '),
        assessment,
        plan: historia.tratamiento,
      },
      historia,
    };

    const vitalSigns = {
      heartRate: isFilled(historia.examenFisico.heartRate) ? historia.examenFisico.heartRate : undefined,
      respiratoryRate: isFilled(historia.examenFisico.respiratoryRate)
        ? historia.examenFisico.respiratoryRate
        : undefined,
      painScale: isFilled(historia.examenFisico.painScale) ? historia.examenFisico.painScale : undefined,
      glasgow: isFilled(historia.examenFisico.glasgow) ? historia.examenFisico.glasgow : undefined,
    };
    if (Object.values(vitalSigns).some(Boolean)) {
      note.vitalSigns = vitalSigns;
    }

    const payload: ClinicalHistorySavePayload = { note };

    if (historia.diagnosticos[0]) {
      payload.primaryDiagnosis = `${historia.diagnosticos[0].code} ${historia.diagnosticos[0].label}`;
    }

    const hasAntecedente = ANTECEDENTE_FIELDS.some((field) => isFilled(historia.antecedentes[field.key]));
    if (hasAntecedente) {
      const habitos = historia.antecedentes.habitos.toLowerCase();
      payload.medicalHistory = {
        pathological: isFilled(historia.antecedentes.patologicos)
          ? [historia.antecedentes.patologicos]
          : patient.medicalHistory.pathological,
        surgical: isFilled(historia.antecedentes.quirurgicos)
          ? [historia.antecedentes.quirurgicos]
          : patient.medicalHistory.surgical,
        allergic: isFilled(historia.antecedentes.alergicos)
          ? [historia.antecedentes.alergicos]
          : patient.medicalHistory.allergic,
        pharmacological: isFilled(historia.antecedentes.farmacologicos)
          ? [historia.antecedentes.farmacologicos]
          : patient.medicalHistory.pharmacological,
        familyHistory: isFilled(historia.antecedentes.familiares)
          ? [historia.antecedentes.familiares]
          : patient.medicalHistory.familyHistory,
        lifestyle: {
          smoker: /fuma|tabaco|cigarr/.test(habitos)
            ? true
            : patient.medicalHistory.lifestyle.smoker,
          alcohol: /alcohol|trago|licor/.test(habitos)
            ? true
            : patient.medicalHistory.lifestyle.alcohol,
          physicalActivity: isFilled(historia.antecedentes.habitos)
            ? historia.antecedentes.habitos
            : patient.medicalHistory.lifestyle.physicalActivity,
        },
      };
    }

    onSubmit(payload);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-100px)] max-w-3xl mx-auto animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md pt-3 pb-3 border-b border-slate-200/80 mb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-violet-600 mb-3 min-h-[44px] cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </span>
          Volver a {patient.fullName}
        </button>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Paso {step} de {STEPS.length} · {stepMeta.title}
          </span>
          <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200/60 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex-1 pb-6 space-y-4">
        {step === 1 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Motivo de consulta</h2>
              <p className="text-xs text-slate-500">Lo que dice el paciente. Puede quedar vacío.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <label htmlFor="hc-note-type" className="text-xs font-bold text-slate-700">
                  Tipo de nota
                </label>
                <select
                  id="hc-note-type"
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as ClinicalNote['noteType'])}
                  className={fieldClass}
                >
                  {NOTE_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="hc-motivo" className="text-xs font-bold text-slate-700">
                  Motivo
                </label>
                <textarea
                  id="hc-motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Describe con las palabras del paciente…"
                  className={textareaClass}
                />
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Enfermedad actual</h2>
              <p className="text-xs text-slate-500">Texto abierto. Luego puedes categorizar.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <textarea
                id="hc-enfermedad"
                value={enfermedadActual}
                onChange={(e) => setEnfermedadActual(e.target.value)}
                placeholder="Evolución, síntomas y tiempo de enfermedad…"
                className={textareaClass}
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={categorizeIllness}
                  disabled={!enfermedadActual.trim() || categorizeStatus === 'loading'}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {categorizeStatus === 'loading' ? 'Categorizando…' : 'Categorizar'}
                </button>
                {categorizeStatus === 'local' && (
                  <p className="text-xs text-amber-700">Sugerencias locales</p>
                )}
                {categorizeStatus === 'gemini' && (
                  <p className="text-xs text-slate-500">Sugerencias listas. Puedes quitarlas.</p>
                )}
              </div>
              {categorias.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categorias.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleCategoria(item)}
                      className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold whitespace-nowrap cursor-pointer"
                    >
                      {item}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Antecedentes médicos</h2>
              <p className="text-xs text-slate-500">Opcional. Puede quedar vacío.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ANTECEDENTE_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label htmlFor={`hc-ant-${field.key}`} className="text-xs font-bold text-slate-700">
                    {field.label}
                  </label>
                  <input
                    id={`hc-ant-${field.key}`}
                    value={antecedentes[field.key]}
                    onChange={(e) => setAntecedente(field.key, e.target.value)}
                    placeholder="Opcional"
                    className={fieldClass}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Revisión por sistemas</h2>
              <p className="text-xs text-slate-500">Opcional. Puede quedar vacío.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
              {SISTEMA_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <label htmlFor={`hc-sis-${field.key}`} className="text-xs font-bold text-slate-700">
                    {field.label}
                  </label>
                  <input
                    id={`hc-sis-${field.key}`}
                    value={sistemas[field.key]}
                    onChange={(e) => setSistema(field.key, e.target.value)}
                    placeholder="Opcional"
                    className={fieldClass}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Examen físico</h2>
              <p className="text-xs text-slate-500">Opcional. Puede quedar vacío.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="hc-fc" className="text-xs font-bold text-slate-700">
                  Frecuencia cardíaca
                </label>
                <input
                  id="hc-fc"
                  value={examen.heartRate}
                  onChange={(e) => setExamen((current) => ({ ...current, heartRate: e.target.value }))}
                  placeholder="Opcional"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="hc-fr" className="text-xs font-bold text-slate-700">
                  Frecuencia respiratoria
                </label>
                <input
                  id="hc-fr"
                  value={examen.respiratoryRate}
                  onChange={(e) => setExamen((current) => ({ ...current, respiratoryRate: e.target.value }))}
                  placeholder="Opcional"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="hc-dolor" className="text-xs font-bold text-slate-700">
                  Escala de dolor (0–10)
                </label>
                <input
                  id="hc-dolor"
                  value={examen.painScale}
                  onChange={(e) => setExamen((current) => ({ ...current, painScale: e.target.value }))}
                  placeholder="Opcional"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="hc-glasgow" className="text-xs font-bold text-slate-700">
                  Escala de Glasgow (3–15)
                </label>
                <input
                  id="hc-glasgow"
                  value={examen.glasgow}
                  onChange={(e) => setExamen((current) => ({ ...current, glasgow: e.target.value }))}
                  placeholder="Opcional"
                  className={fieldClass}
                />
              </div>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Diagnóstico CIE-10</h2>
              <p className="text-xs text-slate-500">Escribe una palabra o código y agrega los que apliquen.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="hc-cie"
                  value={cieQuery}
                  onChange={(e) => setCieQuery(e.target.value)}
                  placeholder="Buscar por código o nombre…"
                  className={`${fieldClass} pl-10`}
                  autoComplete="off"
                />
                {cieResults.length > 0 && (
                  <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
                    {cieResults.map((item) => (
                      <li key={item.code}>
                        <button
                          type="button"
                          onClick={() => addDiagnostico(item)}
                          className="w-full text-left px-4 py-3 min-h-[44px] text-xs hover:bg-violet-50 cursor-pointer"
                        >
                          <span className="font-bold text-violet-700 whitespace-nowrap">{item.code}</span>
                          <span className="text-slate-600"> · {item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {diagnosticos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {diagnosticos.map((item) => (
                    <span
                      key={item.code}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-violet-50 text-violet-800 border border-violet-200 text-xs font-bold"
                    >
                      <span className="whitespace-nowrap">{item.code}</span>
                      <span className="font-medium text-slate-600">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => removeDiagnostico(item.code)}
                        className="p-1 rounded-lg hover:bg-violet-100 cursor-pointer"
                        aria-label={`Quitar ${item.code}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {step === 7 && (
          <section className="space-y-4">
            <header className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Tratamiento</h2>
              <p className="text-xs text-slate-500">Opcional. Puede quedar vacío.</p>
            </header>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
              <textarea
                id="hc-tratamiento"
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                placeholder="Indicaciones, medicamentos y controles…"
                className={`${textareaClass} min-h-[160px]`}
              />
            </div>
          </section>
        )}
      </div>

      <div className="sticky bottom-0 bg-slate-50/95 backdrop-blur-md border-t border-slate-200/80 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          {step === 1 ? 'Cancelar' : 'Atrás'}
        </button>
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs cursor-pointer"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-6 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Guardar historial clínico
          </button>
        )}
      </div>
    </div>
  );
};
