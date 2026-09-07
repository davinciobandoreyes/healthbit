# Historia clínica: wizard de 7 one-pagers

**Vigente.**

Toda nota nueva (inicial o evolución) usa `ClinicalHistoryFlow`, no el modal SOAP. Cada fase es una página con stepper. Los campos son opcionales: se guardan vacíos y al revisar se leen como “Sin información”. Diagnóstico es typeahead sobre `cie10Catalog.ts`. RIPS queda fuera.

Categorizar enfermedad actual llama `POST /api/categorize-illness`. Si Gemini falta o falla, hay fallback por palabras clave y la UI dice “Sugerencias locales”.
