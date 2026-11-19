---
name: Better URJC Calendar
description: El Excel de exámenes de la URJC, convertido en un calendario que se entiende de un vistazo.
colors:                   # tokens de src/index.css (claro / oscuro)
  primary: "#E4002B"
  primary-dark: "#FF5A64"
  sobre-primary: "#FFFFFF"
  sobre-primary-dark: "#0C0A09"  # stone-950
  tertiary: "#006D93"
  tertiary-dark: "#38BDF8"  # sky-400
  enlace: "#1D4ED8"       # blue-700
  enlace-dark: "#60A5FA"  # blue-400
  lienzo: "#F5F5F4"       # stone-100
  lienzo-dark: "#0C0A09"  # stone-950
  superficie: "#FFFFFF"
  superficie-dark: "#1C1917"  # stone-900
  superficie-alta: "#E7E5E4"  # stone-200
  superficie-alta-dark: "#292524"  # stone-800
  borde: "#E7E5E4"        # stone-200
  borde-dark: "#292524"   # stone-800
  borde-fuerte: "#D6D3D1" # stone-300: selects y zona de subida
  borde-fuerte-dark: "#57534E"  # stone-600
  texto: "#1C1917"        # stone-900
  texto-dark: "#F5F5F4"   # stone-100
  texto-suave: "#57534E"  # stone-600
  texto-suave-dark: "#A8A29E"  # stone-400
  error: "#DC2626"        # red-600
  error-dark: "#F87171"   # red-400
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
- **`primary` (rojo URJC `#E4002B`, `#FF5A64` en oscuro)**: acciones principales (CTAs, "Importar", "Exportar a .ics"), elemento activo de la navegación, marca ("Better URJC Calendar"), cuenta atrás de `NextExams` y borde izquierdo de las tarjetas de examen. Es escaso a propósito: si todo es rojo, nada destaca.
- **`tertiary` (azul `#006D93`, `#38BDF8` en oscuro)**: acento secundario puntual (icono de calendario en Características). No usar para acciones.
- **`sobre-primary`**: texto e iconos encima de `bg-primary` (nunca `text-white` a mano). Blanco en claro y casi negro en oscuro: el rojo oscuro tiene que ser claro para leerse como texto, y entonces el blanco encima no llega a AA. Igual en todos los botones rojos.
- **`texto` / `texto-suave`**: texto principal y de apoyo (descripciones, plan, metadatos).
- **Superficies**: `lienzo` (fondo de página) < `superficie` (tarjetas, barra lateral, formularios, avisos sobre el lienzo) < `superficie-alta` (chips, hovers y lo que va encima de una superficie). `borde` para todos los bordes; `borde-fuerte` para los controles que tienen que verse como tales (selects, zona de subida discontinua). Las capturas de la guía llevan `border border-borde` para no flotar sobre el oscuro.
- **Elevación**: en claro, sombras suaves (`shadow-sm`/`md`); en oscuro, cada nivel es un escalón más claro (`stone-950` → `stone-900` → `stone-800`) y las sombras se quitan (`dark:shadow-none`, no se ven sobre negro): lo que se eleva lleva `border border-borde` en los dos temas.
- **Enlaces de texto**: dentro de un párrafo, `text-enlace underline underline-offset-2 hover:decoration-2` (subrayados: el color solo no basta, WCAG 1.4.1); sueltos (fuera de un párrafo), `text-enlace hover:underline` con `min-h-11`.
- **Foco**: anillo global `outline: 2px solid var(--primary)` con `outline-offset: 2px` en `:focus-visible` (`index.css`); no quitarlo con `outline-none`. Si el control real es `sr-only` (selector de archivo), su `label` lo pinta con `peer-focus-visible:`.
- **Zonas táctiles**: todo enlace o botón fuera de un párrafo mide ≥ 44×44 px (`min-h-11`, `size-11` en los de solo icono).
- **Errores**: `text-error` (no confundir con `primary`: un error no es una acción).
- **Neutros cálidos**: todos los grises salen de la escala `stone` de Tailwind (gris con un punto marrón), no de `gray` (azulado). Junto al rojo se ve más de papel y menos de plantilla. Elegido por el usuario el 2026-11-19 entre cinco paletas (opción A, «Rojo URJC sobrio»).
- Los tokens viven en `src/index.css` (`:root` y `.dark` → `@theme`) y ya cambian con el tema: en `className` van sin pareja `dark:`. Un color nuevo = un token nuevo ahí, nunca un hex ni un `gray-*` con su `dark:` en `className`.

