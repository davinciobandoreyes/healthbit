---
name: actualizar-contexto
description: >-
  Actualiza la memoria persistente del repo (state, decisions, logs, reglas)
  y la deja más corta. Usar al cerrar una sesión importante, cuando el usuario
  pida compactar contexto, o tras una decisión de producto. No usar en cada mensaje.
---

# Actualizar contexto

Correr **al cerrar una sesión importante**, no en cada turno. Sesión importante = se fusionó un flujo, se tomó una decisión, se descubrió un gotcha, o el usuario se va.

## Qué actualizar

1. `state/current.md` — hecho / pendiente / blockers. Una línea por ítem. Fecha arriba. Borrar lo que ya no es verdad.
2. `decisions/` — solo si hubo una decisión nueva (qué, por qué, vigencia). Añadir fila en `Contexto/decisiones.md`. Si una decisión anula otra, marcarlo ahí; no borrar el archivo viejo, marcar vigencia.
3. `logs/` — un archivo `YYYY-MM-DD-tema.md`, 5–15 líneas: qué cambió, dónde, qué no tocar. Cero transcripts.
4. `gotchas/` — solo si apareció una trampa reproducible. Una causa + un síntoma + un arreglo.
5. `reglas.md` — solo si nació o murió una línea roja detectable. Eco en `Contexto/reglas.md` si cambió el resumen.
6. `AGENTS.md` — solo punteros/invariantes que cambiaron. **No** pegar el log. Máx. 300 líneas; si pasa, mover detalle a `Contexto/` o `gotchas/`.
7. `Contexto/design.md` — solo si cambió un flujo o un token. El spec largo sigue en `DESIGNHealthBit.md`.

## Cómo mantenerlo corto

- Comprimir logs de más de ~30 días o irrelevantes: una línea en el índice o borrar.
- No copiar historial de chat ni diffs al prompt ni a estos archivos.
- No duplicar: `Contexto/decisiones.md` es índice; el razonamiento vive en `decisions/`.
- No crear archivos “por si acaso”. Si no hay decisión nueva, no hay archivo nuevo.
- Preferir editar `state/current.md` a escribir un log vacío.

## Resultado

Contexto **al día y más corto** que al empezar: `state/` refleja el repo, las decisiones nuevas están fechadas, `AGENTS.md` no creció de relleno, y el siguiente agente puede arrancar con `AGENTS.md` + `reglas.md` + `state/current.md` sin releer el chat.
