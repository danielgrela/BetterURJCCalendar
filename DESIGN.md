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
  none: "0"     # todos los botones (receta única de F6.11)
  sm: "4px"     # chips y líneas de la rejilla, selects, avisos, estados vacíos, nav lateral, iconos del Header
  md: "6px"     # tarjetas (examen, características, guía), rejilla mensual, diálogos
  lg: "8px"     # zona de subida y su icono
  full: "9999px" # botón de tema y número del día de hoy
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
- **`primary` (rojo URJC `#E4002B`, `#FF5A64` en oscuro)**: acciones principales (CTAs, "Importar", "Exportar a .ics"), elemento activo de la navegación, marca ("Better URJC Calendar", título de la portada), iconos de Características y de la guía, día de hoy en la rejilla y cuenta atrás de las tarjetas de examen. Es escaso a propósito: si todo es rojo, nada destaca.
- **`tertiary` (azul `#006D93`, `#38BDF8` en oscuro)**: acento secundario reservado; desde F6.4 ningún componente lo usa (los iconos de Características pasaron a `primary`). No usar para acciones.
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
Inter variable autoalojada (`@fontsource-variable/inter`, solo latin, precargada en `root.tsx`; sin peticiones a Google Fonts), con pesos 400/500/600/700. Escala corta: `text-5xl`/`3xl` bold para el título de página (más pequeño en móvil), `text-2xl` bold para secciones, `text-xl` bold para el nombre de la asignatura, `text-base` para cuerpo y `text-sm` medium para metadatos (plan, archivo seleccionado, avisos). Pesos: bold para jerarquía, medium para datos; evitar `extrabold` salvo el logotipo de la barra lateral.

## Componentes
- **Botones, una sola receta** (F6.11): todos con **esquinas rectas** (como los CTA de siempre), `min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium`, icono Tabler de 20 px con `aria-hidden`. Tres tipos:
  - **Primario**: `bg-primary text-sobre-primary hover:brightness-90`. Uno por vista.
  - **Secundario**: `border border-primary bg-superficie text-primary`, al pasar el ratón se invierte (`hover:bg-primary hover:text-sobre-primary`; el rojo sobre `superficie-alta` no llega a AA en claro).
  - **Neutro** (Cancelar, Ahora no, Hoy): `border border-borde-fuerte bg-superficie text-texto hover:bg-superficie-alta`.
  - **Botón de texto**: `text-enlace font-semibold min-h-11 px-1 hover:underline` (Ver el calendario completo, Ir al próximo examen, enlaces de la 404).
  - Tamaño grande solo en portada y 404: añadir `py-4` (56 px). En móvil, `w-full lg:w-fit`. Solo-icono: `size-11`. Únicos redondos: el botón de tema (`rounded-full`) y los chips/línea de la rejilla (`rounded-sm`, no son botones de acción).
- **Exámenes, un solo sistema** (`ExamCard`, rediseño F6.9 elegido por el usuario): la jerarquía es siempre asignatura > fecha y hora > aula > convocatoria y plan, y se escribe en formato humano (`nombreLegible`: tipo frase con los romanos en mayúsculas; `fechaCorta`/`fechaLarga`; `horaLegible` con raya «12:00–14:00»; «Aula sin asignar» en vez de «-»). Nada de `uppercase` forzado ni `truncate` en el nombre.
  - **Tarjeta** (`variant="card"`: Próximos exámenes, lista móvil y detalle del día): bloque de fecha a la izquierda como en una agenda (`w-14`, `superficie-alta`, día `text-2xl` bold entre «lun» y «ene» a 12 px; va `aria-hidden` y la fecha larga está en `sr-only` dentro del título) y a la derecha asignatura (`text-base lg:text-lg` bold, en `texto`), hora y aula a 14 px con iconos en `texto-suave`, «Convocatoria · Quedan N días» (la cuenta atrás es lo único rojo) y el plan en `texto-suave`. Sin borde izquierdo de color. **Pasados**: fondo `lienzo` sin sombra, título en `texto-suave` y «Ya pasó» (atenuados sin bajar el contraste de AA, no con `opacity`).
  - **Línea** (`variant="line"`, celdas de la rejilla): chip `superficie-alta` a 12 px con la hora de inicio (`tabular-nums`, `texto-suave`) y el nombre en hasta 2 líneas (`line-clamp-2`); conflicto = `IconAlertTriangle` en `error` junto a la hora (y el texto en `sr-only`). Es un `button` que abre el detalle del día; en el mockup de la portada es un `div`.
