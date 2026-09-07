# 2026-09-06 — Alertas médicas como pills en el alta

Qué: el campo rojo de alertas salió de Clínico. Ahora es sección propia (como Identidad), pills ámbar, input slate abierto por default.

Dónde: `PatientCreateView.tsx`. Payload `alerts: string[]` en `PatientsSection` (ya no se parte por comas). Vacío → `Sin alertas críticas reportadas`.

UX: escribir + Enter o check agrega; + reabre si se cerró; X pide confirmación. Enter no envía el formulario.

No tocar: el banner rose de alertas en la ficha (`PatientDetailView`).
