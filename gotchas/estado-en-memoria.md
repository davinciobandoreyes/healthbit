# Todo el estado de negocio está en memoria

**Síntoma:** recargar pierde médicos recién registrados, cola admin, pausas y avisos de “correo”. Pacientes nuevos en `PatientsSection` también.

**Causa:** `useState` en `App.tsx` (y en secciones). No hay localStorage ni DB. Mock inicial: `mockDoctors.ts` / `mockPatients.ts`.

**Qué hacer:** no tratarlo como bug. Si se pide persistir, es feature nueva. Hasta entonces, probar flujos de registro+admin **sin** recargar.
