import React, { useState } from 'react';
import { ArrowLeft, Check, MapPin, Share2, ShieldCheck, Star } from 'lucide-react';
import { DoctorProfile, LandingTemplateId, PublicReview } from '../types';
import { composeFocusAreas, composeLocation } from '../data/doctorPublic';
import { isPlasticSurgeonSpecialty, visibleProcedureLabels } from '../data/plasticProcedures';

interface DoctorLandingProps {
  doctor: DoctorProfile;
  templateId: LandingTemplateId;
  onBack: () => void;
  backLabel?: string;
  reviews: PublicReview[];
  onAddReview: (review: PublicReview) => void;
  booking: React.ReactNode;
}

const DEMO_REVIEWER = 'Santiago Morales';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SECTION_ORDER: Record<LandingTemplateId, Array<'bio' | 'procedures' | 'verify' | 'reviews'>> = {
  consulta: ['procedures', 'bio', 'reviews', 'verify'],
  historia: ['bio', 'verify', 'procedures', 'reviews'],
  estudio: ['procedures', 'bio', 'reviews', 'verify'],
  editorial: ['bio', 'verify', 'reviews', 'procedures'],
  clinica: ['verify', 'procedures', 'bio', 'reviews'],
};

export const DoctorLanding: React.FC<DoctorLandingProps> = ({
  doctor,
  templateId,
  onBack,
  backLabel = 'Volver al Directorio',
  reviews,
  onAddReview,
  booking,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const location = composeLocation(doctor);
  const focus = composeFocusAreas(doctor);
  const procedures = isPlasticSurgeonSpecialty(doctor.specialty) ? visibleProcedureLabels(focus) : focus;
  const visibleReviews = reviews.filter((item) => item.visible);
  const asideFirst = templateId === 'consulta' || templateId === 'clinica' || templateId === 'estudio';
  const editorial = templateId === 'editorial';

  const whatsAppMessage = encodeURIComponent(
    `Hola Dr./Dra. ${doctor.fullName}, vi su perfil verificado en Plasty y me gustaría agendar una cita presencial de valoración en ${doctor.specialty}.`
  );
  const cleanPhone = (doctor.whatsappPhone || doctor.phone || '').replace(/[^0-9]/g, '') || '573124567890';
  const whatsAppLink = `https://wa.me/${cleanPhone}?text=${whatsAppMessage}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddReview({
      id: `rev-${Date.now()}`,
      doctorEmail: doctor.email,
      patientName: DEMO_REVIEWER,
      location,
      rating,
      timeAgo: 'Hace un momento',
      comment: comment.trim(),
      visible: false,
    });
    setComment('');
    setRating(5);
  };

  const blocks: Record<'bio' | 'procedures' | 'verify' | 'reviews', React.ReactNode> = {
    bio: (
      <section key="bio" className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">{editorial ? 'En sus palabras' : 'Sobre el médico'}</h2>
        <p className={`text-slate-600 leading-relaxed ${editorial ? 'text-lg font-medium' : 'text-sm'}`}>
          {doctor.biography}
        </p>
        <p className="text-xs text-slate-500">{doctor.institution}</p>
      </section>
    ),
    procedures: (
      <section key="procedures" className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">Procedimientos</h2>
        {procedures.length === 0 ? (
          <p className="text-sm text-slate-500">{doctor.specialty}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {procedures.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-violet-50 text-violet-800 text-xs font-bold whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </section>
    ),
    verify: (
      <section key="verify" className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">Verificación</h2>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200/80 text-[11px] font-bold whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" /> RETHUS {doctor.rethusCode}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold whitespace-nowrap">
            Cédula {doctor.idNumber}
          </span>
        </div>
        <p className="text-sm text-slate-600 flex items-start gap-2">
          <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
          {location}
        </p>
      </section>
    ),
    reviews: (
      <section key="reviews" className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold text-slate-900">Opiniones</h2>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            {doctor.rating}
          </span>
        </div>
        {visibleReviews.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay opiniones mostradas.</p>
        ) : (
          <ul className="space-y-3">
            {visibleReviews.slice(0, 3).map((item) => (
              <li key={item.id} className="border border-slate-100 rounded-2xl p-3 space-y-1">
                <p className="text-sm font-bold text-slate-900">{item.patientName}</p>
                <p className="text-sm text-slate-600">“{item.comment}”</p>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleReview} className="space-y-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700">Dejar una opinión</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer"
                aria-label={`${value} estrellas`}
              >
                <Star className={`w-5 h-5 ${value <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-violet-600 focus:outline-none"
            placeholder="Cuéntale a otros pacientes cómo fue la consulta"
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
          >
            Enviar opinión
          </button>
          <p className="text-[11px] text-slate-400">El médico decide si se muestra.</p>
        </form>
      </section>
    ),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 min-h-[44px] text-xs sm:text-sm font-bold text-slate-700 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-3 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-violet-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Enlace copiado' : 'Compartir'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        <section
          className={`rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs ${
            editorial ? 'bg-slate-900 text-white' : 'bg-white'
          }`}
        >
          <div className={`grid gap-0 ${templateId === 'estudio' ? '' : 'md:grid-cols-[220px_minmax(0,1fr)]'}`}>
            <img
              src={doctor.avatarUrl}
              alt=""
              className={`w-full object-cover ${templateId === 'estudio' ? 'h-72 sm:h-96' : 'h-56 md:h-full'}`}
            />
            <div className="p-5 sm:p-8 space-y-3">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                  editorial
                    ? 'bg-white/10 text-white'
                    : 'bg-violet-50 text-violet-800 border border-violet-200/80'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Verificado RETHUS
              </span>
              <h1 className={`font-black tracking-tight leading-tight ${editorial ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'}`}>
                {doctor.fullName}
              </h1>
              <p className={`text-sm font-bold ${editorial ? 'text-violet-200' : 'text-violet-700'}`}>{doctor.specialty}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#agendamiento"
                  className="min-h-[44px] px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold inline-flex items-center cursor-pointer"
                >
                  Agendar cita
                </a>
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`min-h-[44px] px-4 rounded-xl text-sm font-bold inline-flex items-center gap-2 cursor-pointer ${
                    editorial ? 'bg-white text-slate-900' : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#128C7E]" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className={`grid gap-5 items-start ${asideFirst ? 'lg:grid-cols-[minmax(0,1fr)_340px]' : ''}`}>
          <div className={`space-y-5 ${asideFirst ? 'order-2 lg:order-1' : ''}`}>
            {SECTION_ORDER[templateId].map((key) => blocks[key])}
            {!asideFirst && booking}
          </div>
          {asideFirst && <div className="order-1 lg:order-2 lg:sticky lg:top-20">{booking}</div>}
        </div>
      </div>
    </div>
  );
};
