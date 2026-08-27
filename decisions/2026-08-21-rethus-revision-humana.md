# 2026-08-21 — RETHUS por super admin, no por API

**Por qué:** datos.gov.co no publica cédulas; UX pedía revisión humana. El doctor no debe quedar bloqueado en el paso 2.

**Decisión:**
- Paso 2: el médico declara RETHUS, ve aviso “en revisión”, sigue a cédula/selfie.
- Admin entra por el mismo modal (sin login nuevo).
- Cola y “correo” en memoria de React. Recargar borra registros nuevos.
- Buscador solo con RETHUS aprobado.

**No hacer:** volver a `fetch('/api/rethus-check')` en `VerificationFlow` sin pedido explícito.
