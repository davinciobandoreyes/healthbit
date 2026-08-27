# 🎨 VerifyMD / HealthBit — Design System Specification (DESIGN.md)

Este documento consolida y estandariza las decisiones de diseño de interfaz de usuario (UI), experiencia de usuario (UX), arquitectura de componentes y tokens visuales aplicados en la plataforma. Su objetivo es garantizar la coherencia visual y funcional en todas las iteraciones futuras.

---

## 1. Principios Fundamentales de Diseño

1. **Mobile-First Ergonomics & 100% Responsive**:
   - Todo flujo y pantalla está diseñado prioritariamente para el pulgar y pantallas táctiles móviles, escalando progresivamente a tablet y escritorio.
   - Objetivos táctiles mínimos de **44px × 44px** en todos los elementos interactivos (`min-h-[44px]`, `min-h-[48px]`).
   - Evitar scrolls verticales innecesarios condensando la información en tarjetas equilibradas y horizontales.

2. **Claridad Clínica y Jerarquía Médica**:
   - Presentación de datos limpios, sintéticos y sin sobrecarga cognitiva.
   - Eliminación de elementos decorativos innecesarios (anti-slop): sin gradientes estridentes, sin sombras excesivas, sin tarjetas anidadas redundantes.

3. **Cero Líneas Dobles en Microcopy**:
   - Badges, estados, fechas cortas y píldoras deben mantenerse en **una sola línea** utilizando la regla `whitespace-nowrap`.

4. **Consistencia de Layout y Reutilización**:
   - Las vistas de módulos hermanos (ej. *Analítica de Pacientes*, *Rendimiento y Citas*, *Documentos*) comparten la misma estructura geométrica, espaciados y jerarquía de tarjetas.

---

## 2. Paleta de Colores y Tokens (@theme)

### Tokens CSS Definidos (`src/index.css`)
```css
@theme {
  --color-indigo-ink: #4f46e5;         /* Companion azulado (Indigo 600) */
  --color-porcelain: #f8fafc;          /* Fondo base de la app (Slate 50) */
  --color-paper-white: #ffffff;        /* Fondo de tarjetas y modales */
  --color-verified: #8b5cf6;           /* Verificación / Éxito (Violet 500) */
  --color-text-secondary: #475569;     /* Texto secundario de alta legibilidad (Slate 600) */
  --color-text-tertiary: #94a3b8;      /* Texto terciario y placeholders (Slate 400) */
  --color-border-subtle: #e2e8f0;      /* Bordes sutiles y divisores (Slate 200) */
  --color-surface-tertiary: #f1f5f9;   /* Fondos suaves de campos y tabs (Slate 100) */
  --color-lavender-mist: #c7d2fe;      /* Acentos sutiles y focus states (Indigo 200) */
}
```

### Escalas de Color Semánticas (Tailwind Utilities)

