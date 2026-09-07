import React, { useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Plus, X } from 'lucide-react';
import { PatientRecord } from '../types';
import {
  PATIENT_BLOOD_TYPES,
  PATIENT_EDUCATION_LEVELS,
  PATIENT_EPS,
  PATIENT_GENDERS,
  PATIENT_MARITAL_STATUSES,
} from '../data/patientCatalog';

const fieldClass =
  'w-full min-h-[44px] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-violet-600';

export interface PatientCreatePayload {
  fullName: string;
  documentId: string;
  age: number;
  gender: PatientRecord['gender'];
  bloodType: PatientRecord['bloodType'];
  phone: string;
  city: string;
  occupation?: string;
  origin?: string;
  educationLevel?: string;
  maritalStatus?: string;
  eps?: string;
  primaryDiagnosis: string;
  plannedProcedure: string;
  alerts: string[];
}

interface PatientCreateViewProps {
  onCancel: () => void;
  onSubmit: (payload: PatientCreatePayload) => void;
}

export const PatientCreateView: React.FC<PatientCreateViewProps> = ({ onCancel, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<PatientRecord['gender']>('Femenino');
  const [bloodType, setBloodType] = useState<PatientRecord['bloodType']>('O+');
  const [phone, setPhone] = useState('+57 300 000-0000');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [origin, setOrigin] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [eps, setEps] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [procedure, setProcedure] = useState('Rinoplastia Estructural');
  const [alerts, setAlerts] = useState<string[]>([]);
  const [alertDraft, setAlertDraft] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(true);
  const [alertToRemove, setAlertToRemove] = useState<string | null>(null);
  const composerRef = useRef<HTMLInputElement>(null);

  const focusComposer = () => {
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  const addAlert = () => {
    const next = alertDraft.trim();
    if (!next) {
      setAlertDraft('');
      setIsComposerOpen(false);
      return;
    }

    const exists = alerts.some((alert) => alert.toLowerCase() === next.toLowerCase());
    if (!exists) {
      setAlerts((current) => [...current, next]);
    }
    setAlertDraft('');
    setIsComposerOpen(true);
    focusComposer();
  };

  const openComposer = () => {
    setIsComposerOpen(true);
    focusComposer();
  };

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAlert();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setAlertDraft('');
      setIsComposerOpen(false);
    }
  };

  const confirmRemoveAlert = () => {
    if (!alertToRemove) return;
    setAlerts((current) => current.filter((alert) => alert !== alertToRemove));
    setAlertToRemove(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !documentId.trim()) return;

    const pendingAlert = alertDraft.trim();
    const resolvedAlerts =
      pendingAlert && !alerts.some((alert) => alert.toLowerCase() === pendingAlert.toLowerCase())
        ? [...alerts, pendingAlert]
        : alerts;

    onSubmit({
      fullName: fullName.trim(),
      documentId: documentId.trim(),
      age: Number(age) || 30,
      gender,
      bloodType,
      phone,
      city: city.trim(),
      occupation: occupation.trim() || undefined,
      origin: origin.trim() || undefined,
      educationLevel: educationLevel || undefined,
      maritalStatus: maritalStatus || undefined,
      eps: eps || undefined,
      primaryDiagnosis: diagnosis,
      plannedProcedure: procedure,
      alerts: resolvedAlerts,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-violet-600 transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-violet-50 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-violet-600" />
          </div>
          <span>Volver al Directorio de Pacientes</span>
        </button>
        <div className="sm:text-right">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Nuevo expediente clínico
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Identidad, sociodemográficos y datos clínicos de apertura
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <h2 className="font-extrabold text-sm text-slate-900 border-b pb-3 border-slate-100">
              Identidad
            </h2>

            <div className="space-y-1">
              <label htmlFor="create-name" className="text-xs font-bold text-slate-700">
                Nombre y apellido <span className="text-rose-500">*</span>
              </label>
              <input
                id="create-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Natalia Morales Restrepo"
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-doc" className="text-xs font-bold text-slate-700">
                  Identidad # <span className="text-rose-500">*</span>
                </label>
                <input
                  id="create-doc"
                  type="text"
                  required
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  placeholder="CC 1.020.300.400"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="create-phone" className="text-xs font-bold text-slate-700">
                  Tel / Cel
                </label>
                <input
                  id="create-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label htmlFor="create-age" className="text-xs font-bold text-slate-700">
                  Edad
                </label>
                <input
                  id="create-age"
                  type="number"
                  min={0}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={fieldClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="create-gender" className="text-xs font-bold text-slate-700">
                  Sexo
                </label>
                <select
                  id="create-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as PatientRecord['gender'])}
                  className={fieldClass}
                >
                  {PATIENT_GENDERS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="create-blood" className="text-xs font-bold text-slate-700">
                  Grupo sanguíneo
                </label>
                <select
                  id="create-blood"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as PatientRecord['bloodType'])}
                  className={fieldClass}
                >
                  {PATIENT_BLOOD_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-extrabold text-sm text-slate-900 border-b pb-3 border-slate-100">
            Datos sociodemográficos
          </h2>

          <div className="space-y-1">
            <label htmlFor="create-occupation" className="text-xs font-bold text-slate-700">
              Profesión / ocupación
            </label>
            <input
              id="create-occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Ej. Diseñadora industrial"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="create-origin" className="text-xs font-bold text-slate-700">
              Origen
            </label>
            <input
              id="create-origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Ej. Manizales, Caldas"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="create-city" className="text-xs font-bold text-slate-700">
              Procedencia
            </label>
            <input
              id="create-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej. Medellín, Colombia"
              className={fieldClass}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="create-education" className="text-xs font-bold text-slate-700">
              Escolaridad
            </label>
            <select
              id="create-education"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className={fieldClass}
            >
              <option value="">Seleccionar</option>
              {PATIENT_EDUCATION_LEVELS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="create-marital" className="text-xs font-bold text-slate-700">
              Estado civil
            </label>
            <select
              id="create-marital"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className={fieldClass}
            >
              <option value="">Seleccionar</option>
              {PATIENT_MARITAL_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="create-eps" className="text-xs font-bold text-slate-700">
              EPS
            </label>
            <select
              id="create-eps"
              value={eps}
              onChange={(e) => setEps(e.target.value)}
              className={fieldClass}
            >
              <option value="">Seleccionar</option>
              {PATIENT_EPS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-extrabold text-sm text-slate-900 border-b pb-3 border-slate-100">
            Clínico
          </h2>

          <div className="space-y-1">
            <label htmlFor="create-procedure" className="text-xs font-bold text-slate-700">
              Procedimiento quirúrgico planificado
            </label>
            <input
              id="create-procedure"
              type="text"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              placeholder="Ej. Rinoplastia ultrasónica"
              className={fieldClass}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="create-diagnosis" className="text-xs font-bold text-slate-700">
              Diagnóstico principal
            </label>
            <textarea
              id="create-diagnosis"
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Ej. Giba osteocartilaginosa dorsal y desviación septal"
              className="w-full min-h-[88px] bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-violet-600"
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-extrabold text-sm text-slate-900 border-b pb-3 border-slate-100">
            Alertas médicas
          </h2>

          {alerts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {alerts.map((alert) => (
                <span
                  key={alert}
                  className="inline-flex items-center gap-1.5 min-h-[44px] pl-3 pr-1 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 font-bold text-xs whitespace-nowrap"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{alert}</span>
                  <button
                    type="button"
                    onClick={() => setAlertToRemove(alert)}
                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-amber-700 hover:bg-amber-100 cursor-pointer"
                    aria-label={`Quitar alerta ${alert}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {isComposerOpen ? (
            <div className="flex items-stretch gap-2">
              <input
                ref={composerRef}
                id="create-alerts"
                type="text"
                value={alertDraft}
                onChange={(e) => setAlertDraft(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Ej. Alergia a penicilina"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={addAlert}
                className="min-w-[44px] min-h-[44px] px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white inline-flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Agregar alerta"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              {alerts.length === 0 ? 'Sin alertas. Presiona + para agregar.' : 'Presiona + para agregar otra alerta.'}
            </p>
          )}

          <button
            type="button"
            onClick={openComposer}
            className="min-h-[44px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agregar nueva alerta médica
          </button>
        </section>
      </div>

      {alertToRemove !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-alert-title"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 max-w-sm w-full shadow-xl space-y-4"
          >
            <h3 id="remove-alert-title" className="text-sm font-extrabold text-slate-900">
              ¿Quitar esta alerta?
            </h3>
            <p className="text-xs text-slate-600 font-medium">{alertToRemove}</p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAlertToRemove(null)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmRemoveAlert}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs cursor-pointer"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer"
        >
          Crear y abrir expediente
        </button>
      </div>
    </form>
  );
};
