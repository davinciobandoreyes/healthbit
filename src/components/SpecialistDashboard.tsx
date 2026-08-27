import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  ExternalLink,
  QrCode,
  Building2,
  Sparkles,
  FileBadge,
  UserCheck,
} from 'lucide-react';
import { INITIAL_DOCTORS } from '../data/mockDoctors';

export const SpecialistDashboard: React.FC = () => {
  const doctor = INITIAL_DOCTORS[0]; // Active doctor profile
  const [openAccordion, setOpenAccordion] = useState<string | null>('identity');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner & Doctor Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={doctor.avatarUrl}
              alt={doctor.fullName}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-indigo-600 shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-violet-500 text-white p-1.5 rounded-full shadow-md" title="Nivel 4 Verificado">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                Especialista Verificado RETHUS
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                Nivel 4 / 4 Completo
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{doctor.fullName}</h1>
            <p className="text-sm font-semibold text-slate-600">{doctor.specialty} — {doctor.subspecialty}</p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap justify-center sm:justify-start">
              <span>Registro: <strong className="text-indigo-600 font-bold">{doctor.rethusCode}</strong></span>
              <span>•</span>
              <span>{doctor.institution}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
          >
            <FileBadge className="w-4 h-4 text-amber-300" />
            Ver Certificado Digital
          </button>

          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Enlace de perfil verificado copiado al portapapeles');
            }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-indigo-600 border border-slate-200 font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            Compartir Perfil Público
          </button>
        </div>
      </div>

      {/* Verification Accordion Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 px-1">Estado de Credenciales y Auditoría</h2>

        {/* Accordion Item 1: Identity */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all">
          <button
            onClick={() => toggleAccordion('identity')}
            className="w-full p-6 flex items-center justify-between bg-white hover:bg-slate-50/50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">1. Verificación de Identidad (DNI / Cédula)</h3>
                <p className="text-xs text-slate-400">Documento frontal y posterior escaneados y validados</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full hidden sm:inline-block">
                Verificado con IA
              </span>
              {openAccordion === 'identity' ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {openAccordion === 'identity' && (
            <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block">Lado Frontal:</span>
                  <span className="font-bold text-slate-900">Cédula de Ciudadanía Colombia</span>
                  <p className="text-[11px] text-violet-600 font-semibold pt-1">✓ Legibilidad 98% — Hologramas oficiales detectados</p>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block">Lado Posterior:</span>
                  <span className="font-bold text-slate-900">Código de Barras PDF417</span>
                  <p className="text-[11px] text-violet-600 font-semibold pt-1">✓ Código decodificado correctamente</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item 2: Biometric */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all">
          <button
            onClick={() => toggleAccordion('biometric')}
            className="w-full p-6 flex items-center justify-between bg-white hover:bg-slate-50/50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">2. Validación Biométrica & Prueba de Vida</h3>
                <p className="text-xs text-slate-400">Facematch contra fotografía del documento oficial</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full hidden sm:inline-block">
                Coincidencia 98%
              </span>
              {openAccordion === 'biometric' ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {openAccordion === 'biometric' && (
            <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-indigo-600">Escaneo Liveness Biométrico completado en vivo.</p>
              <p className="text-slate-400">Prueba óptica realizada sin anomalías. Patrón de parpadeo y relieve facial confirmado.</p>
            </div>
          )}
        </div>

        {/* Accordion Item 3: RETHUS */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all">
          <button
            onClick={() => toggleAccordion('rethus')}
            className="w-full p-6 flex items-center justify-between bg-white hover:bg-slate-50/50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">3. Registro Único RETHUS (Ministerio de Salud)</h3>
                <p className="text-xs text-slate-400">Sincronización directa con la base oficial médica</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full hidden sm:inline-block">
                Estado ACTIVO
              </span>
              {openAccordion === 'rethus' ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {openAccordion === 'rethus' && (
            <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs text-slate-600">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Código RETHUS:</span>
                  <span className="font-bold text-indigo-600">{doctor.rethusCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400">Autoridad Emisora:</span>
                  <span className="font-semibold text-slate-800">Colegio Médico Colombiano / MinSalud</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Habilitación Profesional:</span>
                  <span className="font-bold text-violet-600">Sin Sanciones — Vigente</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item 4: Diploma */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all">
          <button
            onClick={() => toggleAccordion('diploma')}
            className="w-full p-6 flex items-center justify-between bg-white hover:bg-slate-50/50 text-left transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">4. Diploma y Acta de Grado Universitario</h3>
                <p className="text-xs text-slate-400">{doctor.institution}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full hidden sm:inline-block">
                Autenticado
              </span>
              {openAccordion === 'diploma' ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
            </div>
          </button>

          {openAccordion === 'diploma' && (
            <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3 text-xs text-slate-600">
              <p className="text-slate-400">Título otorgado de Médico Cirujano y Especialista por la Universidad Nacional.</p>
              <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-md h-48 bg-slate-100">
                <img src={doctor.diplomaUrl} alt="Diploma" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Digital Verification Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative border-2 border-indigo-600">
            <div className="text-center space-y-2 border-b pb-4 border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-100">
                <ShieldCheck className="w-7 h-7 text-amber-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Certificado Digital de Credencial Médica</h3>
              <p className="text-xs text-slate-400">VerifyMD Lovi Clinical System — Token ID: VMD-2026-98124</p>
            </div>

            <div className="space-y-4 text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Médico Titular:</span>
                <span className="font-bold text-indigo-600">{doctor.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Especialidad:</span>
                <span className="font-semibold text-slate-800">{doctor.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RETHUS:</span>
                <span className="font-mono font-bold text-slate-900">{doctor.rethusCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fecha de Verificación:</span>
                <span className="font-semibold text-slate-800">{doctor.verificationDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <p className="text-xs font-bold text-indigo-600">Escaneo de Validación de Paciente</p>
                <p className="text-[11px] text-slate-400">Cualquier paciente puede validar la autenticidad apuntando su cámara.</p>
              </div>
              <div className="w-16 h-16 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-600">
                <QrCode className="w-10 h-10" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert('Certificado descargado en formato PDF seguro con firma criptográfica.')}
                className="flex-1 py-3.5 rounded-full bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
              >
                <Download className="w-4 h-4" />
                Descargar Certificado PDF
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-6 py-3.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

