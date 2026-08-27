import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  FileText,
  Activity,
  Scissors,
  Camera,
  Plus,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Heart,
  Droplet,
  ShieldAlert,
  Sparkles,
  Sliders,
  ChevronRight,
  Info,
  X,
  Upload,
  Layers,
  FileCheck,
} from 'lucide-react';
import {
  PatientRecord,
  ClinicalNote,
  SurgicalProcedureRecord,
  ClinicalPhoto,
  PatientStatus,
} from '../types';

interface PatientDetailViewProps {
  patient: PatientRecord;
  onBack: () => void;
  onUpdatePatient: (updated: PatientRecord) => void;
}

type DetailTab = 'summary' | 'notes' | 'procedures' | 'photos';

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  onBack,
  onUpdatePatient,
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('summary');

  // Modals state
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isNewProcedureModalOpen, setIsNewProcedureModalOpen] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [photoComparisonMode, setPhotoComparisonMode] = useState(false);

  // New Clinical Note form state
  const [noteType, setNoteType] = useState<ClinicalNote['noteType']>('control_postoperatorio');
  const [noteTitle, setNoteTitle] = useState('');
  const [soapS, setSoapS] = useState('');
  const [soapO, setSoapO] = useState('');
  const [soapA, setSoapA] = useState('');
  const [soapP, setSoapP] = useState('');
  const [bp, setBp] = useState('120/80 mmHg');
  const [hr, setHr] = useState('72 lpm');

  // New Procedure form state
  const [procName, setProcName] = useState(patient.plannedProcedure || '');
  const [procDate, setProcDate] = useState(new Date().toISOString().split('T')[0]);
  const [procOR, setProcOR] = useState('Quirófano 2 — Torre Médica');
  const [procAnesthesia, setProcAnesthesia] = useState<'general' | 'sedacion_local' | 'regional' | 'local'>('general');
  const [procDuration, setProcDuration] = useState(120);
  const [procFindings, setProcFindings] = useState('');
  const [procImplants, setProcImplants] = useState('');
  const [procIndications, setProcIndications] = useState('');

  // New Photo form state
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800');
  const [photoStage, setPhotoStage] = useState<ClinicalPhoto['stage']>('control_7d');
  const [photoAngle, setPhotoAngle] = useState<ClinicalPhoto['angle']>('frontal');
  const [photoNotes, setPhotoNotes] = useState('');

  // Status Badge Helper
  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'pre_op':
        return { label: 'Pre-Quirúrgico', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'post_op_active':
        return { label: 'Post-Op Activo', bg: 'bg-violet-50 text-violet-700 border-violet-200' };
      case 'in_recovery':
        return { label: 'En Recuperación', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'completed':
        return { label: 'Alta Médica', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { label: 'En Espera', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const currentBadge = getStatusBadge(patient.status);

  // Handlers
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle && !soapS) return;

    const newNote: ClinicalNote = {
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorName: 'Dra. María Camila Restrepo Gómez',
      authorRole: 'Cirujana Plástica Especialista',
      noteType,
      title: noteTitle || `Nota de ${noteType.replace('_', ' ')}`,
      soap: {
        subjective: soapS || 'Sin hallazgos subjetivos adicionales.',
        objective: soapO || 'Examen físico dentro de límites esperados.',
        assessment: soapA || 'Evolución clínica satisfactoria.',
        plan: soapP || 'Continuar con recomendaciones generales y citación a control.',
      },
      vitalSigns: {
        bloodPressure: bp,
        heartRate: hr,
      },
    };

    const updated = {
      ...patient,
      notes: [newNote, ...patient.notes],
    };
    onUpdatePatient(updated);
    setIsNewNoteModalOpen(false);
    // Reset
    setNoteTitle('');
    setSoapS('');
    setSoapO('');
    setSoapA('');
    setSoapP('');
  };

  const handleSaveProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!procName) return;

    const newProc: SurgicalProcedureRecord = {
      id: `proc-${Date.now()}`,
      procedureName: procName,
      date: procDate,
      operatingRoom: procOR,
      anesthesiaType: procAnesthesia,
      durationMinutes: Number(procDuration),
      leadSurgeon: 'Dra. María Camila Restrepo Gómez',
      surgicalFindings: procFindings || 'Procedimiento culminado según técnica habitual sin eventos adversos.',
      implantsUsed: procImplants,
      complications: 'Ninguna intraoperatoria.',
      postOpIndications: procIndications || 'Reposo relativo y analgésicos protocolizados.',
      status: 'completada',
    };

    const updated = {
      ...patient,
      procedures: [newProc, ...patient.procedures],
      status: 'post_op_active' as PatientStatus,
    };
    onUpdatePatient(updated);
    setIsNewProcedureModalOpen(false);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) return;

    const newPhoto: ClinicalPhoto = {
      id: `ph-${Date.now()}`,
      url: photoUrl,
      stage: photoStage,
      angle: photoAngle,
      date: new Date().toISOString().split('T')[0],
      notes: photoNotes || `Registro fotográfico de ${photoStage.replace('_', ' ')}`,
    };

    const updated = {
      ...patient,
      photos: [...patient.photos, newPhoto],
    };
    onUpdatePatient(updated);
    setIsAddPhotoModalOpen(false);
    setPhotoNotes('');
  };

  const preOpPhotos = patient.photos.filter((p) => p.stage === 'pre_op');
  const postOpPhotos = patient.photos.filter((p) => p.stage !== 'pre_op');

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-violet-50 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-violet-600" />
          </div>
          <span>Volver al Directorio de Pacientes</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsNewNoteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nota Clínica</span>
          </button>
          <button
            onClick={() => setIsNewProcedureModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Scissors className="w-3.5 h-3.5 text-violet-400" />
            <span>+ Cirugía</span>
          </button>
          <button
            onClick={() => setIsAddPhotoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-slate-600" />
            <span>+ Subir Foto</span>
          </button>
        </div>
      </div>

      {/* Hero Header: Demographic & Critical Medical Alerts */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={patient.avatarUrl}
                alt={patient.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-violet-500/80 shadow-xs"
              />
              <span
                className={`absolute -bottom-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${currentBadge.bg}`}
              >
                {currentBadge.label}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {patient.fullName}
                </h1>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  {patient.documentId}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-violet-700">
                {patient.plannedProcedure}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {patient.age} años ({patient.gender})
                </span>
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <Droplet className="w-3.5 h-3.5" /> RH: {patient.bloodType}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {patient.city}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Count */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center shrink-0">
            <div className="px-3">
              <div className="text-lg font-extrabold text-slate-900">{patient.notes.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notas</div>
            </div>
            <div className="border-x border-slate-200 px-3">
              <div className="text-lg font-extrabold text-violet-600">{patient.procedures.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cirugías</div>
            </div>
            <div className="px-3">
              <div className="text-lg font-extrabold text-indigo-600">{patient.photos.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fotos</div>
            </div>
          </div>
        </div>

        {/* 🚨 Health Tech Critical Alerts Banner (High Contrast) */}
        {patient.criticalAlerts && patient.criticalAlerts.length > 0 && (
          <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Alertas Clínicas & Factores de Riesgo Críticos</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.criticalAlerts.map((alert, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-rose-300 text-rose-700 font-bold text-xs shadow-2xs"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  {alert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Historia & Anamnesis</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2. Notas de Evolución ({patient.notes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('procedures')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'procedures'
                ? 'border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>3. Procedimientos ({patient.procedures.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>4. Fotos & Comparador ({patient.photos.length})</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: Summary & Anamnesis */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Main Anamnesis Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-violet-600" />
                  Anamnesis & Motivo de Consulta
                </h3>
                <span className="text-xs text-slate-400 font-medium">Historia Clínica Digital No. {patient.id}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Diagnóstico Principal
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    {patient.primaryDiagnosis}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Procedimiento Quirúrgico Planificado / Realizado
                  </h4>
                  <p className="text-sm font-semibold text-violet-900 bg-violet-50/80 p-3.5 rounded-2xl border border-violet-200">
                    {patient.plannedProcedure}
                  </p>
                </div>
              </div>

              {/* Antecedentes Médicos */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-sm text-slate-900">Antecedentes Clínicos del Paciente</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> Patológicos:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {patient.medicalHistory.pathological.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-violet-600" /> Quirúrgicos Previos:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {patient.medicalHistory.surgical.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Alérgicos / Incompatibilidades:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1 font-semibold text-rose-700">
                      {patient.medicalHistory.allergic.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-500" /> Farmacológicos / Actuales:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
                      {patient.medicalHistory.pharmacological.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info & Habits */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-sm text-slate-900 border-b pb-3 border-slate-100">
                Estilo de Vida & Hábitos
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tabaquismo:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-lg ${
                      patient.medicalHistory.lifestyle.smoker
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-violet-50 text-violet-700'
                    }`}
                  >
                    {patient.medicalHistory.lifestyle.smoker ? 'Fumador Activo' : 'No Fumador'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Consumo de Alcohol:</span>
                  <span className="font-bold text-slate-700">
                    {patient.medicalHistory.lifestyle.alcohol ? 'Social / Ocasional' : 'No consume'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Actividad Física:</span>
                  <span className="font-bold text-slate-700">
                    {patient.medicalHistory.lifestyle.physicalActivity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ocupación:</span>
                  <span className="font-bold text-slate-700">{patient.occupation || 'No especificada'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-violet-950 text-white rounded-3xl p-6 space-y-4 shadow-sm border border-slate-800">
              <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Resumen Rápido del Caso
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                El paciente se encuentra bajo protocolo de seguimiento postquirúrgico en HealthBit. Todas las notas clínicas y consentimientos se encuentran sincronizados.
              </p>
              <button
                onClick={() => setActiveTab('notes')}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Ver Cronología de Evolución →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SOAP Clinical Notes Timeline */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Timeline de Notas de Evolución Médica</h3>
              <p className="text-xs text-slate-500">
                Registro SOAP cronológico con firma del especialista y signos vitales.
              </p>
            </div>
            <button
              onClick={() => setIsNewNoteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Nota de Evolución</span>
            </button>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
            {patient.notes.map((note) => (
              <div
                key={note.id}
                className="relative pl-12 space-y-3 group"
              >
                {/* Timeline Dot */}
                <div className="absolute left-3 top-4 w-4 h-4 rounded-full bg-violet-600 border-4 border-white shadow-xs" />

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 hover:border-violet-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                          {note.noteType.replace('_', ' ').toUpperCase()}
                        </span>
                        <h4 className="font-bold text-base text-slate-900">{note.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400">
                        Firmado por: <span className="font-semibold text-slate-600">{note.authorName}</span> ({note.authorRole})
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {note.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {note.time}
                      </span>
                    </div>
                  </div>

                  {/* SOAP Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
                      <span className="font-extrabold text-violet-800 block uppercase tracking-wider text-[11px]">
                        S • Subjetivo
                      </span>
                      <p className="text-slate-700 leading-relaxed">{note.soap.subjective}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
                      <span className="font-extrabold text-violet-800 block uppercase tracking-wider text-[11px]">
                        O • Objetivo & Examen
                      </span>
                      <p className="text-slate-700 leading-relaxed">{note.soap.objective}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
                      <span className="font-extrabold text-indigo-800 block uppercase tracking-wider text-[11px]">
                        A • Análisis & Diagnóstico
                      </span>
                      <p className="text-slate-700 leading-relaxed">{note.soap.assessment}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
                      <span className="font-extrabold text-indigo-800 block uppercase tracking-wider text-[11px]">
                        P • Plan & Conducta
                      </span>
                      <p className="text-slate-700 leading-relaxed">{note.soap.plan}</p>
                    </div>
                  </div>

                  {/* Vital Signs Footer */}
                  {note.vitalSigns && (
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap">
                      {note.vitalSigns.bloodPressure && (
                        <span className="flex items-center gap-1 font-mono">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> PA: {note.vitalSigns.bloodPressure}
                        </span>
                      )}
                      {note.vitalSigns.heartRate && (
                        <span className="flex items-center gap-1 font-mono">
                          <Activity className="w-3.5 h-3.5 text-violet-600" /> FC: {note.vitalSigns.heartRate}
                        </span>
                      )}
                      {note.vitalSigns.temperature && (
                        <span className="flex items-center gap-1 font-mono">
                          <Info className="w-3.5 h-3.5 text-amber-500" /> T°: {note.vitalSigns.temperature}
                        </span>
                      )}
                      {note.vitalSigns.weightKg && (
                        <span className="flex items-center gap-1 font-mono">
                          Peso: {note.vitalSigns.weightKg} kg
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Surgical Procedures */}
      {activeTab === 'procedures' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Historial Quirúrgico & Procedimientos</h3>
              <p className="text-xs text-slate-500">
                Fichas completas de cirugías, hallazgos intraoperatorios y registros de anestesia.
              </p>
            </div>
            <button
              onClick={() => setIsNewProcedureModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Cirugía</span>
            </button>
          </div>

          {patient.procedures.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <Scissors className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700">Sin procedimientos registrados</h4>
              <p className="text-xs text-slate-400">Registra una cirugía o intervención para este paciente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.procedures.map((proc) => (
                <div
                  key={proc.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-100">
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                        {proc.status.toUpperCase()}
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 mt-1">{proc.procedureName}</h4>
                      <p className="text-xs text-slate-400 font-medium">{proc.operatingRoom}</p>
                    </div>

                    <div className="text-right text-xs text-slate-500">
                      <div className="font-bold text-slate-800">{proc.date}</div>
                      <div className="font-mono text-[11px] text-slate-400">Duración: {proc.durationMinutes} min</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 block">Hallazgos Quirúrgicos:</span>
                      <p className="text-slate-600">{proc.surgicalFindings}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 block">Injertos / Implantes Utilizados:</span>
                      <p className="text-slate-600">{proc.implantsUsed || 'No se utilizaron implantes protésicos.'}</p>
                    </div>
                  </div>

                  <div className="bg-violet-50/60 p-4 rounded-2xl border border-violet-100 text-xs space-y-1">
                    <span className="font-bold text-violet-900 block">Indicaciones Postquirúrgicas:</span>
                    <p className="text-violet-800">{proc.postOpIndications}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <span>Cirujano Principal: <strong>{proc.leadSurgeon}</strong></span>
                    <span>Anestesia: <strong className="capitalize">{proc.anesthesiaType.replace('_', ' ')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: Clinical Photos & Before/After Comparator */}
      {activeTab === 'photos' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Evolución Fotográfica & Comparador</h3>
              <p className="text-xs text-slate-500">
                Registro visual de cambios anatómicos organizados por etapas pre, intra y postoperatorias.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPhotoComparisonMode(!photoComparisonMode)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  photoComparisonMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{photoComparisonMode ? 'Ver Galería Completa' : 'Modo Comparador (Antes / Después)'}</span>
              </button>

              <button
                onClick={() => setIsAddPhotoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Subir Foto</span>
              </button>
            </div>
          </div>

          {/* Comparador Side-by-Side Mode */}
          {photoComparisonMode && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Comparación Anatómica Estructural (Antes vs. Después)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pre-Op Container */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">FOTO ANTES (Pre-Op)</span>
                    <span className="text-slate-400">{preOpPhotos[0]?.date || 'Pre-Quirúrgico'}</span>
                  </div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 relative shadow-inner">
                    <img
                      src={preOpPhotos[0]?.url || patient.avatarUrl}
                      alt="Pre-Op"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    {preOpPhotos[0]?.notes || 'Marcación inicial de volumen y perfil dorsal.'}
                  </p>
                </div>

                {/* Post-Op Container */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                      FOTO DESPUÉS (Evolución Actual)
                    </span>
                    <span className="text-violet-700 font-bold">
                      {postOpPhotos[postOpPhotos.length - 1]?.date || 'Actual'}
                    </span>
                  </div>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-violet-500 bg-slate-100 relative shadow-inner">
                    <img
                      src={postOpPhotos[postOpPhotos.length - 1]?.url || patient.avatarUrl}
                      alt="Post-Op"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-violet-800 font-medium">
                    {postOpPhotos[postOpPhotos.length - 1]?.notes || 'Definición tisular y proyección corregida.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Normal Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {patient.photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs space-y-3 group hover:border-violet-300 transition-all"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative border border-slate-200">
                  <img
                    src={photo.url}
                    alt={photo.notes || 'Foto clínica'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
                    {photo.stage.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{photo.angle}</span>
                    <span>{photo.date}</span>
                  </div>
                  {photo.notes && (
                    <p className="text-xs text-slate-600 line-clamp-2">{photo.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Nueva Nota Clínica */}
      {isNewNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsNewNoteModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Registrar Nota de Evolución Médica</h3>
              <p className="text-xs text-slate-500">Expediente de {patient.fullName} — Modelo SOAP</p>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tipo de Nota</label>
                  <select
                    value={noteType}
                    onChange={(e: any) => setNoteType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  >
                    <option value="control_postoperatorio">Control Postoperatorio</option>
                    <option value="consulta_inicial">Consulta Inicial</option>
                    <option value="nota_quirurgica">Nota Quirúrgica</option>
                    <option value="urgencia">Urgencia / Evento Adverso</option>
                    <option value="alta_medica">Alta Médica Definitiva</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Título del Registro</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Ej. Control Día 7 - Retiro de puntos"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              {/* SOAP Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-violet-800">S (Subjetivo - Síntomas del paciente)</label>
                  <textarea
                    rows={2}
                    value={soapS}
                    onChange={(e) => setSoapS(e.target.value)}
                    placeholder="Paciente refiere buena tolerancia, dolor leve controlado..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-violet-800">O (Objetivo - Hallazgos del examen físico)</label>
                  <textarea
                    rows={2}
                    value={soapO}
                    onChange={(e) => setSoapO(e.target.value)}
                    placeholder="Edema leve, herida limpia sin signos de infección..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-indigo-800">A (Análisis)</label>
                    <input
                      type="text"
                      value={soapA}
                      onChange={(e) => setSoapA(e.target.value)}
                      placeholder="Evolución postoperatoria esperada"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-indigo-800">P (Plan / Conducta)</label>
                    <input
                      type="text"
                      value={soapP}
                      onChange={(e) => setSoapP(e.target.value)}
                      placeholder="Continuar curaciones y próximo control"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Guardar y Firmar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Registrar Procedimiento Quirúrgico */}
      {isNewProcedureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsNewProcedureModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Registrar Procedimiento Quirúrgico</h3>
              <p className="text-xs text-slate-500">Expediente de {patient.fullName}</p>
            </div>

            <form onSubmit={handleSaveProcedure} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nombre del Procedimiento</label>
                <input
                  type="text"
                  required
                  value={procName}
                  onChange={(e) => setProcName(e.target.value)}
                  placeholder="Ej. Rinoseptoplastia Ultrasónica"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Fecha de Cirugía</label>
                  <input
                    type="date"
                    value={procDate}
                    onChange={(e) => setProcDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tipo de Anestesia</label>
                  <select
                    value={procAnesthesia}
                    onChange={(e: any) => setProcAnesthesia(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  >
                    <option value="general">General</option>
                    <option value="sedacion_local">Sedación + Local</option>
                    <option value="regional">Regional</option>
                    <option value="local">Local pura</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Duración (min)</label>
                  <input
                    type="number"
                    value={procDuration}
                    onChange={(e) => setProcDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Hallazgos Quirúrgicos</label>
                <textarea
                  rows={2}
                  value={procFindings}
                  onChange={(e) => setProcFindings(e.target.value)}
                  placeholder="Detalles de osteotomías, plano de disección, etc."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-violet-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Indicaciones Postquirúrgicas</label>
                <textarea
                  rows={2}
                  value={procIndications}
                  onChange={(e) => setProcIndications(e.target.value)}
                  placeholder="Medicación, reposo, vendajes..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-violet-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewProcedureModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Guardar Ficha Quirúrgica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Subir Fotografía */}
      {isAddPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsAddPhotoModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Subir Fotografía Clínica</h3>
              <p className="text-xs text-slate-500">Asociar registro al caso de {patient.fullName}</p>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Etapa del Tratamiento</label>
                <select
                  value={photoStage}
                  onChange={(e: any) => setPhotoStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                >
                  <option value="pre_op">Pre-Operatorio</option>
                  <option value="intra_op">Intra-Operatorio</option>
                  <option value="post_op_inmediato">Post-Op Inmediato</option>
                  <option value="control_7d">Control Día 7</option>
                  <option value="control_30d">Control Día 30 (1 Mes)</option>
                  <option value="control_90d">Control Día 90 (3 Meses)</option>
                  <option value="final">Resultado Final</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Ángulo / Proyección</label>
                <select
                  value={photoAngle}
                  onChange={(e: any) => setPhotoAngle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                >
                  <option value="frontal">Frontal</option>
                  <option value="perfil_derecho">Perfil Derecho</option>
                  <option value="perfil_izquierdo">Perfil Izquierdo</option>
                  <option value="oblicua_derecha">Oblicua Derecha</option>
                  <option value="oblicua_izquierda">Oblicua Izquierda</option>
                  <option value="basal">Basal / Caudal</option>
                  <option value="detalle">Detalle Quirúrgico</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Notas Anatómicas</label>
                <input
                  type="text"
                  value={photoNotes}
                  onChange={(e) => setPhotoNotes(e.target.value)}
                  placeholder="Ej. Control de edema en dorso nasal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddPhotoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Subir Fotografía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
