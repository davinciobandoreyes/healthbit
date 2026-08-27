# 2026-08-25 — Cola: pendientes / aceptadas / negadas + pausa

**Decisión:**
- Admin filtra por `pending` | `approved` | `denied`.
- Pausar un aprobado lo saca del buscador (`isPaused`). Despausar lo devuelve.
- Modal de confirmación antes de aprobar, negar, pausar o reactivar.
- Aviso de “correo” sigue siendo demo.

**Filtro público:** `verifiedStatus.rethus && !isPaused`.
