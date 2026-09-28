# 2026-09-24 — Consulta RETHUS si el nombre no está en HealthBit

**Contexto:** el paciente busca a alguien que no tiene cuenta. No debe salir en el listado general.

**Decisión:** el listado sigue siendo solo médicos HealthBit (`verifiedStatus.rethus && !isPaused`). Si la búsqueda tiene al menos 3 caracteres y ningún médico HealthBit coincide con ese texto, `buildRethusLookup` arma un panel demo: está en RETHUS, habilitación, códigos, formación y prestación. El mismo nombre da los mismos códigos. El panel vive en `useState` y se pierde al recargar. No abre `DoctorOnePager`, no llama Verifik ni `/api/rethus-check`, y no inventa cédula. Si el nombre sí está en HealthBit y un filtro de ciudad lo oculta, sigue el vacío: no se inventa otra persona.

**Vigencia:** reemplaza el catálogo fijo de tarjetas solo RETHUS del mismo día. Hasta que la consulta salga de un registro real.
