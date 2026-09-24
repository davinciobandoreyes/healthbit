# Decisiones (índice)

Cada ítem apunta a `decisions/`. No copiar el razonamiento aquí.

| Fecha | Decisión | Archivo |
|---|---|---|
| 2026-08-20 | Consulta RETHUS real no inventa match; dataset público no trae cédulas | [`../decisions/2026-08-20-rethus-api-sin-match-inventado.md`](../decisions/2026-08-20-rethus-api-sin-match-inventado.md) |
| 2026-08-21 | RETHUS pasa a revisión humana de super admin | [`../decisions/2026-08-21-rethus-revision-humana.md`](../decisions/2026-08-21-rethus-revision-humana.md) |
| 2026-08-25 | Admin = cualquier `@healthbit.co`; médico demo fuera de ese dominio | [`../decisions/2026-08-25-admin-por-dominio.md`](../decisions/2026-08-25-admin-por-dominio.md) |
| 2026-08-25 | Cola admin con 3 estados + pausar/despausar | [`../decisions/2026-08-25-cola-filtros-y-pausa.md`](../decisions/2026-08-25-cola-filtros-y-pausa.md) |
| 2026-08-31 | Paso 6 Validación de grado, opcional, después del selfie | [`../decisions/2026-08-31-validacion-de-grado.md`](../decisions/2026-08-31-validacion-de-grado.md) |
| 2026-09-05 | Socio del paciente: `city` = procedencia; catálogos en `patientCatalog.ts` | [`../decisions/2026-09-05-socio-paciente.md`](../decisions/2026-09-05-socio-paciente.md) |
| 2026-09-05 | Alta de paciente es one-pager, no modal | [`../decisions/2026-09-05-alta-onepager.md`](../decisions/2026-09-05-alta-onepager.md) |
| 2026-09-05 | Sidebar solo en profundidad 1 | [`../decisions/2026-09-05-sidebar-profundidad.md`](../decisions/2026-09-05-sidebar-profundidad.md) |
| 2026-09-06 | Sandbox Verifik en `/test`; registro sigue sin API | [`../decisions/2026-09-06-verifik-rethus-sandbox.md`](../decisions/2026-09-06-verifik-rethus-sandbox.md) |
| 2026-09-06 | Historia clínica en 7 one-pagers; sin modal SOAP ni RIPS | [`../decisions/2026-09-06-historia-clinica-wizard.md`](../decisions/2026-09-06-historia-clinica-wizard.md) |
| 2026-09-21 | Ficha pública: layout de lectura (pestañas + agenda sticky), no marketplace | [`../decisions/2026-09-21-ficha-publica-layout.md`](../decisions/2026-09-21-ficha-publica-layout.md) |
| 2026-09-23 | Portal: un Guardar en Perfil; Citas/Opiniones en web, Cita en móvil | [`../decisions/2026-09-23-portal-citas-opiniones.md`](../decisions/2026-09-23-portal-citas-opiniones.md) |
| 2026-09-24 | Paso 3 REPS: sede y grupos de servicio, revisión humana, no abre el buscador | [`../decisions/2026-09-24-paso-reps.md`](../decisions/2026-09-24-paso-reps.md) |
| 2026-09-24 | Home público: inventario primero; la card abre la ficha | [`../decisions/2026-09-24-home-marketplace.md`](../decisions/2026-09-24-home-marketplace.md) |
| 2026-09-24 | Landing: hero corto “Encuentra doctores verificados” y foto; sigue en las especialidades | [`../decisions/2026-09-24-landing-hero.md`](../decisions/2026-09-24-landing-hero.md) |
| 2026-09-24 | Directorio: footer con Privacidad y Términos de la fase 1 | [`../decisions/2026-09-24-privacidad-terminos.md`](../decisions/2026-09-24-privacidad-terminos.md) |
| 2026-09-24 | Analítica admin: cohorte demo en memoria, no eventos reales | [`../decisions/2026-09-24-analitica-admin.md`](../decisions/2026-09-24-analitica-admin.md) |

Supersedidas: la verificación automática en el paso 2 (20 ago) quedó anulada el 21 ago. `/api/rethus-check` sigue en `server.ts` pero la UI no lo usa. “Sin hero” del home (24 sep, marketplace) quedó reemplazado el mismo día por el hero corto del landing.
