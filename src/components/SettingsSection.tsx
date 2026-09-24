import React, { useMemo, useState } from 'react';
import {
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
  MapPin,
  Building2,
  Plus,
  X,
} from 'lucide-react';
import {
  DoctorProfile,
  DoctorTitlePrefix,
  WeekdayKey,
  WeeklyAvailability,
} from '../types';
import {
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  composeDisplayName,
  composeLocation,
  defaultWeeklyAvailability,
  hydrateDoctorProfile,
} from '../data/doctorPublic';

interface SettingsSectionProps {
  doctor: DoctorProfile;
  onUpdateDoctor: (updated: Partial<DoctorProfile>) => void;
  onLogout?: () => void;
}

const inputClass =
  'w-full min-h-[44px] bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-violet-600';

function publicProfileSnapshot(input: {
  titlePrefix?: DoctorTitlePrefix | '';
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  whatsappPhone?: string;
  avatarUrl: string;
  specialty: string;
  focusAreas?: string[];
  biography: string;
  officeCity?: string;
  officeAddress?: string;
  institution: string;
  weeklyAvailability?: WeeklyAvailability;
}) {
  return JSON.stringify({
    titlePrefix: input.titlePrefix || '',
    firstName: (input.firstName || '').trim(),
    lastName: (input.lastName || '').trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    whatsappPhone: (input.whatsappPhone || input.phone).trim(),
    avatarUrl: input.avatarUrl,
    specialty: input.specialty.trim(),
    focusAreas: input.focusAreas || [],
    biography: input.biography.trim(),
    officeCity: (input.officeCity || '').trim(),
    officeAddress: (input.officeAddress || '').trim(),
    institution: input.institution.trim(),
    weeklyAvailability: input.weeklyAvailability,
  });
}

