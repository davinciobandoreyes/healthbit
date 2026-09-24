# Analítica admin es una cohorte demo

Fecha: 2026-09-24. Vigente.

El súper admin ve Analítica junto a la cola RETHUS. Las cifras salen de `getAnalytics` en `src/data/adminAnalytics.ts`: 180 días fijos por ciudad, sin `localStorage` y sin API. La pantalla lo dice.

Por qué: no hay almacén de eventos. Persistir clics rompería la regla de no guardar sesión. Cuando exista backend, el selector se puede alimentar con eventos reales sin cambiar las preguntas de la pantalla (embudo paciente, embudo de registro, visitas, acciones, comparación por ciudad).