### Contraste (WCAG 2.1, texto normal ≥ 4,5:1; grande ≥ 3:1)
| Par | Claro | Oscuro |
|---|---|---|
| `texto` sobre `lienzo` / `superficie` / `superficie-alta` | 16,0 · 17,5 · 13,9 | 18,1 · 16,0 · 13,9 |
| `texto-suave` sobre `lienzo` / `superficie` / `superficie-alta` | 7,0 · 7,6 · 6,1 | 7,8 · 6,9 · 6,0 |
| `primary` (texto) sobre `superficie` | 4,85 | 5,7 |
| `primary` (texto) sobre `lienzo` / `superficie-alta` | 4,4 · 3,9 → **solo texto grande** (títulos, marca) | 6,5 · 5,0 |
| `sobre-primary` sobre `primary` | 4,85 | 6,5 |
| `enlace` sobre `lienzo` / `superficie` / `superficie-alta` | 6,1 · 6,7 · 5,3 | 7,8 · 6,9 · 6,0 |
| `tertiary` sobre `lienzo` / `superficie` / `superficie-alta` | 5,3 · 5,8 · 4,6 | 9,2 · 8,2 · 7,1 |
| `error` sobre `superficie` | 4,8 | 6,3 |

En claro, el rojo URJC se queda en `#E4002B` aunque como texto pequeño solo aprueba sobre `superficie`: los enlaces y botones de texto que van sobre el lienzo usan `enlace` o una caja `superficie`.

## Tipografía
Inter 400/500/600/700 (Google Fonts). Escala corta: `text-5xl`/`3xl` bold para el título de página (más pequeño en móvil), `text-2xl` bold para secciones, `text-xl` bold para el nombre de la asignatura, `text-base` para cuerpo y `text-sm` medium para metadatos (plan, archivo seleccionado, avisos). Pesos: bold para jerarquía, medium para datos; evitar `extrabold` salvo el logotipo de la barra lateral.

## Componentes
- **CTA primario**: `bg-primary text-sobre-primary px-6 py-4 font-medium`, esquinas rectas, icono Tabler a la derecha, `hover:brightness-80`. En móvil ocupa todo el ancho (`w-full lg:w-fit`).
- **CTA secundario**: mismo tamaño, `border border-primary text-primary` sobre superficie.
- **Tarjeta de examen** (`NextExams`): superficie, `shadow-sm`, `border-borde` con `border-l-6 border-l-primary`; arriba chip de convocatoria + cuenta atrás ("Hoy", "Mañana", "Quedan N días"), luego asignatura y plan; a la derecha (abajo en móvil) fecha/hora y aula con iconos `IconCalendar`/`IconMapPin`.
- **Chip**: `bg-superficie-alta rounded-sm px-3 font-medium`.
- **Aviso informativo**: caja `border border-borde bg-lienzo rounded-sm p-4` (`bg-superficie` si va directamente sobre el lienzo) con icono a la izquierda (`IconInfoCircle`, `IconExclamationCircle`).
- **Estado vacío** (`EmptyState`): caja `superficie` con borde, icono de 32 px en `texto-suave`, título `text-lg` bold, una frase de apoyo y **siempre un siguiente paso** (sin datos → «Importar Excel»; filtros sin resultados → «Quitar filtros»; todo pasado → «Ver el calendario completo»; mes vacío → «Ir al próximo examen»). Sin datos, la cabecera del dashboard no muestra botones: el paso está en el estado vacío.
- **Zona de subida**: `border-2 border-dashed border-borde-fuerte rounded-lg`, `hover:border-primary`; el `<input type=file>` es `sr-only` y la `label` es el área clicable.
- **Selects de filtro**: `rounded-lg border border-borde-fuerte shadow-sm`, con `label` `sr-only` y el foco global.
- **Navegación del dashboard**: barra lateral (`superficie`) en `lg:` con logotipo y botones apilados; en móvil, barra inferior de 3 botones a un tercio de ancho cada uno. Activo = `bg-primary text-sobre-primary font-bold`.
- **Botón de tema**: círculo invertido (`bg-texto text-lienzo`) fijo abajo a la derecha; en el dashboard móvil va en `ReturnMobile`.

## Layout y responsive
- Mobile-first con un único corte en **`lg` (1024 px)**: por debajo, una columna, CTAs a ancho completo, navegación inferior y calendario en lista (`MobileCalendar`); por encima, barra lateral, rejilla mensual (`PCCalendar`) y mockup de calendario en la portada.
- El dashboard ocupa `h-dvh` y hace scroll solo en el contenido principal.
- Márgenes: `px-4` en móvil, `lg:p-12` en el dashboard y `lg:p-15` en la portada.
- Probar siempre a 375, 768 y ≥1024 px, en claro y oscuro, con y sin exámenes importados (estados vacíos incluidos: "Aún no hay exámenes", botón "Nuevo Calendario / Importar Excel").

## Movimiento
Solo transiciones cortas de color/brillo en hover (`duration-200/300`). El cambio de tema desactiva transiciones un frame (`.no-transitions`) para que no parpadee. Nada de animaciones de entrada. Con `prefers-reduced-motion: reduce`, `index.css` deja las transiciones y animaciones en 0 s (el cambio de estado se ve igual, sin fundido).

## No hacer
- Más de un color de acento por pantalla, o el rojo para cosas que no son acción/marca/urgencia.
- Hex sueltos, clases inventadas (`text-neuto`, `hover:bg-primary-dark`) o grises de Tailwind en lugar de tokens.
- Tarjetas dentro de tarjetas, sombras fuertes, degradados, glassmorphism, iconos decorativos sin función.
- Varios `h1` por página (las tarjetas de Características usan `h1`: es deuda, no patrón).
