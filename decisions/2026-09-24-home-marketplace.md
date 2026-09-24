# 2026-09-24 — Home del marketplace

**Decisión:** el buscador público muestra médicos de inmediato. No hay hero. La búsqueda vive bajo el header, no dentro de él. En móvil, especialidad y ciudad van en filas separadas. La card abre la ficha; WhatsApp es un icono.

**Por qué:** el hero y dos filas de filtros ocupaban media pantalla antes del primer médico. El marketplace es el inventario.

**Vigencia:** `PatientDirectory.tsx`. Siguen en el directorio solo `verifiedStatus.rethus && !isPaused`. REPS no se anuncia como universal; el sello sale solo si está aceptado. Chips de especialidad con 0 médicos no se muestran.

**Detectable:** no hay bloque “Encuentra medicos” ni botón Buscar. El primer card empieza cerca de los 200px.
