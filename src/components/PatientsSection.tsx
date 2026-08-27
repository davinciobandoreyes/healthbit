import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Scissors,
  FileText,
  Camera,
  Activity,
  Calendar,
  Phone,
  Heart,
  Droplet,
  X,
  ShieldAlert,
} from 'lucide-react';
import { PatientRecord, PatientStatus } from '../types';
import { INITIAL_PATIENTS } from '../data/mockPatients';
import { PatientDetailView } from './PatientDetailView';

export const PatientsSection: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);

  // New Patient Form State
  const [formName, setFormName] = useState('');
  const [formDocId, setFormDocId] = useState('');
  const [formAge, setFormAge] = useState(30);
  const [formGender, setFormGender] = useState<'Femenino' | 'Masculino' | 'Otro'>('Femenino');
  const [formBloodType, setFormBloodType] = useState<'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'>('O+');
  const [formPhone, setFormPhone] = useState('+57 300 000-0000');
  const [formEmail, setFormEmail] = useState('');
  const [formCity, setFormCity] = useState('Medellín, Colombia');
  const [formDiagnosis, setFormDiagnosis] = useState('');
  const [formProcedure, setFormProcedure] = useState('Rinoplastia Estructural');
  const [formAlerts, setFormAlerts] = useState('');

  // Selected Patient Record
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  const normalizeStr = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredPatients = patients.filter((patient) => {
    const q = normalizeStr(searchQuery);
    const matchesQuery =
      normalizeStr(patient.fullName).includes(q) ||
      normalizeStr(patient.documentId).includes(q) ||
      normalizeStr(patient.plannedProcedure).includes(q) ||
      normalizeStr(patient.primaryDiagnosis).includes(q);

    const matchesStatus =
      selectedStatusFilter === 'ALL' || patient.status === selectedStatusFilter;

    return matchesQuery && matchesStatus;
  });

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

  const handleUpdatePatient = (updated: PatientRecord) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newPat: PatientRecord = {
      id: `pat-${Date.now()}`,
      fullName: formName,
      documentId: formDocId || `CC ${Math.floor(100000000 + Math.random() * 900000000)}`,
      birthDate: '1995-01-01',
      age: Number(formAge) || 30,
      gender: formGender,
      bloodType: formBloodType,
      phone: formPhone,
      email: formEmail || 'paciente@healthbit.co',
      city: formCity,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      primaryDiagnosis: formDiagnosis || 'Evaluación inicial de valoración estética facial',
      plannedProcedure: formProcedure,
      status: 'pre_op',
      criticalAlerts: formAlerts
        ? formAlerts.split(',').map((a) => a.trim())
        : ['Sin alertas críticas reportadas'],
      medicalHistory: {
        pathological: ['Sin antecedentes patológicos relevantes'],
        surgical: ['Sin cirugías previas'],
        allergic: ['No refiere alergias medicamentosas'],
        pharmacological: ['Ninguno regular'],
        familyHistory: ['Padres vivos y sanos'],
        lifestyle: {
          smoker: false,
          alcohol: true,
          physicalActivity: 'Moderada',
        },
      },
      notes: [
        {
          id: `note-init-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          authorName: 'Dra. María Camila Restrepo Gómez',
          authorRole: 'Cirujana Plástica Especialista',
          noteType: 'consulta_inicial',
          title: 'Consulta Inicial de Valoración',
          soap: {
            subjective: 'Paciente asiste a primera consulta médica para valoración estética.',
            objective: 'Examen físico inicial sin alteraciones evidentes.',
            assessment: 'Candidato apto para protocolo pre-quirúrgico.',
            plan: 'Solicitud de exámenes de rutina y agendamiento de control.',
          },
        },
      ],
      procedures: [],
      photos: [],
      evolution: [],
    };

    setPatients([newPat, ...patients]);
    setSelectedPatientId(newPat.id);
    setIsNewPatientModalOpen(false);
    // Reset Form
    setFormName('');
    setFormDocId('');
    setFormDiagnosis('');
    setFormAlerts('');
  };

  // If a patient is selected, render the 360 Full Screen Patient Detail View
  if (activePatient) {
    return (
      <PatientDetailView
        patient={activePatient}
        onBack={() => setSelectedPatientId(null)}
        onUpdatePatient={handleUpdatePatient}
      />
    );
  }

  // Otherwise, render the Main Patients Directory
  return (
    <div className="space-y-5 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pacientes
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Expedientes clínicos, estado quirúrgico y seguimiento
          </p>
        </div>
        <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200/80 px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap hidden sm:inline-flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-violet-600" /> {patients.length} expedientes
        </span>
      </div>

      {/* Search & Filter Bar with View Mode Switcher */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, cédula o procedimiento..."
            className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-violet-600 shadow-xs"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'post_op_active', label: 'Post-Op' },
              { id: 'pre_op', label: 'Pre-Op' },
              { id: 'in_recovery', label: 'Recuperación' },
              { id: 'completed', label: 'Alta' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedStatusFilter === tab.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients Cards List */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3 max-w-md mx-auto">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No se encontraron pacientes</h3>
          <p className="text-xs text-slate-500">
            Intenta con otro término de búsqueda o crea un nuevo expediente clínico.
          </p>
        </div>
      ) : (
        /* Vista de Tarjetas (Optimizada para Mobile/Tablet con Core Data y Desktop con contexto) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-fadeIn">
          {filteredPatients.map((patient) => {
            const badge = getStatusBadge(patient.status);

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className="bg-white border border-slate-200/80 hover:border-violet-500/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 sm:space-y-4 group flex flex-col justify-between"
              >
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Card Header: Core Identity (Avatar, Nombre, Cédula, Edad, Género, Estado) */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={patient.avatarUrl}
                        alt={patient.fullName}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover border-2 border-violet-500/90 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                          {patient.fullName}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 truncate">
                          CC: {patient.documentId} • {patient.age} años • {patient.gender}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Desktop Only Context (Procedimiento y Alertas - Oculto en Mobile/Tablet para mantener ultra limpieza) */}
                  <div className="hidden lg:block space-y-2">
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Procedimiento:
                      </span>
                      <p className="text-xs font-bold text-slate-800 truncate">{patient.plannedProcedure}</p>
                    </div>

                    {patient.criticalAlerts && patient.criticalAlerts.length > 0 && !patient.criticalAlerts[0].toLowerCase().includes('sin alertas') && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold bg-rose-50/80 border border-rose-200 px-2.5 py-1.5 rounded-xl truncate">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">Alerta: {patient.criticalAlerts[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Core Metrics (Notas, Cirugías, Fotos) & Botón de Acción */}
                <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700">
                      <FileText className="w-3 h-3 text-violet-600" />
                      <span>{patient.notes.length} Notas</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700">
                      <Scissors className="w-3 h-3 text-indigo-600" />
                      <span>{patient.procedures.length} Cirugías</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700">
                      <Camera className="w-3 h-3 text-indigo-600" />
                      <span>{patient.photos.length} Fotos</span>
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 group-hover:translate-x-0.5 transition-transform shrink-0 pl-2">
                    <span className="hidden sm:inline">Ver Ficha</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accessible Fixed Floating Action Button (FAB) for Creating New Patient */}
      <button
        id="fab-nuevo-paciente"
        type="button"
        onClick={() => setIsNewPatientModalOpen(true)}
        title="Registrar nuevo paciente"
        aria-label="Registrar nuevo paciente"
        className="fixed bottom-24 right-5 sm:bottom-26 sm:right-8 z-40 w-14 h-14 rounded-full sm:rounded-2xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white shadow-xl shadow-violet-950/25 flex items-center justify-center transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-violet-300 outline-none hover:scale-105"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* MODAL: Crear Nuevo Paciente */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8 border border-slate-200">
            <button
              onClick={() => setIsNewPatientModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Crear Nuevo Expediente Clínico</h3>
              <p className="text-xs text-slate-500">
                Ingresa los datos del paciente para aperturar su historia clínica.
              </p>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nombre Completo del Paciente</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej. Natalia Morales Restrepo"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Documento de Identidad</label>
                  <input
                    type="text"
                    value={formDocId}
                    onChange={(e) => setFormDocId(e.target.value)}
                    placeholder="CC 1.020.300.400"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Edad</label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Grupo Sanguíneo</label>
                  <select
                    value={formBloodType}
                    onChange={(e: any) => setFormBloodType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  >
                    <option value="O+">O Positivo (O+)</option>
                    <option value="O-">O Negativo (O-)</option>
                    <option value="A+">A Positivo (A+)</option>
                    <option value="A-">A Negativo (A-)</option>
                    <option value="B+">B Positivo (B+)</option>
                    <option value="B-">B Negativo (B-)</option>
                    <option value="AB+">AB Positivo (AB+)</option>
                    <option value="AB-">AB Negativo (AB-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Procedimiento Quirúrgico Planificado</label>
                  <input
                    type="text"
                    value={formProcedure}
                    onChange={(e) => setFormProcedure(e.target.value)}
                    placeholder="Ej. Rinoplastia Ultrasónica"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Diagnóstico Principal</label>
                <textarea
                  rows={2}
                  value={formDiagnosis}
                  onChange={(e) => setFormDiagnosis(e.target.value)}
                  placeholder="Ej. Giba osteocartilaginosa dorsal y desviación septal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-violet-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-rose-700">
                  Alertas Médicas Críticas / Alergias (separadas por comas)
                </label>
                <input
                  type="text"
                  value={formAlerts}
                  onChange={(e) => setFormAlerts(e.target.value)}
                  placeholder="Ej. Alergia a Penicilina, Hipertensión controlada"
                  className="w-full bg-rose-50/60 border border-rose-300 rounded-xl px-3 py-2.5 text-xs text-rose-800 outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Crear y Abrir Expediente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
