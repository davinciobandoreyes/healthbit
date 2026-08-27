# Gemini fallback aprueba igual

**Síntoma:** cédula/selfie “verificados” sin API key o con Gemini caído.

**Causa:** en `server.ts`, `/api/verify-document` y `/api/verify-biometrics` en `catch` (y parse fallido) devuelven `success: true` con JSON inventado. Comentario en código: que la UX no se rompa.

**Qué hacer:** no venderlo como verificación oficial. Si se endurece, fallar visible y no avanzar el paso, o mostrar `fallback: true` en UI. No silenciar el fallback “para que se vea más real”.
