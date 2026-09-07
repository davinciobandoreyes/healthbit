# 2026-09-06 — Sandbox Verifik en /test

Proxy `POST /api/verifik-rethus` en `server.ts` llama a Verifik con `VERIFIK_TOKEN`. HTML suelto en `public/test.html`, ruta Express `GET /test` **antes** de Vite. Sin token → 503, sin match inventado. El registro y `/api/rethus-check` no se tocaron.

Probar: `.env.local` con `VERIFIK_TOKEN`, `npm run dev`, http://localhost:3000/test.
