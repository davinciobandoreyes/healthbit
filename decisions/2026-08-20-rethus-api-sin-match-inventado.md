# 2026-08-20 — `/api/rethus-check` no inventa un “sí”

**Contexto:** el endpoint devolvía siempre registrado. Se reconectó a datos.gov.co (`my8c-6xkk`).

**Decisión:** si no hay fila, `found: false`. Nunca fabricar un match. El dataset público está agregado y no trae cédulas; el fallo “no encontrada” es el resultado correcto hoy.

**Vigencia:** el contrato del endpoint sigue; la UI del registro ya no lo llama (ver 2026-08-21).
