# Reglas — lo que el agente nunca debe hacer

Solo reglas violables y detectables. Si no se puede señalar un diff que las rompe, no pertenece aquí.

1. **No llamar `/api/rethus-check` desde el registro.** El paso 2 de `VerificationFlow` envía RETHUS a revisión humana. Restaurar consulta automática a datos.gov.co está prohibido salvo pedido explícito del usuario.
2. **No mostrar en el buscador a un médico con RETHUS pendiente, denegado o `isPaused`.** El filtro canónico es `doc.verifiedStatus.rethus && !doc.isPaused` en `PatientDirectory`.
3. **No tratar el fallback de Gemini como verificación real.** `/api/verify-document` y `/api/verify-biometrics` responden `success: true` con datos inventados si falta API key o hay error. No borrar el fallback “para que la demo no se rompa” sin decirlo; no afirmar en UI que el documento/selfie quedó “oficialmente verificado por IA” si vino de fallback.
4. **No implementar SMTP ni decir que se envió un correo real.** El aviso de RETHUS aprobado es copy en pantalla (`emailNotices` / `adminMailNotice`).
5. **No persistir sesión en localStorage, archivos o DB** salvo que el usuario lo pida. El estado vive en `App.tsx` y se pierde al recargar; eso es decisión, no olvido.
6. **No validar contraseña ni inventar auth real** en el modal. El login demo acepta cualquier password; el rol lo decide el email.
7. **No añadir un botón “entrar como admin”.** Cualquier `*@healthbit.co` al submit entra a `admin_review`. El médico demo no usa `@healthbit.co`.
8. **No cambiar el email demo del médico a `@healthbit.co`.** Debe seguir en un dominio que no dispare admin (`dra.restrepo@javeriana.edu.co`).
9. **No inventar tokens de color, fuentes nuevas ni iconos fuera de lucide-react.** Seguir `DESIGNHealthBit.md`. CTA primario = `violet-600`; pendiente = ámbar; canvas = `slate-50`.
10. **No poner saltos de línea en badges/chips** (falta `whitespace-nowrap`) ni targets táctiles < 44px.
11. **No reintroducir la marca VerifyMD / Lovi Clinical** en UI nueva. El producto se llama HealthBit.
12. **No montar `SpecialistDashboard` ni `MobileFrame`** como si fueran la app actual. No están cableados.
13. **No cargar en el prompt** `DESIGNHealthBit.md` entero, `dashboard.html`, `mockDoctors.ts` / `mockPatients.ts`, ni transcripts, si la tarea no los necesita.
14. **No dejar `AGENTS.md` por encima de 300 líneas.** Comprimir o mover detalle a `Contexto/`, `decisions/`, `gotchas/`.
15. **No copiar historial de chat a archivos de memoria.** En `logs/` solo un resumen de lo que cambió y por qué.
16. **No editar `reglas.md` con consejos blandos** (“haz buen diseño”, “sé consistente”). Si no es detectable, no entra.
