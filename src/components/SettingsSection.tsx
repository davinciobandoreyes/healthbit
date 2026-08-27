import React, { useState } from 'react';
import {
  Settings,
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  LogOut,
} from 'lucide-react';
import { DoctorProfile } from '../types';

interface SettingsSectionProps {
  doctor: DoctorProfile;
  onUpdateDoctor: (updated: Partial<DoctorProfile>) => void;
  onLogout?: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  doctor,
  onUpdateDoctor,
  onLogout,
}) => {
  // Form State
  const [fullName, setFullName] = useState(doctor.fullName);
  const [email, setEmail] = useState(doctor.email || 'dra.restrepo@javeriana.edu.co');
  const [phone, setPhone] = useState(doctor.phone || '+57 312 456 7890');
  const [avatarUrl, setAvatarUrl] = useState(doctor.avatarUrl);
  const [location, setLocation] = useState(doctor.location || 'Bogotá D.C., Colombia');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDoctor({
      fullName,
      email,
      phone,
      avatarUrl,
      location,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    // Success simulation
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  const handleAvatarPreset = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <div className="space-y-5 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ajustes
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Perfil público, contacto y credenciales
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Details & Avatar (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" /> Información del Perfil
            </h2>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-violet-600" /> Perfil Actualizado
              </span>
            )}
          </div>

          {/* Avatar Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Fotografía de Perfil Profesional
            </label>
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/80 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-1.5 rounded-lg shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 block">Elegir fotografía de prueba:</span>
                <div className="flex items-center gap-2">
                  {[
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
                    'https://images.unsplash.com/photo-1594824813681-ef0662e08e6f?auto=format&fit=crop&q=80&w=200',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAvatarPreset(preset)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                        avatarUrl === preset ? 'border-violet-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 text-sm font-semibold focus:bg-white focus:outline-violet-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Número de Contacto *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-violet-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ciudad y Ubicación del Consultorio</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-violet-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Información de Perfil</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Password Update (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" /> Seguridad & Contraseña
            </h2>
          </div>

          {passwordSuccess && (
            <div className="p-3.5 bg-violet-50 border border-violet-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-violet-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
              <span>Contraseña actualizada correctamente.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-red-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contraseña Actual *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nueva Contraseña *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Confirmar Nueva Contraseña *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Repite la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-800 font-semibold text-xs flex items-center gap-1.5"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Ocultar' : 'Mostrar'} contraseñas</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>

          {/* Two-Factor Authentication Status */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-violet-600" /> Verificación en Dos Pasos (2FA)
              </span>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                Activada
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Protección de grado hospitalario para expedientes médicos confidenciales.
            </p>
          </div>

          {/* Logout Action Card */}
          {onLogout && (
            <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sesión del Doctor</span>
                </div>
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  Dispositivo Actual
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Al cerrar sesión serás redirigido al directorio público de pacientes. Puedes volver a ingresar en cualquier momento con tus credenciales o retomar la verificación.
              </p>
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión de la Cuenta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
