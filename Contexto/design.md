# Design — HealthBit

Detalle visual: [`../DESIGNHealthBit.md`](../DESIGNHealthBit.md). Leer ese archivo solo al tocar UI.

## Usuarios y vistas (`App.tsx`)

1. **Paciente** — `public_directory`: el inventario es la página. Header: marca e Ingresar. Debajo, hero corto: “Encuentra doctores verificados” y la foto. Sigue en todas las especialidades. Se oculta al buscar o al elegir ciudad. Búsqueda en el contenido (en vivo, sin botón Buscar). En móvil, especialidad (scroll táctil) y ciudad (select a ancho completo) van en filas distintas; en `sm+` comparten fila. Debajo, “N médicos” y la grilla. La card abre la ficha; WhatsApp es un icono. Sello REPS solo si está aceptado. La ficha no lleva hero. Footer del directorio: Privacidad y Términos (Ley 1581, fase 1).
2. **Médico** — `verification_flow` (7 pasos) luego `portal` (Inicio / Pacientes / Documentos / Citas+Opiniones en web, Cita en móvil / Perfil).
3. **Super admin** — `admin_review`: cola RETHUS (pendientes, aceptadas, negadas) + pausar/reactivar.

## Registro (pasos)

1. Cuenta (nombre, email, password ≥6, términos).
2. Datos profesionales + RETHUS → aviso “en revisión” → puede seguir. **No llama API.** Laboratorio Verifik aparte: `/test`.
3. REPS: sede, ciudad, dirección y grupos de servicio. Aviso “en revisión”. **No llama API.** No abre el buscador; eso sigue siendo RETHUS.
4–5. Cédula frente / dorso (cámara, upload o preset). Gemini o fallback.
6. Selfie / liveness. Gemini o fallback.
7. Validación de grado (diplomas y actas). Opcional: omitir o continuar con 0–N archivos. **Sin Gemini.**

Al terminar: pantalla “Identidad Verificada” con RETHUS y REPS en pendiente. **No sale en el buscador** hasta que admin apruebe RETHUS.

## Visual (no inventar)

- Primario: `violet-600` / hover `violet-700`. Pendiente: ámbar. Fondo: `slate-50`. Tarjetas: `white` + `border-slate-200/80`.
- Iconos: `lucide-react`. Radios: `rounded-3xl` contenedor, `rounded-2xl` tarjeta, `rounded-xl` input.
- Touch ≥ 44px. Badges: `whitespace-nowrap`. Móvil: tabs inferiores (`BottomTabBar`) siempre. Web `lg+`: `AppSidebar` solo en profundidad 1 (`shouldShowSidebar`). En alta/ficha (2+) no hay menú izquierdo; la marca vuelve al header. CTA de Documentos: `fixed` a la derecha, no centrado. Sheets del portal en móvil: mismo bottom sheet de la ficha pública (`p-8`).
- Fuentes: `index.html` carga Inter; el portal pide Plus Jakarta Sans en clase (no está en el HTML). No añadir una tercera.

## Ficha pública del médico (`DoctorOnePager`)

Layout tipo directorio: identidad compacta + pestañas a la izquierda + **Agendar cita** sticky a la derecha (`lg+`). Móvil: intro 2×2 (foto+sellos | identidad / Agendar | Escríbenos); **Agendar** abre popover (bottom sheet) con el calendario. Desktop: agenda sticky. Tabs: Experiencia (default), Verificación, Credenciales; Opiniones es tab en `sm+` y en móvil va al final de Experiencia. Verificación y credenciales: la card abre el mismo bottom sheet de Agendar (overlay fijo, no empuja el layout). Móvil: todos los sheets/modales van al fondo con padding 32px. Agenda solo **visita presencial**, con slots demo tipo Calendly (sin API). Un CTA WhatsApp en la intro: “Escríbenos” (`#128C7E` + icono de marca). Reserva demo en memoria (`HB-######`). Opiniones: lista (sin foto) con badge “Cita verificada”, buscador y filtro Todas/Positivas/Negativas; alta demo como paciente ya logueado. Móvil: FAB fijo “+ Reseña” abajo a la derecha.

## Portal del médico

Inicio: chip RETHUS y, si hubo alta con REPS, chip REPS (pendiente en ámbar). Gráfica de **solo barras de citas** + leyenda. Documentos: card clickeable en móvil; **Ver** desde `lg+`; sheets con 32px. **Perfil**: identidad, WhatsApp aparte, especialista en (chips) y plantilla semanal Lun–Sáb; un solo **Guardar perfil público** (aparece si hay cambios, fijo abajo a la derecha). **Citas** (web) y **Cita** (móvil: reservas + opiniones). Citas: tabs Agendadas / Realizadas / Por agendar / Canceladas; estados Pendiente por confirmar / Confirmada / Cancelada; en agendadas filtros Hoy / Mañana / 7 días. Confirmar o cancelar avisa por WhatsApp (demo). **Opiniones** solo en `lg+`: tabs Mostradas / Pendientes + filtro Todas / Positivas / Negativas (≤2★). Las nuevas llegan a Pendientes. Guardar syncs la ficha del directorio (memoria).

## Pacientes (portal)

Alta (FAB) es one-pager de una columna (`max-w-3xl`): identidad → sociodemográficos → clínico → alertas médicas (pills, input abierto por default, tokens ámbar; no rose de error). Obligatorio: nombre e identidad. Ficha: tarjeta “Datos sociodemográficos” editable. Ambos son profundidad 2 (sin sidebar).

Historia clínica (desde la ficha, no modal): 7 one-pagers con stepper (`ClinicalHistoryFlow`). Campos opcionales; al revisar, vacío se muestra como “Sin información” (`clinicalDisplay.ts`). Diagnóstico = typeahead CIE-10 local. Sin paso RIPS.

## Copy

Verbos cortos: Continuar, Registrarse, Ingresar. Términos: RETHUS, Pre-Op, Post-Op Activo. Avisos de correo deben decir que es demo.

## Fuera de alcance visual

`dashboard.html` es mapa interno, no producto. `SpecialistDashboard` / `MobileFrame` están muertos.
