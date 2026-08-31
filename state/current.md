# Estado actual — 2026-08-31

## Hecho

- Directorio público, login demo, registro 6 pasos, portal (Home / Pacientes / Documentos / Ajustes).
- Paso 6 Validación de grado: diplomas y actas, opcional (omitir o continuar con 0–N archivos). Sin Gemini.
- RETHUS: revisión humana. Admin `@healthbit.co`. Cola con 3 estados + pausa.
- Gemini multimodal para cédula y selfie (con fallback que no rompe la demo).
- Design system en `DESIGNHealthBit.md` (primario `violet-600`, companion indigo; ámbar = pendiente). Mapa humano en `dashboard.html`.
- Pacientes: fichas SOAP, cirugías, fotos (datos mock, estado local del componente).

## Pendiente (producto)

- Persistencia real (hoy recargar pierde registros, cola, pausas, avisos).
- Auth real (no se comprueba password; no hay sesión de servidor).
- Correo real al aprobar RETHUS.
- Quitar o marcar fallback de Gemini para no insinuar sello oficial falso.
- Decidir qué hacer con `/api/rethus-check` (vivo, UI no lo usa).
- Limpiar leftovers: título VerifyMD/Lovi en `index.html`; log “VerifyMD Server”; Plus Jakarta Sans no cargada.
- Borrar o recablear `SpecialistDashboard.tsx` y `MobileFrame.tsx`.

## Blockers

- Dataset RETHUS público sin identificadores: por eso la revisión es humana.
- Sin backend de datos: cualquier “guardar de verdad” es feature nueva, no un arreglo local.

## Cómo probar rápido

```bash
npm run dev   # http://localhost:3000
```

- Portal médico: modal → `dra.restrepo@javeriana.edu.co` → Ingresar.
- Admin: mismo modal → `admin@healthbit.co` → Ingresar.
- Registro: Registrarse → paso 2 envía a revisión → paso 6 se puede omitir → Home con chip pendiente → no aparece en buscador hasta aprobar.
