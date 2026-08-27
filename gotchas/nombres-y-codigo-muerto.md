# Nombres y piezas huérfanas

**VerifyMD / Lovi:** `index.html` title, `server.ts` prompts y `console.log`. Producto = HealthBit. No copiar esos nombres a UI nueva.

**`/api/rethus-check`:** endpoint vivo, UI no lo llama. No “arreglar el paso 2” cableándolo de nuevo.

**`SpecialistDashboard.tsx`, `MobileFrame.tsx`:** no importados por `App.tsx`. El portal real es `HomeDashboard` + tabs.

**Fuente:** `index.html` carga Inter; clases del portal piden Plus Jakarta Sans (cae a fallback). No añadir otra familia sin cargarla.

**Médicos mock `@healthbit.co`:** emails de ficha en `mockDoctors.ts`. El login admin es el dominio, no esas fichas. No usar `dr.mendoza@healthbit.co` como usuario médico demo: entra a admin.
