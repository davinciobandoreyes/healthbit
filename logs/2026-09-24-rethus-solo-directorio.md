# 2026-09-24 — Consulta RETHUS al buscar

Se quitó el catálogo fijo `rethusOnlyDoctors.ts`. El listado solo muestra médicos HealthBit.

Si la búsqueda no coincide con ninguno (3+ caracteres), `src/data/rethusLookup.ts` arma un panel demo en `useState`: habilitación, códigos, formación y prestación. No abre ficha. Recargar lo borra. No usa `localStorage` ni Verifik.

No tocar: el filtro `verifiedStatus.rethus && !isPaused`. Si el nombre sí está y la ciudad lo oculta, el vacío no inventa otra persona.
