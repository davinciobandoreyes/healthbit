# 2026-09-06 — Wizard de historia clínica

Se reemplazó el modal SOAP de la ficha por un flujo de 7 one-pagers (`ClinicalHistoryFlow`): motivo, enfermedad actual, antecedentes, sistemas, examen, CIE-10, tratamiento. Sin RIPS.

`PatientsSection` monta el wizard con `isWritingHistory` (profundidad 2). Al guardar se añade `ClinicalNote.historia`, se deriva SOAP para mocks viejos, y se puede actualizar `primaryDiagnosis` / `medicalHistory`.

Gemini: `POST /api/categorize-illness`. Sin key → `fallback: true` + chips locales. Catálogo CIE-10 en `src/data/cie10Catalog.ts`.
