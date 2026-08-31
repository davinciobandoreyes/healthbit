# HealthBit — control del agente

Producto: plataforma médica colombiana. Un paciente encuentra médicos verificados. Un médico demuestra identidad y RETHUS, luego lleva pacientes (SOAP, cirugías, fotos). Un super admin revisa RETHUS a mano.

Stack: React 19 + Vite + Tailwind 4 + Express (`server.ts`, puerto 3000). Arranque: `npm run dev`. Estado de sesión vive en React (`src/App.tsx`); se pierde al recargar. No hay DB.

Nombre canónico: **HealthBit**. En `index.html` / `server.ts` aún aparece “VerifyMD” / “Lovi Clinical”: leftover, no reintroducir.

## Memoria (el context window es caro y volátil)

La memoria real vive en archivos. Nunca cargar todo el historial ni todos los archivos del proyecto. Cargar solo lo estrictamente necesario para la tarea actual. Preferir referenciar archivos antes que copiar contenido largo al prompt. Convertir procedimientos repetitivos en skills reutilizables.

Al final de cada sesión importante: actualizar `state/`, registrar decisiones y comprimir lo valioso en `logs/`. Correr `skills/actualizar-contexto.md`. Mantener este archivo conciso (máx. 300 líneas) y de alta densidad.

## Orden de lectura

1. Este archivo (`AGENTS.md`).
2. `reglas.md` (líneas rojas detectables).
3. `state/current.md` (hecho / pendiente / blockers).
4. Solo si la tarea lo pide:
   - UI / pantallas nuevas → `Contexto/design.md` y, si hace falta detalle, `DESIGNHealthBit.md`
   - Por qué se hizo X → `Contexto/decisiones.md` → el archivo en `decisions/`
   - Bug raro o trampa conocida → `gotchas/`
   - Qué pasó en una sesión vieja → `logs/` (resumen, no transcript)

No leer de entrada: `dashboard.html`, `src/data/mock*.ts`, `DESIGNHealthBit.md` completo, `node_modules/`, historial de chat.

## Mapa mínimo

| Superficie | Archivo | Notas |
|---|---|---|
| Orquestación / 4 vistas | `src/App.tsx` | `portal` \| `public_directory` \| `verification_flow` \| `admin_review` |
| Tipos | `src/types.ts` | Fuente de datos de dominio |
| Registro 6 pasos | `src/components/VerificationFlow.tsx` | Paso 2 = RETHUS a revisión. Paso 6 = diplomas/actas, opcional |
| Login | `src/components/DoctorAuthModal.tsx` | Submit → `onLoginSuccess(email)` |
| Directorio pacientes | `src/components/PatientDirectory.tsx` | Solo `verifiedStatus.rethus && !isPaused` |
| Cola admin | `src/components/AdminRethusQueue.tsx` | Filtros pending / approved / denied + pausa |
| Home médico | `src/components/HomeDashboard.tsx` | Chip RETHUS pendiente / aprobado / denegado |
| Gemini cédula / selfie | `server.ts` | `/api/verify-document`, `/api/verify-biometrics` |
| Design system | `DESIGNHealthBit.md` | No inventar tokens |
| Mapa de producto (humano) | `dashboard.html` | No es la app |

Componentes no montados (no usar como base): `SpecialistDashboard.tsx`, `MobileFrame.tsx`.

## Cuentas demo

- Médico: `dra.restrepo@javeriana.edu.co` (precargada). Contraseña no se valida.
- Admin: cualquier correo que termine en `@healthbit.co` (ej. `admin@healthbit.co`). Se decide en `App.tsx` al hacer login.
- Médicos de ejemplo en directorio: `src/data/mockDoctors.ts` (varios usan `@healthbit.co`; son fichas de directorio, no el login admin).

## Invariantes (también en `reglas.md`)

1. RETHUS del registro es revisión humana. El paso 2 no llama `/api/rethus-check`.
2. Un médico no aparece en el buscador hasta RETHUS aprobado y no pausado.
3. El sello / análisis de Gemini no es prueba: si el API falla, el server inventa `success: true`. No tratar fallback como verificación real.
4. “Correo enviado” es aviso en pantalla. No hay SMTP.
5. UI nueva sigue `DESIGNHealthBit.md`: violet/slate, lucide-react, `min-h-[44px]`, badges `whitespace-nowrap`.
6. No persistir en localStorage/DB salvo que el usuario lo pida. Hoy todo es demo en memoria.
7. No reintroducir botón “cuenta admin demo”. El dominio `@healthbit.co` basta.

## Qué skill usar

| Tarea | Skill / archivo |
|---|---|
| Cerrar sesión importante | `skills/actualizar-contexto.md` (obligatorio) |
| UI / layout / copy | `Contexto/design.md` + `DESIGNHealthBit.md` |
| Login, admin, directorio, RETHUS | `App.tsx` + gotcha de estado en memoria |
| Pacientes / SOAP / fotos | `PatientsSection.tsx` + `types.ts` (sección Health Tech) |
| Gemini / cédula / selfie | `server.ts` + `gotchas/gemini-fallback.md` |

Si un flujo se repite ≥2 veces, extraerlo a `skills/` en vez de reexplicarlo en el chat.

## Definition of Done

- [ ] La tarea no rompe los invariantes de arriba.
- [ ] Si hubo UI: verificado en navegador (flujo, no solo screenshot); desktop y móvil si cambió layout.
- [ ] Directorio: `verifiedStatus.rethus && !isPaused` sigue filtrando.
- [ ] Login `@healthbit.co` → admin; `dra.restrepo@javeriana.edu.co` → portal.
- [ ] No se copió historial largo al prompt ni se infló `AGENTS.md`.
- [ ] Si la sesión fue importante: corrida `skills/actualizar-contexto.md` (state / decisions / logs al día y más cortos).

## Punteros

- Producto / UI corta: `Contexto/design.md`
- Índice de decisiones: `Contexto/decisiones.md`
- Reglas (agente): `reglas.md` · eco en `Contexto/reglas.md`
- Estado: `state/current.md`
- Decisiones fechadas: `decisions/`
- Trampas: `gotchas/`
- Sesiones comprimidas: `logs/`
- Skill de cierre: `skills/actualizar-contexto.md`
