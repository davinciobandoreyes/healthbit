import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { HomeDashboard } from './components/HomeDashboard';
import { DocumentsSection } from './components/DocumentsSection';
import { PatientsSection } from './components/PatientsSection';
import { SettingsSection } from './components/SettingsSection';
import { VerificationFlow } from './components/VerificationFlow';
import { PatientDirectory } from './components/PatientDirectory';
import { DoctorAuthModal } from './components/DoctorAuthModal';
import { AdminRethusQueue } from './components/AdminRethusQueue';
import { DoctorProfile, DoctorPortalTab, PendingRethusReview, DegreeDocumentFile } from './types';
import { INITIAL_DOCTORS } from './data/mockDoctors';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const isHealthbitAdminEmail = (email: string) =>
  email.trim().toLowerCase().endsWith('@healthbit.co');

const DEFAULT_DOCTOR: DoctorProfile = {
  id: 'doc-camila-restrepo',
  fullName: 'Dra. María Camila Restrepo Gómez',
  specialty: 'Cirugía Plástica, Estética y Reconstructiva',
  subspecialty: 'Microcirugía y Rinoplastia Ultrasónica',
  rethusCode: 'RTH-2021-89412',
  idNumber: '1.020.485.912',
  institution: 'Hospital Universitario San Ignacio • Pontificia Univ. Javeriana',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  verificationLevel: 4,
  verificationDate: '13 Ago 2026',
  rating: 4.9,
  reviewsCount: 36,
  biography: 'Especialista en cirugía plástica facial y reconstructiva certificada por RETHUS y la Sociedad Colombiana de Cirugía Plástica (SCCP).',
  location: 'Bogotá D.C., Colombia',
  phone: '+57 312 456 7890',
  email: 'dra.restrepo@javeriana.edu.co',
  verifiedStatus: {
    identityFront: true,
    identityBack: true,
    biometrics: true,
    rethus: true,
    diploma: true,
  },
  rethusReviewStatus: 'approved',
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const reviewsFromListedDoctors = (docs: DoctorProfile[]): PendingRethusReview[] =>
  docs.map((doc) => ({
    id: doc.id,
    fullName: doc.fullName,
    idNumber: doc.idNumber,
    rethusCode: doc.rethusCode,
    specialty: doc.specialty,
    email: doc.email,
    phone: doc.phone,
    institution: doc.institution,
    submittedAt: new Date().toISOString(),
    status: 'approved',
    isPaused: Boolean(doc.isPaused),
    selfieImage: doc.avatarUrl,
  }));

export default function App() {
  const [viewMode, setViewMode] = useState<
    'portal' | 'public_directory' | 'verification_flow' | 'admin_review'
  >('portal');
  const [currentTab, setCurrentTab] = useState<DoctorPortalTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [verificationInitialStep, setVerificationInitialStep] = useState<number>(1);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);

  const [doctor, setDoctor] = useState<DoctorProfile>(DEFAULT_DOCTOR);
  const [sessionDoctors, setSessionDoctors] = useState<Record<string, DoctorProfile>>({
    [normalizeEmail(DEFAULT_DOCTOR.email)]: DEFAULT_DOCTOR,
  });
  const [directoryDoctors, setDirectoryDoctors] = useState<DoctorProfile[]>(INITIAL_DOCTORS);
  const [pendingRethusReviews, setPendingRethusReviews] = useState<PendingRethusReview[]>(() =>
    reviewsFromListedDoctors(INITIAL_DOCTORS)
  );
  const [emailNotices, setEmailNotices] = useState<Record<string, string>>({});
  const [adminMailNotice, setAdminMailNotice] = useState<string | null>(null);

  const upsertSessionDoctor = (profile: DoctorProfile) => {
    setSessionDoctors((prev) => ({ ...prev, [normalizeEmail(profile.email)]: profile }));
  };

  const handleUpdateDoctor = (updated: Partial<DoctorProfile>) => {
    setDoctor((prev) => {
      const next = { ...prev, ...updated };
      upsertSessionDoctor(next);
      return next;
    });
  };

  const handleLogout = () => {
    setViewMode('public_directory');
    setCurrentTab('home');
    setVerificationSuccess(false);
  };

  const handleLoginSuccess = (email: string) => {
    const normalized = normalizeEmail(email);
    setVerificationSuccess(false);
    setCurrentTab('home');

    if (isHealthbitAdminEmail(normalized)) {
      setViewMode('admin_review');
      return;
    }

    const known = sessionDoctors[normalized];
    if (known) setDoctor(known);
    setViewMode('portal');
  };

  const handleStartRegistration = (step = 1) => {
    setVerificationInitialStep(step);
    setViewMode('verification_flow');
  };

  const handleVerificationComplete = (data: any) => {
    const personal = data?.personalData;
    const degreeDocuments: DegreeDocumentFile[] = Array.isArray(data?.degreeDocuments)
      ? data.degreeDocuments
      : [];
    const firstDiploma = degreeDocuments.find((doc) => doc.kind === 'diploma');
    const registered: DoctorProfile = {
      ...DEFAULT_DOCTOR,
      id: `doc-reg-${Date.now()}`,
      fullName: personal?.fullName || DEFAULT_DOCTOR.fullName,
      email: personal?.email || DEFAULT_DOCTOR.email,
      phone: personal?.phone || DEFAULT_DOCTOR.phone,
      specialty: personal?.specialty || DEFAULT_DOCTOR.specialty,
      institution: personal?.institution || DEFAULT_DOCTOR.institution,
      idNumber: personal?.idNumber || DEFAULT_DOCTOR.idNumber,
      rethusCode: personal?.medicalLicenseNumber || DEFAULT_DOCTOR.rethusCode,
      avatarUrl: data?.selfieImage || DEFAULT_DOCTOR.avatarUrl,
      diplomaUrl: firstDiploma?.previewUrl || DEFAULT_DOCTOR.diplomaUrl,
      verificationLevel: 3,
      verificationDate: new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      rating: 0,
      reviewsCount: 0,
      verifiedStatus: {
        identityFront: true,
        identityBack: true,
        biometrics: true,
        rethus: false,
        diploma: false,
      },
      rethusReviewStatus: 'pending',
    };

    setDoctor(registered);
    upsertSessionDoctor(registered);
    setPendingRethusReviews((prev) => [
      {
        id: registered.id,
        fullName: registered.fullName,
        idNumber: registered.idNumber,
        rethusCode: registered.rethusCode,
        specialty: registered.specialty,
        email: registered.email,
        phone: registered.phone,
        institution: registered.institution,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        frontImage: data?.frontImage || null,
        backImage: data?.backImage || null,
        selfieImage: data?.selfieImage || null,
        frontAnalysis: data?.frontAnalysis || null,
        backAnalysis: data?.backAnalysis || null,
        biometricResult: data?.biometricResult || null,
      },
      ...prev.filter((item) => normalizeEmail(item.email) !== normalizeEmail(registered.email)),
    ]);
    setVerificationSuccess(true);
    setViewMode('portal');
  };

  const applyRethusDecision = (review: PendingRethusReview, approved: boolean) => {
    const emailKey = normalizeEmail(review.email);
    const nextStatus = approved ? 'approved' : 'denied';

    setPendingRethusReviews((prev) =>
      prev.map((item) =>
        item.id === review.id ? { ...item, status: nextStatus, isPaused: approved ? false : item.isPaused } : item
      )
    );

    const patchProfile = (profile: DoctorProfile): DoctorProfile => ({
      ...profile,
      verifiedStatus: { ...profile.verifiedStatus, rethus: approved },
      rethusReviewStatus: nextStatus,
      isPaused: approved ? false : profile.isPaused,
    });

    setSessionDoctors((prev) => {
      const current = prev[emailKey];
      if (!current) return prev;
      return { ...prev, [emailKey]: patchProfile(current) };
    });

    setDoctor((prev) => (normalizeEmail(prev.email) === emailKey ? patchProfile(prev) : prev));

    if (approved) {
      const fromSession = sessionDoctors[emailKey];
      const listed: DoctorProfile = patchProfile(
        fromSession || {
          ...DEFAULT_DOCTOR,
          id: review.id,
          fullName: review.fullName,
          idNumber: review.idNumber,
          rethusCode: review.rethusCode,
          specialty: review.specialty,
          email: review.email,
          phone: review.phone,
          institution: review.institution,
        }
      );
      setDirectoryDoctors((prev) => {
        if (prev.some((doc) => doc.id === listed.id || normalizeEmail(doc.email) === emailKey)) {
          return prev.map((doc) =>
            doc.id === listed.id || normalizeEmail(doc.email) === emailKey ? listed : doc
          );
        }
        return [listed, ...prev];
      });
      const notice = `Tu RETHUS fue verificado. Te enviamos un aviso a ${review.email}. En esta demo no se envía un correo real.`;
      setEmailNotices((prev) => ({ ...prev, [emailKey]: notice }));
      setAdminMailNotice(
        `Se avisó a ${review.email} que su RETHUS fue verificado. En esta demo no se envía un correo real.`
      );
    } else {
      setDirectoryDoctors((prev) =>
        prev.filter((doc) => doc.id !== review.id && normalizeEmail(doc.email) !== emailKey)
      );
    }
  };

  const toggleDoctorPause = (review: PendingRethusReview, paused: boolean) => {
    const emailKey = normalizeEmail(review.email);
    const patch = (profile: DoctorProfile): DoctorProfile => ({ ...profile, isPaused: paused });

    setPendingRethusReviews((prev) =>
      prev.map((item) => (item.id === review.id ? { ...item, isPaused: paused } : item))
    );
    setDirectoryDoctors((prev) =>
      prev.map((doc) =>
        doc.id === review.id || normalizeEmail(doc.email) === emailKey ? patch(doc) : doc
      )
    );
    setSessionDoctors((prev) => {
      const current = prev[emailKey];
      if (!current) return prev;
      return { ...prev, [emailKey]: patch(current) };
    });
    setDoctor((prev) => (normalizeEmail(prev.email) === emailKey ? patch(prev) : prev));
    setAdminMailNotice(
      paused
        ? `${review.fullName} quedó pausado y ya no aparece en el buscador.`
        : `${review.fullName} fue reactivado y vuelve a aparecer en el buscador.`
    );
  };

  if (viewMode === 'public_directory') {
    return (
      <div className="min-h-screen bg-slate-50">
        <PatientDirectory
          doctors={directoryDoctors}
          onOpenDoctorAuth={() => setIsAuthModalOpen(true)}
        />
        <DoctorAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onStartRegistration={handleStartRegistration}
        />
      </div>
    );
  }

  if (viewMode === 'admin_review') {
    return (
      <AdminRethusQueue
        reviews={pendingRethusReviews}
        mailNotice={adminMailNotice}
        onClearMailNotice={() => setAdminMailNotice(null)}
        onConfirm={(review) => applyRethusDecision(review, true)}
        onDeny={(review) => applyRethusDecision(review, false)}
        onTogglePause={toggleDoctorPause}
        onLogout={handleLogout}
      />
    );
  }

  if (viewMode === 'verification_flow') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900">
                Health<span className="text-violet-600">Bit</span>
              </span>
              <span className="text-xs font-bold text-slate-400">| Registro y Validación Médica</span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <VerificationFlow
            onComplete={handleVerificationComplete}
            onCancel={() => setViewMode('public_directory')}
            initialStep={verificationInitialStep}
          />
        </main>
      </div>
    );
  }

  if (verificationSuccess) {
    const rethusPending = !doctor.verifiedStatus.rethus;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn">
        <div className="w-full max-w-md mx-auto flex items-center pt-2 pb-4">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              Health<span className="text-violet-600">Bit</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">| Acreditación</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200/60 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Identidad Verificada
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {rethusPending
                ? 'Tu cuenta está lista. El equipo HealthBit revisará tu RETHUS. Mientras tanto no apareces en el buscador.'
                : 'Tu cuenta y registro profesional han sido autenticados exitosamente.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400">Especialista</span>
              <strong className="text-slate-800 font-bold truncate max-w-[200px]">{doctor.fullName}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-slate-400">Especialidad</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{doctor.specialty}</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-400">Estado de Acreditación</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[11px] whitespace-nowrap ${
                  rethusPending ? 'text-amber-700 bg-amber-100/60' : 'text-violet-700 bg-violet-100/60'
                }`}
              >
                {rethusPending ? 'Pendiente RETHUS' : 'Habilitado Oficial'}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto pt-4 pb-2">
          <button
            onClick={() => {
              setVerificationSuccess(false);
              setCurrentTab('home');
            }}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-violet-600 text-white font-bold shadow-xs hover:bg-violet-700 active:scale-98 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-violet-200" />
            <span>Ir al panel del doctor</span>
          </button>
        </div>
      </div>
    );
  }

  const doctorEmailKey = normalizeEmail(doctor.email);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header
        doctorName={doctor.fullName}
        doctorAvatar={doctor.avatarUrl}
        specialty={doctor.specialty}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 pb-28 sm:pb-32">
        {currentTab === 'home' && (
          <HomeDashboard
            doctor={doctor}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            emailNotice={emailNotices[doctorEmailKey] || null}
            onDismissEmailNotice={() =>
              setEmailNotices((prev) => {
                const next = { ...prev };
                delete next[doctorEmailKey];
                return next;
              })
            }
          />
        )}
        {(currentTab === 'patients' || currentTab === 'patient-photos') && <PatientsSection />}
        {currentTab === 'documents' && <DocumentsSection />}
        {currentTab === 'settings' && (
          <SettingsSection
            doctor={doctor}
            onUpdateDoctor={handleUpdateDoctor}
            onLogout={handleLogout}
          />
        )}
      </main>

      <BottomTabBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}