- **Rejilla mensual** (`Calendar`): `rounded-md`, borde y `shadow-sm` como el resto; cabecera «Lun…Dom» a 14 px medium sin mayúsculas espaciadas; celdas `min-h-28` sin scroll interno, máximo 2 exámenes y «+N más» (`enlace`); hoy = número con anillo `ring-2 ring-primary` en `primary`, sin sombra. Al pulsar se abre un `<dialog>` con la fecha larga y las tarjetas del día (Esc, botón «Cerrar» o clic fuera). Cabecera: mes en `text-4xl` bold, botón «Hoy» (desactivado en el mes actual) y flechas en un grupo `rounded-sm` con `border-borde-fuerte`.
- **Lista móvil** (`MobileCalendar`): agrupada por mes con el `h2` del mes `sticky` (sin scroll anidado: hace scroll `main`) y botón «Ir al próximo examen» si hay pasados por encima.
- **Aviso de solapamiento** (dentro de `ExamCard`): texto, no solo color. Conflicto de horas: `IconAlertTriangle` + «Se solapa con ASIGNATURA (hora)» en `text-error`; mismo día sin cruce: `IconCalendarEvent` + «Mismo día que…» en `texto-suave`. En la rejilla solo se marca el conflicto (icono junto a la hora); el detalle del día da el texto completo.
- **Chip**: `bg-superficie-alta rounded-sm px-3 font-medium`.
- **Aviso informativo**: sobre el lienzo, caja `border border-borde bg-superficie rounded-sm p-4`; **dentro de una tarjeta**, sin caja (nada de tarjeta en tarjeta): fila separada con `border-t border-borde pt-6`. Icono a la izquierda en `texto-suave` (`IconInfoCircle`, `IconExclamationCircle`).
- **Estado vacío** (`EmptyState`): caja `superficie` con borde, icono de 32 px en `texto-suave`, título `text-lg` bold, una frase de apoyo y **siempre un siguiente paso** (sin datos → «Importar Excel»; filtros sin resultados → «Quitar filtros»; todo pasado → «Ver el calendario completo»; mes vacío → «Ir al próximo examen»). Sin datos, la cabecera del dashboard no muestra botones: el paso está en el estado vacío.
- **Zona de subida**: `border-2 border-dashed border-borde-fuerte rounded-lg`, `hover:border-primary`; el `<input type=file>` es `sr-only` y la `label` es el área clicable.
- **Selects de filtro**: `rounded-sm border border-borde-fuerte shadow-sm min-h-11`, con `label` visible encima (`text-sm` medium `texto-suave`: «Convocatoria», «Mostrar») y opciones cortas («Todas», «Todos», «Solo pendientes»); en móvil, rejilla de 2 columnas a todo el ancho.
- **Navegación del dashboard**: barra lateral (`superficie`) en `lg:` con logotipo y botones apilados; en móvil, barra inferior de 3 botones a un tercio de ancho cada uno. Activo = `bg-primary text-sobre-primary font-bold`.
- **Portada**: la frase «De Daniel para Daniel (y amigos)» es una línea `text-sm` en `texto-suave`, sin píldora ni icono. El visual es el `Calendar` real a tamaño nativo (`compact`: celdas `min-h-20`, sin detalle al pulsar) con los datos de ejemplo de `jsonMockup.json`, en un `figure` con pie «Ejemplo: …» para quien aún no ha usado la app. Las tarjetas de Características son `superficie` con borde fino y el icono suelto en `primary` (sin cuadro de color ni borde lateral). Nada crece al pasar el ratón: los iconos del `Header` cambian de fondo.
- **Botón de tema**: círculo invertido (`bg-texto text-lienzo`) fijo abajo a la derecha; en el dashboard móvil va en `ReturnMobile`.

## Layout y responsive
- Mobile-first con un único corte en **`lg` (1024 px)**: por debajo, una columna, CTAs a ancho completo, navegación inferior y calendario en lista (`MobileCalendar`); por encima, barra lateral, rejilla mensual (`PCCalendar`) y mockup de calendario en la portada.
- El dashboard ocupa `h-dvh` y hace scroll solo en el contenido principal (`overflow-y-auto`: la barra solo aparece si hace falta).
- Márgenes: `px-4` en móvil, `lg:p-12` en el dashboard y `lg:p-15` en la portada.
- Probar siempre a 375, 768 y ≥1024 px, en claro y oscuro, con y sin exámenes importados (estados vacíos incluidos: «Aún no hay exámenes» con «Importar Excel»; sin datos, la cabecera del dashboard no muestra botones).

## Movimiento
Solo transiciones cortas de color/brillo en hover (`duration-200/300`). El cambio de tema desactiva transiciones un frame (`.no-transitions`) para que no parpadee. Nada de animaciones de entrada. Con `prefers-reduced-motion: reduce`, `index.css` deja las transiciones y animaciones en 0 s (el cambio de estado se ve igual, sin fundido).

## No hacer
- Más de un color de acento por pantalla, o el rojo para cosas que no son acción/marca/urgencia.
- Hex sueltos, clases inventadas (`text-neuto`, `hover:bg-primary-dark`) o grises de Tailwind en lugar de tokens.
- Tarjetas dentro de tarjetas, sombras fuertes, degradados, glassmorphism, iconos decorativos sin función.
- Varios `h1` por página.
- Bordes laterales gruesos de color en tarjetas, cuadros de icono de color, `hover:scale`, píldoras con icono como adorno.
