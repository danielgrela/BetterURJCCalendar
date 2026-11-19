---
name: Better URJC Calendar
description: El Excel de exámenes de la URJC, convertido en un calendario que se entiende de un vistazo.
colors:
  primary: "#E4002B"
  primary-dark: "#FF2D3E"
  secundario: "#333333"
  secundario-dark: "#CCCCCC"
  tertiary: "#007AA4"
  tertiary-dark: "#FFFFFF"
  neutro: "#717171"
  fondo: "#F3F4F6"        # gray-100
  fondo-dark: "#111827"   # gray-900
  superficie: "#FFFFFF"
  superficie-dark: "#030712"  # gray-950
  borde: "#E5E7EB"        # gray-200
  borde-dark: "#1F2937"   # gray-800
  chip: "#E5E7EB"         # gray-200
  chip-dark: "#1F2937"    # gray-800
  enlace: "#3B82F6"       # blue-500
  error: "#EF4444"        # red-500
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "3rem"      # lg:text-5xl; text-3xl en móvil
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.875rem"  # text-3xl
    fontWeight: 700
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.25rem"   # text-xl
    fontWeight: 700
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"  # text-sm
    fontWeight: 500
rounded:
  none: "0"     # CTAs y botones de exportar
  sm: "4px"     # tarjetas de formulario, chips, nav lateral
  md: "6px"     # tarjetas de características, capturas
  lg: "8px"     # selects, zona de subida
  full: "9999px" # botón de tema
spacing:
  gutter: "16px"     # px-4 móvil
  gutter-lg: "48px"  # lg:p-12 dashboard
  hero-lg: "60px"    # lg:p-15 portada
  touch: "44px"
breakpoints:
  lg: "1024px"  # único corte relevante: cambia layout, barra de navegación y calendario
---

# DESIGN.md — Better URJC Calendar

Derivado del código actual (`src/index.css` y componentes). Si el código y este archivo discrepan, manda el código: actualizar este archivo en el mismo commit que el cambio visual.

## Carácter
Herramienta de estudiante para estudiantes ("De Daniel para Daniel (y amigos)"). Debe sentirse **institucional pero más clara que la web de la URJC**: el rojo URJC como único color de marca, mucho gris neutro y una jerarquía muy directa (qué examen, cuándo, dónde). Sin adornos: ni degradados, ni brillos, ni emojis, ni animaciones decorativas. La información manda; la interfaz se aparta.

## Color
- **`primary` (rojo URJC `#E4002B`, `#FF2D3E` en oscuro)**: acciones principales (CTAs, "Importar", "Exportar a .ics"), elemento activo de la navegación, marca ("Better URJC Calendar"), cuenta atrás de `NextExams` y borde izquierdo de las tarjetas de examen. Es escaso a propósito: si todo es rojo, nada destaca.
- **`tertiary` (azul `#007AA4`)**: acento secundario puntual (icono de calendario en Características). No usar para acciones.
- **`neutro` / `secundario`**: texto de apoyo y descripciones.
- **Fondos**: `gray-100` / `dark:gray-900` para el lienzo; `white` / `dark:gray-950` para superficies (tarjetas, barra lateral, formulario). Bordes `gray-200…400` / `dark:gray-600…800`.
- **Enlaces de texto**: `text-blue-500 hover:underline active:text-blue-800`.
- **Errores**: `text-red-500` (no confundir con `primary`: un error no es una acción).
- Los tokens viven en `src/index.css` (`:root` y `.dark` → `@theme`). Un color nuevo de marca = un token nuevo ahí, nunca un hex en `className`.

## Tipografía
Inter 400/500/600/700 (Google Fonts). Escala corta: `text-5xl`/`3xl` bold para el título de página (más pequeño en móvil), `text-2xl` bold para secciones, `text-xl` bold para el nombre de la asignatura, `text-base` para cuerpo y `text-sm` medium para metadatos (plan, archivo seleccionado, avisos). Pesos: bold para jerarquía, medium para datos; evitar `extrabold` salvo el logotipo de la barra lateral.

## Componentes
- **CTA primario**: `bg-primary text-white px-6 py-4 font-medium`, esquinas rectas, icono Tabler a la derecha, `hover:brightness-80`. En móvil ocupa todo el ancho (`w-full lg:w-fit`).
- **CTA secundario**: mismo tamaño, `border border-primary text-primary` sobre superficie.
- **Tarjeta de examen** (`NextExams`): superficie, `shadow-sm`, borde `gray-200` con `border-l-6 border-l-primary`; arriba chip de convocatoria + cuenta atrás ("Hoy", "Mañana", "Quedan N días"), luego asignatura y plan; a la derecha (abajo en móvil) fecha/hora y aula con iconos `IconCalendar`/`IconMapPin`.
- **Chip**: `bg-gray-200 dark:bg-gray-800 rounded-sm px-3 font-medium`.
- **Aviso informativo**: caja `border-gray-400 bg-gray-100 rounded-sm p-4` con icono a la izquierda (`IconInfoCircle`, `IconExclamationCircle`).
- **Zona de subida**: `border-2 border-dashed rounded-lg`, `hover:border-primary`; el `<input type=file>` es `sr-only` y la `label` es el área clicable.
- **Selects de filtro**: `rounded-lg border shadow-sm focus:ring-2 focus:ring-primary`.
- **Navegación del dashboard**: barra lateral blanca en `lg:` con logotipo y botones apilados; en móvil, barra inferior de 3 botones a un tercio de ancho cada uno. Activo = `bg-primary text-white font-bold`.
- **Botón de tema**: círculo invertido (negro en claro, blanco en oscuro) fijo abajo a la derecha; en el dashboard móvil va en `ReturnMobile`.

## Layout y responsive
- Mobile-first con un único corte en **`lg` (1024 px)**: por debajo, una columna, CTAs a ancho completo, navegación inferior y calendario en lista (`MobileCalendar`); por encima, barra lateral, rejilla mensual (`PCCalendar`) y mockup de calendario en la portada.
- El dashboard ocupa `h-dvh` y hace scroll solo en el contenido principal.
- Márgenes: `px-4` en móvil, `lg:p-12` en el dashboard y `lg:p-15` en la portada.
- Probar siempre a 375, 768 y ≥1024 px, en claro y oscuro, con y sin exámenes importados (estados vacíos incluidos: "Aún no hay exámenes", botón "Nuevo Calendario / Importar Excel").

## Movimiento
Solo transiciones cortas de color/brillo en hover (`duration-200/300`). El cambio de tema desactiva transiciones un frame (`.no-transitions`) para que no parpadee. Nada de animaciones de entrada; respetar `prefers-reduced-motion` si se añade alguna.

## No hacer
- Más de un color de acento por pantalla, o el rojo para cosas que no son acción/marca/urgencia.
- Hex sueltos, clases inventadas (`text-neuto`, `hover:bg-primary-dark`) o grises sin su `dark:`.
- Tarjetas dentro de tarjetas, sombras fuertes, degradados, glassmorphism, iconos decorativos sin función.
- Varios `h1` por página (las tarjetas de Características usan `h1`: es deuda, no patrón).