| Rol Semántico | Clase de Fondo | Clase de Texto | Clase de Borde | Uso Principal |
| :--- | :--- | :--- | :--- | :--- |
| **Acción Primaria / Éxito** | `bg-violet-600` (`hover:bg-violet-700`) | `text-white` | `border-violet-500/40` | Botones principales, estados activos, CTA flotante. |
| **Acreditado / Verificado** | `bg-violet-50` | `text-violet-700` | `border-violet-200/80` | Badges de documentos acreditados, RETHUS activo. |
| **En Auditoría / Pendiente** | `bg-amber-50` | `text-amber-700` | `border-amber-200/80` | Estados pendientes de revisión, alertas clínicas. |
| **Informativo / Analítica** | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200/80` | Especialidad, conversión, tráfico de perfil. |
| **Canvas / Neutro Principal** | `bg-slate-50` | `text-slate-900` | `border-slate-200/80` | Fondo general de la aplicación y bordes de tarjeta. |
| **Superficie de Tarjeta** | `bg-white` | `text-slate-900` | `border-slate-200/80` | Contenedores de contenido y modales. |

---

## 3. Sistema Tipográfico

- **Fuente Base (App UI)**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Fuente de Display / Dashboard**: `Plus Jakarta Sans, sans-serif` (vía clase `font-['Plus_Jakarta_Sans',sans-serif]`)

### Escala Tipográfica y Jerarquía

| Nivel | Clases Tailwind | Peso | Uso |
| :--- | :--- | :--- | :--- |
| **Display / H1** | `text-xl sm:text-2xl font-black tracking-tight` | Black (900) | Encabezados de sección (Dashboard, Documentos, Pacientes). |
| **Subtítulo H2** | `text-base sm:text-lg font-bold text-slate-900` | Bold (700) | Títulos de tarjetas principales y modales. |
| **Título Tarjeta H3**| `text-xs sm:text-sm font-bold text-slate-900` | Bold (700) | Nombres de pacientes, títulos de documentos, métricas. |
| **Cifra Métrica (KPI)**| `text-xl sm:text-2xl font-black tracking-tight` | Black (900) | Valores numéricos destacados en cards analíticas. |
| **Body / Datos** | `text-xs sm:text-sm font-normal text-slate-600` | Regular (400) / Semibold (600) | Textos descriptivos, diagnósticos, inputs de texto. |
| **Microcopy / Badges**| `text-[10px] sm:text-[11px] font-bold uppercase tracking-wider` | Bold (700) / Extrabold (800) | Píldoras de estado, categorías, etiquetas de campos. |

---

## 4. Espaciado, Elevación y Radios de Borde

### Regla Matemática de Radios Anidados
Para evitar bordes que compitan visualmente, el radio interior se calcula mediante:
$$\text{Radio Interior} = \text{Radio Exterior} - \text{Padding}$$

- **Contenedores Principales / Modales**: `rounded-3xl` (24px) con `p-6` o `p-8`.
- **Tarjetas Interactivas y Módulos**: `rounded-2xl` (16px) con `p-4` o `p-5`.
- **Bloques Internos / Inputs / Botones**: `rounded-xl` (12px) con `p-3` o `p-2.5`.
- **Píldoras de Filtro, Badges y Botón Flotante**: `rounded-full` (9999px) con `px-3 py-1.5` o `px-6 py-3`.

### Elevaciones y Sombras
- **Tarjetas estándar**: `shadow-2xs` o `shadow-xs` con borde explícito `border border-slate-200/80`.
- **Botón Flotante / Fixed**: `shadow-lg shadow-violet-600/30` con micro-borde `border border-violet-500/40`.
- **Modales con Backdrop**: `shadow-2xl` con `bg-slate-900/60 backdrop-blur-xs`.

---

## 5. Patrones de Componentes Estandarizados

### A. Contenedores de Iconos (Icon Containers)
Todos los iconos de indicadores métricos y encabezados de tarjeta utilizan el formato unificado:
- **Dimensiones**: `w-9 h-9` o `w-8 h-8` con `rounded-xl`.
- **Fondo Tonal y Color**: `bg-violet-50 text-violet-600`, `bg-indigo-50 text-indigo-600` o `bg-amber-50 text-amber-600`.
- **Icono**: `w-4 h-4` (o `w-3.5 h-3.5` para micro-bloques) de `lucide-react`.

### B. Sistema de Filtros Unificado (Search & Filter Bar)
Replicado consistentemente en *Pacientes* y *Documentos*:
1. **Buscador (Izquierda)**: Campo de texto con icono `Search` a la izquierda, borde `border-slate-200/80`, focus `focus:border-violet-600`, y radio `rounded-2xl`.
2. **Pestañas de Categoría (Derecha)**: Píldoras horizontales con scroll horizontal suave (`overflow-x-auto scrollbar-none`):
   - **Activo**: `bg-violet-600 text-white shadow-xs font-bold`.
   - **Inactivo**: `bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 font-bold`.

### C. Tarjetas de Documentos y Pacientes (Anti-Vertical Scroll)
- **Estructura en 2 Columnas**: Layout responsive `grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4`.
- **Fila Superior**: Icono estilizado + Título con `line-clamp-1` + Badge de estado (`whitespace-nowrap`).
- **Fila Media**: Entidad emisora o diagnóstico en texto sintético (`text-[11px] text-slate-500 truncate`).
- **Fila Inferior / Acciones**: Divisor superior sutil `border-t border-slate-100`, meta-información a la izquierda y botones de acción cortos (*«Ver»*, *«Descargar»*) a la derecha.

### D. Botón de Acción Principal Flotante (Fixed Bottom-Right CTA)
- **Ubicación**: `fixed inset-x-0 bottom-20 sm:bottom-22 z-40 pointer-events-none`, con columna `max-w-7xl mx-auto px-4 sm:px-6 flex justify-end` (derecha, sobre la tab bar).
- **Botón**: `pointer-events-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 border border-violet-500/40 cursor-pointer whitespace-nowrap`.
- **Texto**: Directo y conciso (ej. *«Subir documento»*).

### E. Barra de Navegación Inferior (iOS-Style Bottom Tab Bar)
- **Ubicación**: `fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-t border-slate-200/80`.
- **Píldora Activa**: Indicador superior `absolute top-1.5 w-10 h-1 rounded-full bg-violet-600`.
- **Iconos**: Tamaño `w-5 h-5` a `w-5.5 h-5.5` con trazo reforzado `stroke-[2.5]` para el elemento activo.
- **Microcopy**: Tipografía `text-[11px] sm:text-xs font-bold text-violet-700` cuando está seleccionado.

### F. Stepper de Verificación (Sticky Top Stepper)
- Anclado en la parte superior del flujo con fondo blanco translúcido (`backdrop-blur-md`).
- Círculos de paso de 32px (`w-8 h-8 rounded-full`) con líneas conectoras continuas de 2px.
- Estados: *Completado* (`bg-violet-600 text-white`), *Activo* (`bg-violet-600 ring-4 ring-violet-100 text-white`), *Pendiente* (`bg-slate-100 text-slate-400 border border-slate-200`).

---

## 6. Guía de Redacción UI (UX Writing)

- **Verbos de Acción Claros**: Usar *«Subir documento»*, *«Descargar»*, *«Ver soporte»*, *«Continuar»*, *«Finalizar verificación»*.
- **Sin Redundancias**: Evitar palabras innecesarias como "nuevo", "haga clic aquí para", o frases explicativas de más de dos líneas.
- **Nomenclatura Médica Oficial**: Utilizar términos regulados precisos (*«RETHUS»*, *«Registro Profesional»*, *«Pre-Quirúrgico»*, *«Post-Op Activo»*, *«Alta Médica»*).

---

## 7. Criterios de Aceptación de Futuras Pantallas

Toda nueva vista o componente que se agregue al proyecto debe validar la siguiente lista de verificación:
- [ ] ¿Respeta los colores semánticos (`violet-600`, `slate-50`, `white`, etc.) sin inventar nuevos tonos?
- [ ] ¿Los botones y campos táctiles tienen al menos 44px de altura accesible?
- [ ] ¿Se evitaron saltos de línea indeseados en badges y chips con `whitespace-nowrap`?
- [ ] ¿Las tarjetas mantienen una distribución compacta y evitan scrolls verticales excesivos?
- [ ] ¿Los iconos provienen exclusivamente de `lucide-react` con contenedores estandarizados `rounded-xl`?
- [ ] ¿El sistema de filtros reutiliza el patrón de búsqueda + píldoras horizontales?
