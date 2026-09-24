# 2026-09-24 — Privacidad y términos en el directorio

**Decisión:** el directorio público tiene un footer con Privacidad y Términos. Los textos describen la fase 1: HealthBit es directorio, no IPS; RETHUS es revisión humana; los datos de salud no van al buscador; citas e historia viven en la sesión. Ley 1581 de 2012 y Decreto 1377 de 2013.

**Por qué:** el landing necesita el aviso de datos antes de que haya persistencia real. No se inventa NIT ni archivo clínico.

**Vigencia:** `LegalPages.tsx`, footer en `PatientDirectory.tsx`. No sale en la ficha del médico ni en el portal.

**Detectable:** al pie, “Privacidad” abre la política y “Términos y condiciones” abre los términos. Volver regresa al directorio.
