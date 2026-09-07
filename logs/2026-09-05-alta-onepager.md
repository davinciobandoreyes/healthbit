# 2026-09-05 — Alta de paciente como one-pager

- El modal `max-w-2xl` se salía del viewport. Reemplazado por pantalla completa.
- `PatientCreateView.tsx`: identidad + sociodemográficos + clínico. FAB / empty → `isCreating`.
- Cancelar vuelve al listado. Crear abre la ficha. Sin overlay.
