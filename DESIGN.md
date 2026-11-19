---
name: Better URJC Calendar
description: El Excel de exámenes de la URJC, convertido en un calendario que se entiende de un vistazo.
colors:                   # tokens de src/index.css (claro / oscuro)
  primary: "#E4002B"
  primary-dark: "#FF2D3E"
  sobre-primary: "#FFFFFF"
  sobre-primary-dark: "#FFFFFF"
  tertiary: "#007AA4"
  tertiary-dark: "#FFFFFF"
  enlace: "#3B82F6"       # blue-500
  enlace-dark: "#3B82F6"
  lienzo: "#F3F4F6"       # gray-100
  lienzo-dark: "#111827"  # gray-900
  superficie: "#FFFFFF"
  superficie-dark: "#030712"  # gray-950
  superficie-alta: "#E5E7EB"  # gray-200
  superficie-alta-dark: "#1F2937"  # gray-800
  borde: "#E5E7EB"        # gray-200
  borde-dark: "#1F2937"   # gray-800
  texto: "#111827"        # gray-900
  texto-dark: "#F3F4F6"   # gray-100
  texto-suave: "#717171"
  texto-suave-dark: "#9CA3AF"  # gray-400
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
- **`sobre-primary`**: texto e iconos encima de `bg-primary` (nunca `text-white` a mano).
- **`texto` / `texto-suave`**: texto principal y de apoyo (descripciones, plan, metadatos).
- **Superficies**: `lienzo` (fondo de página) < `superficie` (tarjetas, barra lateral, formularios, avisos sobre el lienzo) < `superficie-alta` (chips, hovers y lo que va encima de una superficie). `borde` para todos los bordes. Los avisos dentro de un formulario usan `lienzo` (pozo hundido).
- **Enlaces de texto**: `text-enlace hover:underline`.
- **Errores**: `text-red-500` (no confundir con `primary`: un error no es una acción).
- Los tokens viven en `src/index.css` (`:root` y `.dark` → `@theme`) y ya cambian con el tema: en `className` van sin pareja `dark:`. Un color nuevo = un token nuevo ahí, nunca un hex ni un `gray-*` con su `dark:` en `className`.

## Tipografía
Inter 400/500/600/700 (Google Fonts). Escala corta: `text-5xl`/`3xl` bold para el título de página (más pequeño en móvil), `text-2xl` bold para secciones, `text-xl` bold para el nombre de la asignatura, `text-base` para cuerpo y `text-sm` medium para metadatos (plan, archivo seleccionado, avisos). Pesos: bold para jerarquía, medium para datos; evitar `extrabold` salvo el logotipo de la barra lateral.

## Componentes
- **CTA primario**: `bg-primary text-sobre-primary px-6 py-4 font-medium`, esquinas rectas, icono Tabler a la derecha, `hover:brightness-80`. En móvil ocupa todo el ancho (`w-full lg:w-fit`).
- **CTA secundario**: mismo tamaño, `border border-primary text-primary` sobre superficie.
- **Tarjeta de examen** (`NextExams`): superficie, `shadow-sm`, `border-borde` con `border-l-6 border-l-primary`; arriba chip de convocatoria + cuenta atrás ("Hoy", "Mañana", "Quedan N días"), luego asignatura y plan; a la derecha (abajo en móvil) fecha/hora y aula con iconos `IconCalendar`/`IconMapPin`.
- **Chip**: `bg-superficie-alta rounded-sm px-3 font-medium`.
- **Aviso informativo**: caja `border border-borde bg-lienzo rounded-sm p-4` (`bg-superficie` si va directamente sobre el lienzo) con icono a la izquierda (`IconInfoCircle`, `IconExclamationCircle`).
- **Zona de subida**: `border-2 border-dashed rounded-lg`, `hover:border-primary`; el `<input type=file>` es `sr-only` y la `label` es el área clicable.
- **Selects de filtro**: `rounded-lg border shadow-sm focus:ring-2 focus:ring-primary`.
- **Navegación del dashboard**: barra lateral (`superficie`) en `lg:` con logotipo y botones apilados; en móvil, barra inferior de 3 botones a un tercio de ancho cada uno. Activo = `bg-primary text-sobre-primary font-bold`.
- **Botón de tema**: círculo invertido (`bg-texto text-lienzo`) fijo abajo a la derecha; en el dashboard móvil va en `ReturnMobile`.

## Layout y responsive
- Mobile-first con un único corte en **`lg` (1024 px)**: por debajo, una columna, CTAs a ancho completo, navegación inferior y calendario en lista (`MobileCalendar`); por encima, barra lateral, rejilla mensual (`PCCalendar`) y mockup de calendario en la portada.
- El dashboard ocupa `h-dvh` y hace scroll solo en el contenido principal.
- Márgenes: `px-4` en móvil, `lg:p-12` en el dashboard y `lg:p-15` en la portada.
- Probar siempre a 375, 768 y ≥1024 px, en claro y oscuro, con y sin exámenes importados (estados vacíos incluidos: "Aún no hay exámenes", botón "Nuevo Calendario / Importar Excel").

## Movimiento
Solo transiciones cortas de color/brillo en hover (`duration-200/300`). El cambio de tema desactiva transiciones un frame (`.no-transitions`) para que no parpadee. Nada de animaciones de entrada; respetar `prefers-reduced-motion` si se añade alguna.

## No hacer
- Más de un color de acento por pantalla, o el rojo para cosas que no son acción/marca/urgencia.
- Hex sueltos, clases inventadas (`text-neuto`, `hover:bg-primary-dark`) o grises de Tailwind en lugar de tokens.
- Tarjetas dentro de tarjetas, sombras fuertes, degradados, glassmorphism, iconos decorativos sin función.
- Varios `h1` por página (las tarjetas de Características usan `h1`: es deuda, no patrón).
