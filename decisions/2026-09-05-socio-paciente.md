# 2026-09-05 — Datos sociodemográficos del paciente

**Por qué:** el alta y la ficha pedían ocupación, origen, procedencia, escolaridad, estado civil y EPS; solo existían nombre, CC, edad, tel, RH y un `sexo` oculto.

**Decisión:**
- `city` = procedencia (residencia actual). `origin` = lugar de origen.
- EPS incluye **Particular** (sin afiliación).
- Obligatorio solo nombre e identidad. El resto opcional.
- Listas en `patientCatalog.ts`, no incrustadas en el modal.

**Vigencia:** mientras el expediente sea demo en memoria.
