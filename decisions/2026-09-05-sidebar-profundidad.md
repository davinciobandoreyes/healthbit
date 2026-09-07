# 2026-09-05 — Sidebar solo en profundidad 1

**Por qué:** en alta y ficha el menú izquierdo compite con “Volver” y reduce el área de trabajo.

**Decisión:** `shouldShowSidebar(depth) => depth < 2`. Tabs inferiores no cambian. En profundidad 2+ la marca HealthBit vuelve al header.
