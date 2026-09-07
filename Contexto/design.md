# Design — HealthBit

Detalle visual: [`../DESIGNHealthBit.md`](../DESIGNHealthBit.md). Leer ese archivo solo al tocar UI.

## Usuarios y vistas (`App.tsx`)

1. **Paciente** — `public_directory`: busca especialistas, abre ficha, “reserva” demo.
2. **Médico** — `verification_flow` (6 pasos) luego `portal` (Inicio / Pacientes / Documentos / Ajustes).
3. **Super admin** — `admin_review`: cola RETHUS (pendientes, aceptadas, negadas) + pausar/reactivar.

## Registro (pasos)

1. Cuenta (nombre, email, password ≥6, términos).
2. Datos profesionales + RETHUS → aviso “en revisión” → puede seguir. **No llama API.** Laboratorio Verifik aparte: `/test`.
3–4. Cédula frente / dorso (cámara, upload o preset). Gemini o fallback.
5. Selfie / liveness. Gemini o fallback.
6. Validación de grado (diplomas y actas). Opcional: omitir o continuar con 0–N archivos. **Sin Gemini.**

Al terminar: identidad OK, RETHUS pendiente, **no sale en el buscador** hasta que admin apruebe.

## Visual (no inventar)

- Primario: `violet-600` / hover `violet-700`. Pendiente: ámbar. Fondo: `slate-50`. Tarjetas: `white` + `border-slate-200/80`.
- Iconos: `lucide-react`. Radios: `rounded-3xl` contenedor, `rounded-2xl` tarjeta, `rounded-xl` input.
- Touch ≥ 44px. Badges: `whitespace-nowrap`. Móvil: tabs inferiores (`BottomTabBar`) siempre. Web `lg+`: `AppSidebar` solo en profundidad 1 (`shouldShowSidebar`). En alta/ficha (2+) no hay menú izquierdo; la marca vuelve al header. CTA de Documentos: `fixed` a la derecha, no centrado.
- Fuentes: `index.html` carga Inter; el portal pide Plus Jakarta Sans en clase (no está en el HTML). No añadir una tercera.

## Pacientes (portal)

Alta (FAB) es one-pager de una columna (`max-w-3xl`): identidad → sociodemográficos → clínico → alertas médicas (pills, input abierto por default, tokens ámbar; no rose de error). Obligatorio: nombre e identidad. Ficha: tarjeta “Datos sociodemográficos” editable. Ambos son profundidad 2 (sin sidebar).

Historia clínica (desde la ficha, no modal): 7 one-pagers con stepper (`ClinicalHistoryFlow`). Campos opcionales; al revisar, vacío se muestra como “Sin información” (`clinicalDisplay.ts`). Diagnóstico = typeahead CIE-10 local. Sin paso RIPS.

## Copy

Verbos cortos: Continuar, Registrarse, Ingresar. Términos: RETHUS, Pre-Op, Post-Op Activo. Avisos de correo deben decir que es demo.

## Fuera de alcance visual

`dashboard.html` es mapa interno, no producto. `SpecialistDashboard` / `MobileFrame` están muertos.
