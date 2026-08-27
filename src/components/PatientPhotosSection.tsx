import React, { useState } from 'react';
import {
  Users,
  Plus,
  Calendar,
  Camera,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  X,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { PatientCase, PatientEvolutionEntry } from '../types';
import { INITIAL_PATIENT_CASES } from '../data/portalData';

export const PatientPhotosSection: React.FC = () => {
  const [cases, setCases] = useState<PatientCase[]>(INITIAL_PATIENT_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(INITIAL_PATIENT_CASES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [comparatorActive, setComparatorActive] = useState(false);

  // New Case Form
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientId, setNewPatientId] = useState('');
  const [newProcedure, setNewProcedure] = useState('Rinoplastia Estética y Funcional');
  const [newSurgeryDate, setNewSurgeryDate] = useState('2026-08-01');

  // New Evolution Entry Form
  const [newDayLabel, setNewDayLabel] = useState('Día 7 Post-Op');
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');
  const [isFinalResultCheckbox, setIsFinalResultCheckbox] = useState(false);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const filteredCases = cases.filter(
    (c) =>
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;

    const createdCase: PatientCase = {
      id: `case-${Date.now()}`,
      patientName: newPatientName,
      patientId: newPatientId || `CC ${Math.floor(100000000 + Math.random() * 900000000)}`,
      procedure: newProcedure,
      surgeryDate: newSurgeryDate,
      status: 'in_progress',
      preOpPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      evolution: [
        {
          id: `evo-${Date.now()}`,
          dayLabel: 'Pre-Operatorio',
          date: newSurgeryDate,
          photos: [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
          ],
          clinicalNotes: 'Registro fotográfico inicial antes del procedimiento quirúrgico.',
        },
      ],
    };

    setCases([createdCase, ...cases]);
    setSelectedCaseId(createdCase.id);
    setIsNewCaseModalOpen(false);
    setNewPatientName('');
    setNewPatientId('');
  };

  const handleAddEvolutionEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes) return;

    const newEntry: PatientEvolutionEntry = {
      id: `evo-${Date.now()}`,
      dayLabel: newDayLabel,
      date: newEntryDate,
      photos: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      ],
      clinicalNotes: newNotes,
      isFinalResult: isFinalResultCheckbox,
    };

    const updatedCases = cases.map((c) => {
      if (c.id === selectedCase.id) {
        return {
          ...c,
          status: isFinalResultCheckbox ? ('completed' as const) : c.status,
          finalPhoto: isFinalResultCheckbox
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
            : c.finalPhoto,
          evolution: [...c.evolution, newEntry],
        };
      }
      return c;
    });

    setCases(updatedCases);
    setIsAddEntryModalOpen(false);
    setNewNotes('');
    setIsFinalResultCheckbox(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Actions */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
              Gestión Clínica y Evolución
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fotos y Casos de Pacientes
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Crea expedientes fotográficos, registra la evolución postquirúrgica día a día y compara los resultados estéticos finales.
          </p>
        </div>

        <button
          onClick={() => setIsNewCaseModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5 text-violet-400" />
          <span>Crear Caso de Paciente</span>
        </button>
      </div>

      {/* 2. Main Workspace (2 Columns: Case List + Case Detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cases Sidebar List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar paciente o cirugía..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-purple-600"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredCases.map((patientCase) => {
                const isSelected = patientCase.id === selectedCase.id;
                return (
                  <div
                    key={patientCase.id}
                    onClick={() => setSelectedCaseId(patientCase.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50/70 border-purple-300 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-bold text-slate-900 text-sm">
                        {patientCase.patientName}
                      </h4>
                      {patientCase.status === 'completed' ? (
                        <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                          Alta ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Evolución
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-2">
                      {patientCase.procedure}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{patientCase.patientId}</span>
                      <span>{patientCase.evolution.length} registros</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Case Evolution & Photo Gallery (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Case Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-slate-900">
                  {selectedCase.patientName}
                </h2>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  ({selectedCase.patientId})
                </span>
              </div>
              <p className="text-xs font-semibold text-purple-700">
                {selectedCase.procedure} • Fecha Cirugía: {selectedCase.surgeryDate}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setComparatorActive(!comparatorActive)}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  comparatorActive
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{comparatorActive ? 'Ver Línea de Tiempo' : 'Comparar Antes / Después'}</span>
              </button>

              <button
                onClick={() => setIsAddEntryModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Foto / Día</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Before / After Visual Comparator */}
          {comparatorActive ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Comparativa de Resultados Quirúrgicos
                </h3>
                <span className="text-xs text-slate-400">Visualización Simultánea</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pre-Op Photo */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Fotografía Pre-Operatoria (Línea Base)
                  </span>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                    <img
                      src={selectedCase.preOpPhoto || selectedCase.evolution[0]?.photos[0]}
                      alt="Pre-Op"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      Pre-Cx • {selectedCase.surgeryDate}
                    </div>
                  </div>
                </div>

                {/* Final / Latest Photo */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                    Resultado Final / Última Evolución
                  </span>
                  <div className="aspect-4/3 rounded-2xl overflow-hidden border border-purple-200 bg-purple-50 relative group">
                    <img
                      src={
                        selectedCase.finalPhoto ||
                        selectedCase.evolution[selectedCase.evolution.length - 1]?.photos[0]
                      }
                      alt="Resultado Final"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-purple-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {selectedCase.status === 'completed'
                        ? 'Resultado Final Satisfactorio'
                        : 'Evolución Actual'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Timeline of Evolution Entries */
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Línea de Evolución y Notas Médicas Diarias ({selectedCase.evolution.length} Hitos)
              </h3>

              {selectedCase.evolution.map((entry, index) => (
                <div
                  key={entry.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {entry.dayLabel}
                        </h4>
                        <span className="text-[11px] text-slate-400">{entry.date}</span>
                      </div>
                    </div>

                    {entry.isFinalResult && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Resultado Final Certificado
                      </span>
                    )}
                  </div>

                  {/* Photo Gallery for this Day */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {entry.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        className="aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group"
                      >
                        <img
                          src={photo}
                          alt={`${entry.dayLabel} - ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Clinical Notes */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Nota de Evolución Médica
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {entry.clinicalNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create New Case */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 text-lg">Crear Nuevo Caso Clínico</h3>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Paciente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Valentina Morales"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Número de Documento / Cédula</label>
                <input
                  type="text"
                  placeholder="Ej. CC 1.032.485.912"
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Procedimiento Quirúrgico *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mamoplastia de Aumento / Rinoplastia"
                  value={newProcedure}
                  onChange={(e) => setNewProcedure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-purple-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha de la Cirugía *</label>
                <input
                  type="date"
                  required
                  value={newSurgeryDate}
                  onChange={(e) => setNewSurgeryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Crear Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Evolution Entry / Day Photos */}
      {isAddEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Agregar Fotografía y Nota Médica</h3>
                <p className="text-xs text-slate-500">Paciente: {selectedCase.patientName}</p>
              </div>
              <button
                onClick={() => setIsAddEntryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvolutionEntry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Etapa / Día de Control *</label>
                  <select
                    value={newDayLabel}
                    onChange={(e) => setNewDayLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-xs font-semibold focus:bg-white focus:outline-purple-600"
                  >
                    <option value="Día 1 Post-Op">Día 1 Post-Op</option>
                    <option value="Día 3 Post-Op">Día 3 Post-Op</option>
                    <option value="Día 7 Post-Op">Día 7 Post-Op (Retiro puntos)</option>
                    <option value="Día 15 Post-Op">Día 15 Post-Op</option>
                    <option value="Día 30 Post-Op">Día 30 Post-Op (1 Mes)</option>
                    <option value="Día 90 Post-Op">Día 90 Post-Op (3 Meses)</option>
                    <option value="Resultado Final (6 Meses / 1 Año)">Resultado Final</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de la Fotografía *</label>
                  <input
                    type="date"
                    required
                    value={newEntryDate}
                    onChange={(e) => setNewEntryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-purple-600"
                  />
                </div>
              </div>

              {/* Photo upload placeholder */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fotografía Clínica *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50">
                  <Camera className="w-7 h-7 text-purple-600 mb-1" />
                  <span className="font-bold text-slate-800 text-xs">Capturar o seleccionar foto</span>
                  <span className="text-[10px] text-slate-400">Formatos JPG, PNG con buena iluminación</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nota Clínica de Evolución *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej. Retiro de apósitos, evolución del edema, respuesta tisular y recomendaciones indicadas..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs font-medium focus:bg-white focus:outline-purple-600"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="finalResultCheck"
                  checked={isFinalResultCheckbox}
                  onChange={(e) => setIsFinalResultCheckbox(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="finalResultCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Marcar como Fotografía de Resultado Final (Alta Médica)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEntryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                >
                  Guardar Evolución
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
