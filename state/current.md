# Estado actual — 2026-09-24

## Hecho

- Ficha pública del médico (`DoctorOnePager`): cabecera compacta, pestañas (Experiencia / Verificación / Credenciales / Opiniones) y agenda sticky. Sin catálogo de precios ni EPS.
- Sandbox Verifik RETHUS: `GET /test` + `POST /api/verifik-rethus`. Token en servidor. Registro no lo llama.
- Alta de paciente: one-pager de una columna. Sidebar solo en profundidad 1 (`shouldShowSidebar` en `nav.ts`). Alertas médicas = sección propia con pills (input abierto, sin rose).
- Arranque en el buscador público (`public_directory`), no en el portal.
- Portal/admin en `lg+`: sidebar izquierdo colapsable. Móvil: barra inferior (portal). Copy de navegación en español (Inicio).
- Paso 3 REPS: sede, ciudad, dirección y tipos de servicio. El admin acepta o rechaza en el expediente. No filtra el buscador.
- Paso 7 Validación de grado: diplomas y actas, opcional (omitir o continuar con 0–N archivos). Sin Gemini.
- RETHUS: revisión humana. Admin `@healthbit.co`. Cola con 3 estados + pausa.
- Gemini multimodal para cédula y selfie (con fallback que no rompe la demo).
- Design system en `DESIGNHealthBit.md` (primario `violet-600`, companion indigo; ámbar = pendiente). Mapa humano en `dashboard.html`.
- Pacientes: fichas SOAP, cirugías, fotos (datos mock, estado local del componente).
- Historia clínica: wizard de 7 one-pagers (`ClinicalHistoryFlow`). Reemplaza el modal SOAP. CIE-10 local + `POST /api/categorize-illness` (fallback no se vende como IA). Sin RIPS.
- Portal: Perfil guarda identidad + disponibilidad juntos. Web: Citas (Agendadas/Realizadas/Por agendar/Canceladas + Hoy/Mañana/7 días; WhatsApp demo) y Opiniones (Mostradas/Pendientes + ±estrellas). Móvil: Cita. Las reseñas nuevas no salen en la ficha hasta Mostrar.

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
- Registro: Registrarse → paso 2 RETHUS y paso 3 REPS envían a revisión → paso 7 se puede omitir → Home con chip pendiente → no aparece en buscador hasta aprobar RETHUS.
- Verifik: http://localhost:3000/test (hace falta `VERIFIK_TOKEN` en `.env.local`).
