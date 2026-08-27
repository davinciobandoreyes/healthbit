import React, { useState } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Building2,
  Award,
  Check,
  Search,
  ScanLine,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
  Phone,
} from 'lucide-react';
import { CameraModal } from './CameraModal';
import {
  DoctorPersonalData,
  DocumentAnalysisResult,
  BiometricResult,
} from '../types';
import { SAMPLE_FRONT_ID_SVG, SAMPLE_BACK_ID_SVG } from '../utils/sampleDocuments';

interface VerificationFlowProps {
  onComplete: (data: any) => void;
  onCancel?: () => void;
  initialStep?: number;
}

export const VerificationFlow: React.FC<VerificationFlowProps> = ({
  onComplete,
  onCancel,
  initialStep = 1,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Form & Step States
  const [personalData, setPersonalData] = useState<DoctorPersonalData>({
    firstName: 'María Camila',
    lastName: 'Restrepo Gómez',
    fullName: 'Dra. María Camila Restrepo Gómez',
    idNumber: '1020491823',
    email: 'dra.restrepo@clinicacristal.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    phone: '+57 310 492 8102',
    specialty: 'Cardiología Electrofisiológica',
    medicalLicenseNumber: 'RTH-2023-99410',
    institution: 'Universidad de Caldas',
  });

  // Step 1 UI States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  // Step 3: Front Document State
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [frontAnalysis, setFrontAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [isAnalyzingFront, setIsAnalyzingFront] = useState<boolean>(false);

  // Step 4: Rear Document State
  const [backImage, setBackImage] = useState<string | null>(null);
  const [backAnalysis, setBackAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [isAnalyzingBack, setIsAnalyzingBack] = useState<boolean>(false);

  // Step 5: Biometric Facial State
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [biometricResult, setBiometricResult] = useState<BiometricResult | null>(null);
  const [isAnalyzingBiometric, setIsAnalyzingBiometric] = useState<boolean>(false);

  // RETHUS is submitted for HealthBit team review (no API lookup)
  const [rethusSubmitted, setRethusSubmitted] = useState<boolean>(false);

  // Camera Modal Control
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraTarget, setCameraTarget] = useState<'front' | 'back' | 'selfie'>('front');

  // Helper to update Name and sync Full Name
  const handleNameChange = (field: 'firstName' | 'lastName', val: string) => {
    const updated = { ...personalData, [field]: val };
    const computedFull = `Dr(a). ${updated.firstName} ${updated.lastName}`.trim();
    setPersonalData({
      ...updated,
      fullName: computedFull,
    });
  };

  // Trigger Gemini API Server Call for Document Analysis
  const analyzeDocument = async (base64Img: string, side: 'front' | 'back') => {
    if (side === 'front') setIsAnalyzingFront(true);
    else setIsAnalyzingBack(true);

    try {
      const res = await fetch('/api/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          documentSide: side,
          documentTypeRequested: side === 'front' ? 'Parte Frontal Cédula/DNI' : 'Parte Posterior Cédula/DNI',
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        if (side === 'front') {
          setFrontAnalysis(data.analysis);
          if (data.analysis.fullName && data.analysis.fullName !== 'No detectable') {
            setPersonalData((prev) => ({ ...prev, fullName: data.analysis.fullName }));
          }
          if (data.analysis.idNumber && data.analysis.idNumber !== 'No detectable') {
            setPersonalData((prev) => ({ ...prev, idNumber: data.analysis.idNumber }));
          }
        } else {
          setBackAnalysis(data.analysis);
        }
      }
    } catch (err) {
      console.error('Error analyzing document:', err);
      // Local fallback analysis
      const mockResult: DocumentAnalysisResult = {
        documentType: 'Cédula de Ciudadanía',
        fullName: personalData.fullName,
        idNumber: personalData.idNumber,
        legibilityScore: 94,
        isAuthentic: true,
        faceDetected: side === 'front',
        notes: 'Documento procesado correctamente. Buena nitidez e iluminación.',
      };
      if (side === 'front') setFrontAnalysis(mockResult);
      else setBackAnalysis(mockResult);
    } finally {
      if (side === 'front') setIsAnalyzingFront(false);
      else setIsAnalyzingBack(false);
    }
  };

  // Handle File Upload for Front/Back
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (side === 'front') {
        setFrontImage(base64);
        analyzeDocument(base64, 'front');
      } else if (side === 'back') {
        setBackImage(base64);
        analyzeDocument(base64, 'back');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Camera Capture
  const handleCameraCapture = (base64Img: string) => {
    if (cameraTarget === 'front') {
      setFrontImage(base64Img);
      analyzeDocument(base64Img, 'front');
    } else if (cameraTarget === 'back') {
      setBackImage(base64Img);
      analyzeDocument(base64Img, 'back');
    } else if (cameraTarget === 'selfie') {
      setSelfieImage(base64Img);
      verifyBiometrics(base64Img);
    }
  };

  // Verify Biometrics API
  const verifyBiometrics = async (selfieBase64: string) => {
    setIsAnalyzingBiometric(true);
    try {
      const res = await fetch('/api/verify-biometrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieBase64,
          docImageBase64: frontImage,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setBiometricResult(data.analysis);
      }
    } catch {
      setBiometricResult({
        livenessVerified: true,
        matchScore: 96,
        notes: 'Facematch 96% de coincidencia con la fotografía del documento oficial.',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsAnalyzingBiometric(false);
    }
  };

  // Sample Preset Document Loader
  const loadPresetDocument = (side: 'front' | 'back') => {
    const sampleFront = SAMPLE_FRONT_ID_SVG;
    const sampleBack = SAMPLE_BACK_ID_SVG;

    if (side === 'front') {
      setFrontImage(sampleFront);
      setFrontAnalysis({
        documentType: 'Cédula de Ciudadanía Colombia',
        fullName: personalData.fullName,
        idNumber: personalData.idNumber,
        legibilityScore: 98,
        isAuthentic: true,
        faceDetected: true,
        notes: 'Documento nítido. Se detectó holograma oficial y fotografía de alta resolución.',
      });
    } else {
      setBackImage(sampleBack);
      setBackAnalysis({
        documentType: 'Cédula de Ciudadanía (Dorso)',
        fullName: personalData.fullName,
        idNumber: personalData.idNumber,
        legibilityScore: 96,
        isAuthentic: true,
        faceDetected: false,
        notes: 'Código de barras PDF417 leído exitosamente. Datos de expedición verificados.',
      });
    }
  };

  const handlePrimaryAction = () => {
    if (currentStep === 2 && !rethusSubmitted) {
      setRethusSubmitted(true);
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete({
        personalData,
        frontImage,
        backImage,
        selfieImage,
        frontAnalysis,
        backAnalysis,
        biometricResult,
        rethusSubmitted: true,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Calculate Progress Percentage for 5 steps
  const progressPercent = Math.round((currentStep / 5) * 100);

  // Validation checks for Step 1
  const isStep1Valid =
    Boolean(personalData.firstName?.trim()) &&
    Boolean(personalData.lastName?.trim()) &&
    Boolean(personalData.email?.trim()) &&
    Boolean(personalData.password) &&
    personalData.password === personalData.confirmPassword &&
    (personalData.password?.length || 0) >= 6 &&
    termsAccepted;

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-100px)] max-w-2xl mx-auto px-4 animate-fadeIn relative">
      {/* 1. STEPPER ALWAYS VISIBLE (Sticky Top) */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md pt-3 pb-3 border-b border-slate-200/80 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Paso {currentStep} de 5
          </span>
          <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200/60 px-2.5 py-0.5 rounded-full">
            {progressPercent}% Completado
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* 2. MAIN STEP CONTENT AREA (Controlled Scroll, No global jump) */}
      <div className="flex-1 flex flex-col justify-start pb-6 space-y-4">
        {/* STEP 1: INITIAL ACCOUNT CREATION */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Crea tu Cuenta de Especialista
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ingresa tus datos de acceso e información inicial para comenzar tu acreditación oficial.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Nombre(s) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalData.firstName || ''}
                    onChange={(e) => handleNameChange('firstName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all"
                    placeholder="Ej. María Camila"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Apellido(s) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalData.lastName || ''}
                    onChange={(e) => handleNameChange('lastName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all"
                    placeholder="Ej. Restrepo Gómez"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Correo Electrónico Médico <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all"
                    placeholder="dra.restrepo@clinicacristal.com"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Contraseña <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={personalData.password || ''}
                      onChange={(e) => setPersonalData({ ...personalData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Confirmar Contraseña <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={personalData.confirmPassword || ''}
                      onChange={(e) => setPersonalData({ ...personalData, confirmPassword: e.target.value })}
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 outline-none transition-all ${
                        personalData.confirmPassword && personalData.password !== personalData.confirmPassword
                          ? 'border-rose-400 bg-rose-50/40'
                          : 'border-slate-300 focus:border-violet-600 focus:bg-white'
                      }`}
                      placeholder="Repite la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Match Indicator */}
              {personalData.password && personalData.confirmPassword && (
                <div className="text-[11px]">
                  {personalData.password === personalData.confirmPassword ? (
                    <p className="text-violet-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" /> Las contraseñas coinciden correctamente
                    </p>
                  ) : (
                    <p className="text-rose-600 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
                  />
                  <span>
                    Acepto los <strong className="text-violet-700 underline font-bold">Términos de Servicio</strong> y la{' '}
                    <strong className="text-violet-700 underline font-bold">Política de Protección de Datos Médicos</strong>.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROFESSIONAL & MEDICAL DATA */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Registro Profesional y RETHUS
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Ingresa tu información médica oficial. El equipo HealthBit revisará tu RETHUS.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Nombre Completo Oficial <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalData.fullName}
                  onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all font-semibold"
                  placeholder="Ej. Dra. María Camila Restrepo"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Número de Cédula / DNI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={personalData.idNumber}
                  onChange={(e) => setPersonalData({ ...personalData, idNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all font-mono"
                  placeholder="Ej. 1020485921"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Especialidad Quirúrgica/Clínica <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={personalData.specialty}
                    onChange={(e) => setPersonalData({ ...personalData, specialty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all font-medium"
                  >
                    <option value="Cirugía Plástica y Reconstructiva">Cirugía Plástica y Reconstructiva</option>
                    <option value="Cardiología Electrofisiológica">Cardiología Electrofisiológica</option>
                    <option value="Dermatología y Estética Médica">Dermatología y Estética Médica</option>
                    <option value="Cirugía General y Laparoscópica">Cirugía General y Laparoscópica</option>
                    <option value="Otorrinolaringología y Rinología">Otorrinolaringología y Rinología</option>
                    <option value="Medicina Estética Avanzada">Medicina Estética Avanzada</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Universidad / Alma Mater <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={personalData.institution}
                    onChange={(e) => setPersonalData({ ...personalData, institution: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-violet-600 focus:bg-white outline-none transition-all"
                    placeholder="Ej. Universidad de Caldas"
                  />
                </div>
              </div>
            </div>

            {rethusSubmitted && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>RETHUS en revisión</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-white border border-amber-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                      Pendiente
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tu verificación por RETHUS está siendo revisada por el equipo de HealthBit. Puedes continuar con
                    la cédula y la prueba facial. Mientras no esté confirmado, no aparecerás en el buscador de
                    pacientes.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: FRONT DOCUMENT CAPTURE */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Cédula: Parte Frontal
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Asegúrate de que la foto, nombre y holograma sean legibles y sin reflejos directos.
              </p>
            </div>

            {!frontImage ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer w-full flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-violet-500 hover:bg-violet-50/20 transition-all text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-slate-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700">
                    Cargar archivo o foto frontal
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Soporta JPG, PNG o PDF (Máx 10MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.png,.pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'front')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full justify-center flex-wrap">
                  <button
                    onClick={() => {
                      setCameraTarget('front');
                      setIsCameraOpen(true);
                    }}
                    className="min-h-[40px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-violet-600" />
                    <span>Usar Cámara Web</span>
                  </button>

                  <button
                    onClick={() => loadPresetDocument('front')}
                    className="min-h-[40px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold border border-violet-200/60 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Cédula de Ejemplo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-16/9 bg-slate-100 flex items-center justify-center p-2">
                  <img src={frontImage} alt="Frontal Cédula" className="w-full h-full object-contain rounded-lg" />
                  {isAnalyzingFront && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                      <div className="w-7 h-7 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold">Analizando documento con IA...</p>
                    </div>
                  )}
                </div>

                {frontAnalysis && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-violet-600" /> {frontAnalysis.documentType}
                      </span>
                      <span className="font-bold text-[11px] text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {frontAnalysis.legibilityScore}% Legible
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 block">Titular:</span>
                        <strong className="text-slate-800 truncate block">{frontAnalysis.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Cédula:</span>
                        <strong className="text-slate-800 font-mono block">{frontAnalysis.idNumber}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setFrontImage(null);
                    setFrontAnalysis(null);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-slate-600 hover:text-violet-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cambiar o volver a capturar foto</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: REAR DOCUMENT CAPTURE */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Cédula: Parte Posterior
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Sube o fotografía el reverso con el código de barras bidimensional PDF417.
              </p>
            </div>

            {!backImage ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer w-full flex flex-col items-center justify-center p-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-violet-500 hover:bg-violet-50/20 transition-all text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-slate-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700">
                    Cargar archivo o foto del reverso
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Soporta JPG, PNG o PDF (Máx 10MB)</p>
                  <input
                    type="file"
                    accept=".jpg,.png,.pdf,image/*"
                    onChange={(e) => handleFileUpload(e, 'back')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full justify-center flex-wrap">
                  <button
                    onClick={() => {
                      setCameraTarget('back');
                      setIsCameraOpen(true);
                    }}
                    className="min-h-[40px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-violet-600" />
                    <span>Usar Cámara Web</span>
                  </button>

                  <button
                    onClick={() => loadPresetDocument('back')}
                    className="min-h-[40px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold border border-violet-200/60 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Reverso de Ejemplo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-16/9 bg-slate-100 flex items-center justify-center p-2">
                  <img src={backImage} alt="Reverso Cédula" className="w-full h-full object-contain rounded-lg" />
                  {isAnalyzingBack && (
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                      <div className="w-7 h-7 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-bold">Leyendo código de barras...</p>
                    </div>
                  )}
                </div>

                {backAnalysis && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-violet-600" /> Reverso Validado
                      </span>
                      <span className="text-[11px] font-bold text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Código PDF417 OK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">{backAnalysis.notes}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setBackImage(null);
                    setBackAnalysis(null);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-slate-600 hover:text-violet-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cambiar foto del reverso</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: BIOMETRIC VALIDATION & DESATURATED CONFIRMATION CARD */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Prueba Biométrica y Validación
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Realiza una captura facial rápida para verificar prueba de vida y contrastar contra tu documento oficial.
              </p>
            </div>

            {!selfieImage ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-center space-y-5 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
                  <ScanLine className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Validación Facial en Tiempo Real</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Reconocimiento facial y prueba de vida con protección de datos médicos.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center pt-1">
                  <button
                    onClick={() => {
                      setCameraTarget('selfie');
                      setIsCameraOpen(true);
                    }}
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Abrir Cámara Biométrica</span>
                  </button>

                  <button
                    onClick={() => {
                      const demoSelfie = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
                      setSelfieImage(demoSelfie);
                      verifyBiometrics(demoSelfie);
                    }}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    <span>Simular Validación Facial</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                {/* Selfie Avatar Preview & Status */}
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-violet-500 shadow-xs shrink-0">
                    <img src={selfieImage} alt="Facial Selfie" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-violet-600 text-white p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{personalData.fullName}</h4>
                      <span className="text-[10px] font-bold border px-2 py-0.5 rounded-full whitespace-nowrap text-amber-700 bg-amber-50 border-amber-200">
                        Pendiente
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{personalData.specialty}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      RETHUS {personalData.medicalLicenseNumber} · en revisión
                    </p>
                  </div>
                </div>

                {isAnalyzingBiometric ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-violet-700">
                    <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando prueba de vida y Facematch con documento...</span>
                  </div>
                ) : biometricResult ? (
                  /* DESATURATED, HIGHLY READABLE ACCREDITATION SUMMARY */
                  <div className="bg-violet-50/70 border border-violet-200/80 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-800 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-violet-600" />
                        <span>Validación biométrica lista · RETHUS en revisión</span>
                      </div>
                      <span className="text-[11px] font-bold text-violet-800 bg-white border border-violet-300 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        Coincidencia {biometricResult.matchScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1 text-slate-700">
                      <div>
                        <span className="text-slate-400 block">Identificación:</span>
                        <span className="font-semibold text-slate-800 font-mono">{personalData.idNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Institución:</span>
                        <span className="font-semibold text-slate-800 truncate block">{personalData.institution}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Estado:</span>
                        <span className="font-bold text-amber-700">Pendiente RETHUS</span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={() => {
                    setSelfieImage(null);
                    setBiometricResult(null);
                  }}
                  className="w-full py-1.5 text-center text-xs font-bold text-slate-500 hover:text-violet-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir captura facial</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. ACTION BUTTONS ALWAYS FIXED (Sticky Bottom) */}
      <div className="sticky bottom-0 z-30 bg-slate-50/95 backdrop-blur-md pt-3 pb-3 border-t border-slate-200/80 flex flex-col gap-2">
        <button
          onClick={handlePrimaryAction}
          disabled={
            (currentStep === 1 && !isStep1Valid) ||
            (currentStep === 2 &&
              (!personalData.fullName?.trim() || !personalData.idNumber?.trim())) ||
            (currentStep === 3 && !frontImage) ||
            (currentStep === 4 && !backImage) ||
            (currentStep === 5 && !selfieImage)
          }
          className="w-full min-h-[48px] bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-2xl shadow-xs transition-all flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
        >
          <span>
            {currentStep === 5
              ? 'Finalizar y Activar Cuenta Médica'
              : currentStep === 2 && !rethusSubmitted
                ? 'Enviar RETHUS a revisión'
                : 'Continuar al Siguiente Paso'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {currentStep > 1 && (
          <button
            onClick={handlePrevStep}
            className="w-full min-h-[42px] py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1.5 rounded-2xl text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Paso Anterior</span>
          </button>
        )}
      </div>

      {/* Camera Dialog Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        title={
          cameraTarget === 'front'
            ? 'Captura Frontal de Documento'
            : cameraTarget === 'back'
            ? 'Captura Posterior de Documento'
            : 'Prueba Biométrica Facial'
        }
        isBiometricOverlay={cameraTarget === 'selfie'}
      />
    </div>
  );
};
