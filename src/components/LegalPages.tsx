import React from 'react';
import { ArrowLeft } from 'lucide-react';

export type LegalPageId = 'privacy' | 'terms';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    <div className="space-y-2 text-sm text-slate-600 leading-relaxed">{children}</div>
  </section>
);

export const SiteFooter: React.FC<{ onOpen: (page: LegalPageId) => void }> = ({ onOpen }) => (
  <footer className="border-t border-slate-200/80 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <p className="text-xs text-slate-500">HealthBit · directorio médico en Colombia</p>
      <p className="text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onOpen('privacy')}
          className="min-h-[44px] text-violet-700 font-semibold hover:text-violet-800 cursor-pointer"
        >
          Privacidad
        </button>
        <span className="mx-2 text-slate-300" aria-hidden="true">
          ·
        </span>
        <button
          type="button"
          onClick={() => onOpen('terms')}
          className="min-h-[44px] text-violet-700 font-semibold hover:text-violet-800 cursor-pointer"
        >
          Términos y condiciones
        </button>
      </p>
    </div>
  </footer>
);

export const LegalPage: React.FC<{ page: LegalPageId; onBack: () => void }> = ({ page, onBack }) => (
  <article className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-8 space-y-6 max-w-3xl">
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-bold text-violet-700 hover:text-violet-800 cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
      Volver al directorio
    </button>
    {page === 'privacy' ? <PrivacyBody /> : <TermsBody />}
  </article>
);

const PrivacyBody: React.FC = () => (
  <>
    <header className="space-y-1">
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Política de privacidad</h1>
      <p className="text-xs text-slate-500">Fase 1 del directorio · Ley 1581 de 2012 y Decreto 1377 de 2013</p>
    </header>

    <Section title="Responsable">
      <p>
        HealthBit trata datos personales como responsable, en los términos de la Ley 1581 de 2012. En esta fase es un
        directorio para encontrar médicos con RETHUS revisado por una persona. No es una IPS, no presta la consulta y no
        es el médico tratante.
      </p>
      <p>
        Las solicitudes de habeas data se envían a privacidad@healthbit.co. En esta fase no hay buzón con acuse
        automático: el aviso en pantalla no equivale a un correo entregado.
      </p>
    </Section>

    <Section title="Qué datos hay en esta fase">
      <p>Directorio público, solo de médicos con RETHUS aprobado y no pausados: nombre, especialidad, ciudad o sede, y el sello REPS si esa revisión fue aceptada. No se publica la cédula, la selfie ni la historia clínica.</p>
      <p>Quien reserva una cita entrega nombre, teléfono y motivo. Quien deja una opinión entrega nombre, texto y valoración. Esos datos quedan en la sesión del navegador y se pierden al recargar.</p>
      <p>El médico que se registra entrega cuenta, datos profesionales, RETHUS, sede REPS y, si quiere, diplomas. La cédula y la selfie se usan para la revisión de identidad. La historia clínica, las fotos clínicas y las alertas las carga el médico en su portal y también viven solo en esa sesión.</p>
    </Section>

    <Section title="Datos sensibles de salud">
      <p>
        El estado de salud, la historia clínica y las imágenes clínicas son datos sensibles (artículo 5 de la Ley 1581).
        HealthBit no los pide para aparecer en el buscador. Si un médico los registra, lo hace para su propia consulta,
        con el deber de reserva de la Ley 23 de 1981. La historia clínica sigue siendo del prestador, conforme a la
        Resolución 1995 de 1999 y la Ley 2015 de 2020. Esta fase no es el archivo clínico ni un sistema de RIPS.
      </p>
      <p>
        Tratar datos de salud exige la autorización previa del titular, o de su representante si es un menor, salvo las
        excepciones del artículo 6 y del artículo 10 de la Ley 1581. El sello de un modelo de lenguaje sobre la cédula o
        la selfie no es una verificación oficial: si ese servicio falla, la demo no debe leerse como un dictamen.
      </p>
    </Section>

    <Section title="Para qué se usan">
      <p>Mostrar el directorio, dejar una solicitud de cita presencial, publicar una opinión cuando el médico la muestra, y revisar RETHUS, REPS e identidad antes de listar a un médico. No se venden datos ni se usan para perfilar publicidad.</p>
    </Section>

    <Section title="Quién más los ve">
      <p>
        El médico ve las citas y opiniones de su ficha, y la historia que él mismo registra. Un revisor de HealthBit ve
        el expediente de RETHUS y REPS. WhatsApp es de Meta: al escribirle al médico sales de HealthBit y aplican las
        reglas de ese servicio. No hay encargados de almacenamiento permanente en esta fase.
      </p>
    </Section>

    <Section title="Derechos y conservación">
      <p>
        Puedes conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización, cuando no exista un
        deber legal de conservarlos. La queja puede elevarse a la Superintendencia de Industria y Comercio. En esta
        fase la conservación es la sesión: no hay base de datos durable, así que recargar borra registros, citas y
        opiniones nuevas.
      </p>
    </Section>
  </>
);

