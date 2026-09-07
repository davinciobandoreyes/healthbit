# Estado actual — 2026-09-06

## Hecho

- Sandbox Verifik RETHUS: `GET /test` + `POST /api/verifik-rethus`. Token en servidor. Registro no lo llama.
- Alta de paciente: one-pager de una columna. Sidebar solo en profundidad 1 (`shouldShowSidebar` en `nav.ts`). Alertas médicas = sección propia con pills (input abierto, sin rose).
- Arranque en el buscador público (`public_directory`), no en el portal.
- Portal/admin en `lg+`: sidebar izquierdo colapsable. Móvil: barra inferior (portal). Copy de navegación en español (Inicio).
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
- Decidir si Verifik entra al paso 2 (hoy solo `/test`). `/api/rethus-check` (datos.gov.co) sigue vivo y sin UI.
- Limpiar leftovers: título VerifyMD/Lovi en `index.html`; log “VerifyMD Server”; Plus Jakarta Sans no cargada.
- Borrar o recablear `SpecialistDashboard.tsx` y `MobileFrame.tsx`.

## Blockers

- Dataset RETHUS público sin identificadores: por eso la revisión es humana.
- Sin backend de datos: cualquier “guardar de verdad” es feature nueva, no un arreglo local.

## Cómo probar rápido

```bash
npm run dev   # http://localhost:3000
```

- Arranque: buscador público. Portal médico: botón de médico → `dra.restrepo@javeriana.edu.co` → Ingresar.
- Admin: mismo modal → `admin@healthbit.co` → Ingresar.
- Registro: Registrarse → paso 2 envía a revisión → paso 6 se puede omitir → Home con chip pendiente → no aparece en buscador hasta aprobar.
- Verifik: http://localhost:3000/test (hace falta `VERIFIK_TOKEN` en `.env.local`).
