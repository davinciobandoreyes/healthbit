# 2026-09-06 — Sandbox Verifik RETHUS, fuera del registro

**Contexto:** datos.gov.co no sirve para cruzar cédula. Verifik expone `GET /v2/co/cedula/rethus`.

**Decisión:** laboratorio en `/test` + proxy `POST /api/verifik-rethus`. El JWT (`VERIFIK_TOKEN`) vive en el servidor. El paso 2 del registro no llama Verifik.

**Vigencia:** hasta que se decida cablear el proxy al registro (exige cambiar `reglas.md`).
