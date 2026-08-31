export type VerificationStepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type DegreeDocumentKind = 'diploma' | 'acta';
export type DegreeDocumentScope = 'medico' | 'especializacion';

export interface DegreeDocumentFile {
  id: string;
  kind: DegreeDocumentKind;
  scope: DegreeDocumentScope;
  fileName: string;
  mimeType: string;
  previewUrl: string;
  sizeBytes: number;
}

export interface DoctorPersonalData {
  firstName: string;
  lastName: string;
  fullName: string;
  idNumber: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  specialty: string;
  medicalLicenseNumber: string;
  institution: string;
}

export interface DocumentAnalysisResult {
  documentType: string;
  fullName: string;
  idNumber: string;
  issueDate?: string;
  legibilityScore: number;
  isAuthentic: boolean;
  notes: string;
  faceDetected: boolean;
  rawAnalysis?: string;
}

export interface BiometricResult {
  livenessVerified: boolean;
  matchScore: number;
  notes: string;
  timestamp: string;
}

export interface RethusVerificationResult {
  isRegistered: boolean;
  skipped?: boolean;
  rethusCode: string;
  fullName: string;
  profession: string;
  specialties: string[];
  status: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  expeditionDate: string;
  authority: string;
  notes?: string;
}

export type RethusReviewStatus = 'pending' | 'approved' | 'denied';

export interface PendingRethusReview {
  id: string;
  fullName: string;
  idNumber: string;
  rethusCode: string;
  specialty: string;
  email: string;
  phone: string;
  institution: string;
  submittedAt: string;
  status: RethusReviewStatus;
  frontImage?: string | null;
  backImage?: string | null;
  selfieImage?: string | null;
  frontAnalysis?: DocumentAnalysisResult | null;
  backAnalysis?: DocumentAnalysisResult | null;
  biometricResult?: BiometricResult | null;
  isPaused?: boolean;
}

export interface DoctorProfile {
  id: string;
  fullName: string;
  specialty: string;
  subspecialty?: string;
  rethusCode: string;
  idNumber: string;
  institution: string;
  avatarUrl: string;
  verificationLevel: 1 | 2 | 3 | 4;
  verificationDate: string;
  rating: number;
  reviewsCount: number;
  biography: string;
  diplomaUrl?: string;
  location: string;
  phone: string;
  email: string;
  verifiedStatus: {
    identityFront: boolean;
    identityBack: boolean;
    biometrics: boolean;
    rethus: boolean;
    diploma: boolean;
  };
  rethusReviewStatus?: RethusReviewStatus;
  isPaused?: boolean;
}

export type DoctorPortalTab = 'home' | 'documents' | 'patients' | 'patient-photos' | 'settings';

export type DateRangePreset = '7d' | '3d' | '30d' | '90d' | 'custom';

export interface DoctorMetricItem {
  date: string;
  appointments: number;
  reviews: number;
  profileViews: number;
}

export interface DoctorDocument {
  id: string;
  title: string;
  category: 'identity' | 'rethus' | 'diploma' | 'specialty' | 'certification' | 'other';
  issuer: string;
  issueYear: string;
  status: 'verified' | 'pending' | 'rejected';
  fileType: 'pdf' | 'image';
  fileUrl: string;
  uploadDate: string;
  verificationBadge?: string;
}

// ----------------------------------------------------
// Health Tech: Patient Record, SOAP Notes & Surgical History
// ----------------------------------------------------

export type PatientStatus = 'pre_op' | 'post_op_active' | 'in_recovery' | 'completed' | 'on_hold';

export interface ClinicalSOAPContent {
  subjective: string; // S: Motivo, síntomas referidos por paciente
  objective: string;  // O: Signos vitales, examen físico, cicatrización, edema
  assessment: string; // A: Diagnóstico evolutivo, estado del injerto/herida
  plan: string;       // P: Medicación, curaciones, férulas, próxima cita
}

export interface ClinicalNote {
  id: string;
  date: string;
  time: string;
  authorName: string;
  authorRole: string;
  noteType: 'consulta_inicial' | 'control_postoperatorio' | 'nota_quirurgica' | 'urgencia' | 'alta_medica';
  title: string;
  soap: ClinicalSOAPContent;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weightKg?: number;
  };
  attachments?: string[];
}

export interface SurgicalProcedureRecord {
  id: string;
  procedureName: string;
  date: string;
  operatingRoom: string;
  anesthesiaType: 'general' | 'sedacion_local' | 'regional' | 'local';
  durationMinutes: number;
  leadSurgeon: string;
  assistantSurgeon?: string;
  anesthesiologist?: string;
  surgicalFindings: string;
  implantsUsed?: string;
  complications: string;
  postOpIndications: string;
  status: 'programada' | 'completada' | 'en_curso' | 'cancelada';
}

export interface ClinicalPhoto {
  id: string;
  url: string;
  stage: 'pre_op' | 'intra_op' | 'post_op_inmediato' | 'control_7d' | 'control_30d' | 'control_90d' | 'final';
  angle: 'frontal' | 'perfil_derecho' | 'perfil_izquierdo' | 'oblicua_derecha' | 'oblicua_izquierda' | 'basal' | 'detalle';
  date: string;
  notes?: string;
}

export interface PatientEvolutionEntry {
  id: string;
  dayLabel: string;
  date: string;
  photos: string[];
  clinicalNotes: string;
  isFinalResult?: boolean;
}

export interface PatientRecord {
  id: string;
  fullName: string;
  documentId: string;
  birthDate: string;
  age: number;
  gender: 'Femenino' | 'Masculino' | 'Otro';
  bloodType: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  phone: string;
  email: string;
  city: string;
  address?: string;
  occupation?: string;
  avatarUrl: string;
  primaryDiagnosis: string;
  plannedProcedure: string;
  status: PatientStatus;
  
  // High Priority Health Tech Alerts
  criticalAlerts: string[]; // e.g. ["Alergia a AINEs", "Hipertensión Grado 1"]
  
  // Background & Medical History (Anamnesis)
  medicalHistory: {
    pathological: string[];
    surgical: string[];
    allergic: string[];
    pharmacological: string[];
    familyHistory: string[];
    lifestyle: {
      smoker: boolean;
      alcohol: boolean;
      physicalActivity: string;
    };
  };

  notes: ClinicalNote[];
  procedures: SurgicalProcedureRecord[];
  photos: ClinicalPhoto[];
  
  // Backward compatibility with previous evolution gallery
  evolution: PatientEvolutionEntry[];
}

export interface PatientCase {
  id: string;
  patientName: string;
  patientId: string;
  procedure: string;
  surgeryDate: string;
  preOpPhoto?: string;
  finalPhoto?: string;
  status: 'in_progress' | 'completed';
  evolution: PatientEvolutionEntry[];
}
