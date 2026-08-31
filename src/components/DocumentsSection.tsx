import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  ShieldCheck,
  Award,
  Search,
  FileCheck,
  X,
} from 'lucide-react';
import { DoctorDocument } from '../types';
import { INITIAL_DOCTOR_DOCUMENTS } from '../data/portalData';

export const DocumentsSection: React.FC = () => {
  const [documents, setDocuments] = useState<DoctorDocument[]>(INITIAL_DOCTOR_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DoctorDocument | null>(null);

  // New Document Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DoctorDocument['category']>('diploma');
  const [newIssuer, setNewIssuer] = useState('');
  const [newIssueYear, setNewIssueYear] = useState('2026');
  const [selectedFileName, setSelectedFileName] = useState('');

  const normalizeStr = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredDocuments = documents.filter((doc) => {
    const q = normalizeStr(searchQuery);
    const matchesQuery =
      normalizeStr(doc.title).includes(q) ||
      normalizeStr(doc.issuer).includes(q) ||
      normalizeStr(doc.category).includes(q);

    if (!matchesQuery) return false;

    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'verified') return doc.status === 'verified';
    if (selectedFilter === 'pending') return doc.status === 'pending';
    return doc.category === selectedFilter;
  });

  const getCategoryLabel = (category: DoctorDocument['category']) => {
    switch (category) {
      case 'identity':
        return 'Cédula';
      case 'rethus':
        return 'RETHUS';
      case 'diploma':
        return 'Diploma';
      case 'specialty':
        return 'Especialidad';
      case 'certification':
        return 'Certificación';
      default:
        return 'Documento';
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newIssuer) return;

    const newDoc: DoctorDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      issuer: newIssuer,
      issueYear: newIssueYear,
      status: 'pending',
      fileType: selectedFileName.endsWith('.pdf') ? 'pdf' : 'image',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      uploadDate: new Date().toISOString().split('T')[0],
      verificationBadge: 'En cola de verificación RETHUS',
    };

    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
    setNewTitle('');
    setNewIssuer('');
    setSelectedFileName('');
  };

  return (
    <div className="space-y-5 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif] relative pb-10">
      {/* 1. Header Compacto */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Documentos y Acreditaciones
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Expedientes oficiales, diplomas y registros RETHUS validados
          </p>
        </div>
        <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200/80 px-2.5 py-1 rounded-xl shrink-0 whitespace-nowrap hidden sm:inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" /> Expediente Verificado
        </span>
      </div>

      {/* 2. Sistema de Filtros Unificado (Igual a Pacientes) */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, entidad emisora o categoría..."
            className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-violet-600 shadow-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'verified', label: 'Acreditados' },
            { id: 'pending', label: 'En Revisión' },
            { id: 'specialty', label: 'Especialidad' },
            { id: 'diploma', label: 'Diplomas' },
            { id: 'rethus', label: 'RETHUS' },
            { id: 'identity', label: 'Cédula' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Document Cards Grid (Compacto, horizontal y optimizado) */}
      {filteredDocuments.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center space-y-2 max-w-md mx-auto">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm">No se encontraron documentos</h3>
          <p className="text-xs text-slate-500">
            Intenta con otro término de búsqueda o sube un nuevo soporte.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-fadeIn">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:border-violet-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
            >
              {/* Header: Icono + Título + Status Badge */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      doc.status === 'verified'
                        ? 'bg-violet-50 text-violet-600 border border-violet-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                  >
                    {doc.category === 'rethus' ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : doc.category === 'specialty' || doc.category === 'diploma' ? (
                      <Award className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {getCategoryLabel(doc.category)} • {doc.issueYear}
                      </span>
                    </div>
                    <h3
                      className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-violet-700 transition-colors"
                      title={doc.title}
                    >
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5" title={doc.issuer}>
                      {doc.issuer}
                    </p>
                  </div>
                </div>

                {doc.status === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3 text-violet-600" /> Acreditado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    <Clock className="w-3 h-3 text-amber-600" /> En Revisión
                  </span>
                )}
              </div>

              {/* Footer: Microinfo + Botones de Acción Cortos */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
                  {doc.verificationBadge || `Cargado: ${doc.uploadDate}`}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ver</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Descargando soporte: ${doc.title}`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold transition-all border border-violet-200/60 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-violet-600" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Botón flotante fijo a la derecha, sobre la tab bar */}
      <div className="fixed inset-x-0 bottom-20 sm:bottom-22 lg:bottom-6 z-40 pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="pointer-events-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 sm:px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 border border-violet-500/40 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Subir documento</span>
          </button>
        </div>
      </div>

      {/* 5. Modal de Subida de Documentos */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Subir Soporte Médico</h3>
                  <p className="text-xs text-slate-500">Agrega diplomas, actas o certificados</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nombre del Documento / Título *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Especialidad en Cirugía Plástica"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs sm:text-sm font-medium focus:bg-white focus:outline-violet-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs font-semibold focus:bg-white focus:outline-violet-600"
                  >
                    <option value="diploma">Diploma de Grado</option>
                    <option value="specialty">Título de Especialidad</option>
                    <option value="certification">Certificación / Fellowship</option>
                    <option value="rethus">Soporte RETHUS</option>
                    <option value="identity">Cédula de Ciudadanía</option>
                    <option value="other">Otro Soporte</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Año de Expedición *</label>
                  <input
                    type="number"
                    required
                    min="1980"
                    max="2026"
                    value={newIssueYear}
                    onChange={(e) => setNewIssueYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs sm:text-sm font-medium focus:bg-white focus:outline-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Universidad o Institución Emisora *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Universidad Nacional de Colombia"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs sm:text-sm font-medium focus:bg-white focus:outline-violet-600"
                />
              </div>

              {/* File Dropzone */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Archivo Adjunto *</label>
                <label className="border-2 border-dashed border-slate-200 hover:border-violet-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/60">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <Upload className="w-6 h-6 text-violet-600 mb-1.5" />
                  <span className="font-bold text-slate-800 text-xs truncate max-w-full">
                    {selectedFileName || 'Seleccionar archivo o arrastrar aquí'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    PDF, JPG o PNG (Máx 15MB)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-all text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all text-xs shadow-sm shadow-violet-600/20 cursor-pointer"
                >
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileCheck className="w-5 h-5 text-violet-600 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{previewDoc.title}</h3>
                  <span className="text-xs text-slate-500 truncate block">
                    {previewDoc.issuer} • {previewDoc.issueYear}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 my-3 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-3 border border-slate-200">
              <img
                src={previewDoc.fileUrl}
                alt={previewDoc.title}
                className="max-h-[45vh] object-contain rounded-lg shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-violet-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Acreditado oficialmente
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

