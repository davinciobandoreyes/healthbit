# 2026-08-25 — Admin por dominio `@healthbit.co`

**Por qué:** un botón “cuenta admin demo” confundía con el login del médico.

**Decisión:**
- `email.endsWith('@healthbit.co')` → `viewMode = 'admin_review'` en `App.tsx`.
- Médico demo: `dra.restrepo@javeriana.edu.co` (no `@healthbit.co`).
- Sin segundo CTA de admin en el modal.

**Detectable:** si el email demo del médico vuelve a `@healthbit.co`, “Ingresar” abre la cola, no el portal.