const HOURS = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  doctor,
  onUpdateDoctor,
  onLogout,
}) => {
  const seeded = useMemo(() => hydrateDoctorProfile(doctor), [doctor]);
  const [titlePrefix, setTitlePrefix] = useState<DoctorTitlePrefix>(seeded.titlePrefix || '');
  const [firstName, setFirstName] = useState(seeded.firstName || '');
  const [lastName, setLastName] = useState(seeded.lastName || '');
  const [email, setEmail] = useState(seeded.email);
  const [phone, setPhone] = useState(seeded.phone);
  const [whatsappPhone, setWhatsappPhone] = useState(seeded.whatsappPhone || seeded.phone);
  const [avatarUrl, setAvatarUrl] = useState(seeded.avatarUrl);
  const [specialty, setSpecialty] = useState(seeded.specialty);
  const [focusAreas, setFocusAreas] = useState<string[]>(seeded.focusAreas || []);
  const [focusDraft, setFocusDraft] = useState('');
  const [biography, setBiography] = useState(seeded.biography);
  const [officeCity, setOfficeCity] = useState(seeded.officeCity || '');
  const [officeAddress, setOfficeAddress] = useState(seeded.officeAddress || '');
  const [institution, setInstitution] = useState(seeded.institution);
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    seeded.weeklyAvailability || defaultWeeklyAvailability()
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const previewName = composeDisplayName({
    fullName: doctor.fullName,
    firstName,
    lastName,
    titlePrefix,
  });
  const previewLocation = composeLocation({
    location: doctor.location,
    officeCity,
    officeAddress,
  });

  const isPublicDirty = useMemo(
    () =>
      publicProfileSnapshot({
        titlePrefix,
        firstName,
        lastName,
        email,
        phone,
        whatsappPhone,
        avatarUrl,
        specialty,
        focusAreas,
        biography,
        officeCity,
        officeAddress,
        institution,
        weeklyAvailability: availability,
      }) !== publicProfileSnapshot({ ...seeded, weeklyAvailability: seeded.weeklyAvailability }),
    [
      titlePrefix,
      firstName,
      lastName,
      email,
      phone,
      whatsappPhone,
      avatarUrl,
      specialty,
      focusAreas,
      biography,
      officeCity,
      officeAddress,
      institution,
      availability,
      seeded,
    ]
  );

  const addFocusArea = () => {
    const value = focusDraft.trim();
    if (!value || focusAreas.includes(value)) return;
    setFocusAreas((prev) => [...prev, value]);
    setFocusDraft('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDoctor({
      titlePrefix,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: previewName,
      email,
      phone,
      whatsappPhone,
      avatarUrl,
      specialty: specialty.trim(),
      focusAreas,
      subspecialty: focusAreas[1] || focusAreas[0],
      biography: biography.trim(),
      officeCity: officeCity.trim(),
      officeAddress: officeAddress.trim(),
      location: previewLocation,
      institution: institution.trim(),
      weeklyAvailability: availability,
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
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  const patchDay = (key: WeekdayKey, patch: Partial<WeeklyAvailability[WeekdayKey]>) => {
    setAvailability((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  return (
    <div className="space-y-5 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Perfil</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Así te ven los pacientes en el directorio
        </p>
      </div>

      <form onSubmit={handleProfileSave} className="space-y-5">
        <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-600" /> Identidad pública
            </h2>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-violet-600" /> Guardado
              </span>
            )}
          </div>

          <div className="flex items-center gap-5">
            <img
              src={avatarUrl}
              alt={previewName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/80 shadow-md"
            />
            <div className="space-y-1.5">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Foto de prueba
              </span>
              <div className="flex items-center gap-2">
                {[
                  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
                  'https://images.unsplash.com/photo-1594824813681-ef0662e08e6f?auto=format&fit=crop&q=80&w=200',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 ${
                      avatarUrl === preset ? 'border-violet-600' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={preset} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Cómo quieres aparecer</label>
            <div className="flex flex-wrap gap-2">
              {(['Dra.', 'Dr.', ''] as DoctorTitlePrefix[]).map((prefix) => (
                <button
                  key={prefix || 'none'}
                  type="button"
                  onClick={() => setTitlePrefix(prefix)}
                  className={`min-h-[44px] px-4 rounded-full text-xs font-bold ${
                    titlePrefix === prefix
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {prefix || 'Sin título'}
                </button>
              ))}
            </div>
            <p className="text-xs text-violet-700 font-bold mt-2">Vista previa: {previewName || '—'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre *</label>
              <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Apellido *</label>
              <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Profesión / especialidad *</label>
            <input required value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Especialista en</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-xs font-bold"
                >
                  {area}
                  <button type="button" onClick={() => setFocusAreas((prev) => prev.filter((item) => item !== area))} aria-label={`Quitar ${area}`}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={focusDraft}
                onChange={(e) => setFocusDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFocusArea();
                  }
                }}
                placeholder="Ej. Rinoplastia ultrasónica"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addFocusArea}
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 rounded-xl bg-violet-600 text-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sobre mí</label>
            <textarea
              rows={4}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className={`${inputClass} min-h-[96px] resize-none`}
            />
          </div>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
            <MapPin className="w-5 h-5 text-violet-600" /> Consultorio y contacto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Correo *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono de cuenta *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp (Escríbenos) *</label>
              <input required value={whatsappPhone} onChange={(e) => setWhatsappPhone(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Institución</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input value={institution} onChange={(e) => setInstitution(e.target.value)} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Ciudad</label>
              <input value={officeCity} onChange={(e) => setOfficeCity(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Dirección del consultorio</label>
              <input value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} className={inputClass} />
            </div>
          </div>
          <p className="text-xs text-slate-500">En la ficha se muestra: {previewLocation || '—'}</p>
        </section>

        <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-4">
            Disponibilidad semanal
          </h2>
          <p className="text-xs text-slate-500">Se guarda junto con el perfil público.</p>
          <div className="space-y-2">
            {WEEKDAY_KEYS.map((key) => {
              const day = availability[key];
              return (
                <div key={key} className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                  <label className="inline-flex items-center gap-2 min-h-[44px] min-w-[7.5rem] text-sm font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) => patchDay(key, { enabled: e.target.checked })}
                      className="w-4 h-4 accent-violet-600"
                    />
                    {WEEKDAY_LABELS[key]}
                  </label>
                  <select
                    disabled={!day.enabled}
                    value={day.start}
                    onChange={(e) => patchDay(key, { start: e.target.value })}
                    className={`${inputClass} max-w-[7rem] disabled:opacity-40`}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-400">a</span>
                  <select
                    disabled={!day.enabled}
                    value={day.end}
                    onChange={(e) => patchDay(key, { end: e.target.value })}
                    className={`${inputClass} max-w-[7rem] disabled:opacity-40`}
                  >
                    {HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </section>

        {isPublicDirty && (
          <div className="fixed inset-x-0 bottom-20 sm:bottom-22 lg:bottom-6 z-40 pointer-events-none">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex justify-end">
              <button
                type="submit"
                className="pointer-events-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-5 sm:px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 border border-violet-500/40 transition-all cursor-pointer whitespace-nowrap"
              >
                <Save className="w-4 h-4" />
                Guardar perfil público
              </button>
            </div>
          </div>
        )}
      </form>

      <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Lock className="w-5 h-5 text-indigo-600" /> Cuenta
        </h2>
        {passwordSuccess && (
          <div className="p-3.5 bg-violet-50 border border-violet-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-violet-800">
            <CheckCircle2 className="w-4 h-4 text-violet-600" /> Contraseña actualizada correctamente.
          </div>
        )}
        {passwordError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600" /> {passwordError}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Nueva contraseña (mín. 8)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
          <button type="submit" className="w-full min-h-[44px] rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer">
            Actualizar contraseña
          </button>
        </form>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-600" /> Verificación en dos pasos
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Activada en esta demo.</p>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full min-h-[44px] rounded-xl bg-white border border-rose-300 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-600 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        )}
      </section>
    </div>
  );
};
