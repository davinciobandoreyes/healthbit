# Design — HealthBit

Detalle visual: [`../DESIGNHealthBit.md`](../DESIGNHealthBit.md). Leer ese archivo solo al tocar UI.

## Usuarios y vistas (`App.tsx`)

1. **Paciente** — `public_directory`: busca especialistas, abre ficha, “reserva” demo.
2. **Médico** — `verification_flow` (6 pasos) luego `portal` (Inicio / Pacientes / Documentos / Ajustes).
3. **Super admin** — `admin_review`: cola RETHUS (pendientes, aceptadas, negadas) + pausar/reactivar.

## Registro (pasos)

1. Cuenta (nombre, email, password ≥6, términos).
2. Datos profesionales + RETHUS → aviso “en revisión” → puede seguir. **No llama API.**
3–4. Cédula frente / dorso (cámara, upload o preset). Gemini o fallback.
5. Selfie / liveness. Gemini o fallback.
6. Validación de grado (diplomas y actas). Opcional: omitir o continuar con 0–N archivos. **Sin Gemini.**

Al terminar: identidad OK, RETHUS pendiente, **no sale en el buscador** hasta que admin apruebe.

## Visual (no inventar)

- Primario: `violet-600` / hover `violet-700`. Pendiente: ámbar. Fondo: `slate-50`. Tarjetas: `white` + `border-slate-200/80`.
- Iconos: `lucide-react`. Radios: `rounded-3xl` contenedor, `rounded-2xl` tarjeta, `rounded-xl` input.
- Touch ≥ 44px. Badges: `whitespace-nowrap`. Móvil: tabs inferiores (`BottomTabBar`). Web `lg+`: panel izquierdo colapsable (`AppSidebar`; iconos solos o iconos + copy). CTA de Documentos: `fixed` a la derecha, no centrado.
- Fuentes: `index.html` carga Inter; el portal pide Plus Jakarta Sans en clase (no está en el HTML). No añadir una tercera.

## Copy

Verbos cortos: Continuar, Registrarse, Ingresar. Términos: RETHUS, Pre-Op, Post-Op Activo. Avisos de correo deben decir que es demo.

## Fuera de alcance visual

`dashboard.html` es mapa interno, no producto. `SpecialistDashboard` / `MobileFrame` están muertos.
