# 2026-09-24 — Hero de marca en el home público

**Decisión:** bajo el header del buscador hay un hero corto: “Encuentra doctores verificados” y foto de doctora con pacientes. Sin pastillas ni línea “HealthBit · Colombia”. Sigue visible en todas las pestañas de especialidad. Se oculta al escribir en la búsqueda o al elegir ciudad. No sale en la ficha del médico.

**Por qué:** el home también es el landing. La marca tiene que presentarse antes del inventario, también al recorrer especialidades. El hero anterior se quitó porque empujaba la primera card; este es una banda, no una pantalla.

**Vigencia:** `PatientDirectory.tsx`, foto en `public/hero-doctores-verificados.png`. Reemplaza “sin hero” de [`2026-09-24-home-marketplace.md`](2026-09-24-home-marketplace.md) solo en ese punto. Siguen: búsqueda en vivo, la card abre la ficha, WhatsApp es icono, y solo `verifiedStatus.rethus && !isPaused`.

**Detectable:** el `h1` “Encuentra doctores verificados” sigue al elegir una especialidad. Al escribir en la búsqueda o elegir ciudad, ese bloque no está. En la ficha no está.
