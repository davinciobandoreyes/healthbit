# 2026-09-05 — Alta y ficha sociodemográfica

- `PatientRecord`: `origin`, `educationLevel`, `maritalStatus`, `eps`. `city` = procedencia.
- Listas EPS / escolaridad / estado civil / sexo / RH en `src/data/patientCatalog.ts`.
- Modal de alta en `PatientsSection.tsx`: 11 datos + clínicos. Obligatorio nombre e identidad.
- Ficha: tarjeta “Datos sociodemográficos” editable (`onUpdatePatient`). Sin localStorage.
- Mocks (Laura, Carlos, Mariana, Andrés) rellenados.

No tocar: no pedir email; no quitar diagnóstico / procedimiento / alertas.