const TermsBody: React.FC = () => (
  <>
    <header className="space-y-1">
      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Términos y condiciones</h1>
      <p className="text-xs text-slate-500">Fase 1 del directorio · leyes de la República de Colombia</p>
    </header>

    <Section title="Qué es HealthBit">
      <p>
        HealthBit es un directorio para encontrar médicos. Publicar un perfil, reservar una cita o abrir WhatsApp no
        crea una relación médico-paciente con HealthBit. Esa relación, si nace, es con el médico o con su consultorio.
      </p>
      <p>Esto no es un servicio de urgencias. Ante una emergencia, usa la línea de emergencias o acude a un servicio de urgencias.</p>
    </Section>

    <Section title="Verificación en esta fase">
      <p>
        Un médico entra al buscador cuando una persona de HealthBit aprueba su RETHUS y el perfil no está pausado. El
        sello REPS aparece solo si esa revisión fue aceptada. El registro no consulta solo una API para dar por
        verificado al médico. Los documentos de identidad apoyan la revisión; un análisis automático no reemplaza el
        RETHUS ni el concepto del revisor.
      </p>
    </Section>

    <Section title="Citas, opiniones y datos de salud">
      <p>
        La reserva es una solicitud de visita presencial. El médico la confirma o la cancela. El código que ves es de
        demostración. El motivo de la cita puede ser un dato de salud: no lo publiques en una opinión. Las opiniones
        nuevas no salen en la ficha hasta que el médico elige mostrarlas.
      </p>
      <p>
        La historia clínica que el médico escribe en el portal no forma parte del directorio público y no sustituye la
        historia que debe llevar el prestador. HealthBit no diagnostica ni prescribe.
      </p>
    </Section>

    <Section title="WhatsApp y cuentas">
      <p>
        El botón de WhatsApp abre un chat con el número del médico, fuera de HealthBit. El mensaje inicial nombra la
        especialidad y pide una cita de valoración. No envíes por ahí documentos de identidad ni historias clínicas.
      </p>
      <p>
        La cuenta del médico pide un correo y una contraseña de al menos 6 caracteres. En esta fase la contraseña no se
        comprueba contra un servidor y la sesión se pierde al recargar.
      </p>
    </Section>

    <Section title="Uso aceptable y ley">
      <p>
        No uses el directorio para suplantar a un médico, publicar datos de pacientes o ofrecer servicios no
        habilitados. HealthBit puede pausar un perfil. No responde por el acto médico, por la disponibilidad del
        consultorio ni por lo que ocurra en WhatsApp.
      </p>
      <p>
        Estos términos se rigen por la ley colombiana, incluida la Ley 1581 de 2012 para los datos personales. Los
        jueces competentes son los de la República de Colombia.
      </p>
    </Section>
  </>
);
