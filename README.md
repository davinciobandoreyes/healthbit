# HealthBit

Plataforma médica colombiana en prototipo: un paciente encuentra médicos verificados; un médico demuestra identidad y RETHUS; un super admin revisa RETHUS a mano.

Esto es una **demo en memoria**. No hay base de datos ni sesión de servidor: recargar el navegador pierde registros, cola admin, pausas y avisos.

## Qué hace

| Quién | Qué ve |
|---|---|
| Paciente | Directorio público. Solo médicos con RETHUS **aprobado** y no pausados. |
| Médico | Registro en 5 pasos, luego portal (Home, Pacientes, Documentos, Ajustes). |
| Super admin | Cola RETHUS (pendiente / aprobado / denegado) y pausar o reactivar un perfil. |

El paso 2 del registro **envía RETHUS a revisión humana**. No consulta datos.gov.co desde la UI. Un médico no aparece en el buscador hasta que el admin aprueba y el perfil no está pausado.

Cédula y selfie pasan por Gemini (`/api/verify-document`, `/api/verify-biometrics`). Si falta la API key o el modelo falla, el servidor responde `success: true` con datos inventados para que la demo no se rompa. Eso **no** es verificación real.

## Stack

React 19 · Vite 6 · Tailwind 4 · Express (`server.ts`, puerto **3000**) · lucide-react · Gemini (opcional)

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (viene con Node)
- Clave de [Gemini](https://aistudio.google.com/apikey) solo si quieres análisis real de cédula/selfie

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Sin `GEMINI_API_KEY` la app arranca igual: login, directorio, registro y cola admin funcionan; cédula y selfie usan el fallback descrito arriba.

## Cuentas demo

El login **no valida la contraseña**. El rol lo decide el correo al pulsar Ingresar.

| Rol | Correo | Notas |
|---|---|---|
| Médico | `dra.restrepo@javeriana.edu.co` | Cuenta precargada. Cualquier contraseña. |
| Super admin | cualquier `*@healthbit.co` (ej. `admin@healthbit.co`) | No hay botón “entrar como admin”. |
| Médico nuevo | el que registres en el flujo | No usa `@healthbit.co` (ese dominio es admin). |

Probar registro + aprobación **sin recargar**: Registrarse → paso 2 (RETHUS en revisión) → Home con chip pendiente → no sale en el buscador → login admin → aprobar → el médico aparece en el directorio.

## Variables de entorno

Crea `.env.local` en la raíz (está en `.gitignore`) o exporta las variables en el shell **antes** de `npm run dev`:

```bash
GEMINI_API_KEY=tu_clave
```

| Variable | Obligatoria | Uso |
|---|---|---|
| `GEMINI_API_KEY` | No | Análisis multimodal de cédula y selfie. Sin ella, fallback de demo. |
| `DATOS_GOV_APP_TOKEN` | No | Token opcional de `/api/rethus-check`. La UI de registro **no** llama ese endpoint. |

`dotenv` está en dependencias; el servidor lee `process.env` al arrancar. Si la clave no llega, exporta en el mismo terminal:

```bash
export GEMINI_API_KEY=tu_clave
npm run dev
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Express + Vite en http://localhost:3000 |
| `npm run build` | Build de Vite + bundle de `server.ts` → `dist/` |
| `npm start` | Sirve el build (`dist/server.cjs`). Requiere `npm run build` antes. |
| `npm run lint` | `tsc --noEmit` |
| `npm run clean` | Borra `dist` y `server.cjs` |

## Limitaciones (no son bugs)

- Estado de sesión y negocio vive en React (`src/App.tsx`). Se pierde al recargar.
- No hay SMTP. El aviso de “correo enviado” al aprobar RETHUS es copy en pantalla.
- El sello de Gemini no es prueba de identidad si vino de fallback.
- `/api/rethus-check` existe en el servidor pero el registro no lo usa (el dataset público de RETHUS no trae identificadores útiles para match).
- Componentes `SpecialistDashboard` y `MobileFrame` no están montados; no son la app.

## Mapa del código

```
src/App.tsx                 Orquestación: portal | directorio | registro | admin
src/types.ts                Tipos de dominio
src/components/             Flujos cableados (VerificationFlow, PatientDirectory, …)
src/data/mockDoctors.ts     Médicos de ejemplo del directorio
server.ts                   API Gemini + RETHUS (sin uso en UI) + Vite middleware
DESIGNHealthBit.md          Design system (tokens; no inventar colores)
```

Para agentes y decisiones de producto: [`AGENTS.md`](AGENTS.md), [`reglas.md`](reglas.md), [`state/current.md`](state/current.md).
