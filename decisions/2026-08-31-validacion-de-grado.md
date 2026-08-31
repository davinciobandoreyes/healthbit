# 2026-08-31 — Validación de grado en el registro

**Por qué:** el médico debe poder adjuntar diplomas y actas sin bloquear el alta si aún no los tiene.

**Decisión:**
- Paso 6, después del selfie. No Gemini ni API.
- Dos zonas de carga múltiple: diplomas y actas. Chip Médico / Especialización por archivo.
- Nada es obligatorio. `Omitir por ahora` cierra sin archivos; Finalizar guarda lo que haya (incluido vacío).
- `verifiedStatus.diploma` sigue en `false` al salir (enviado ≠ aprobado).

**Detectable:** el stepper dice “Paso X de 6”; el paso 5 ya no finaliza la cuenta.
