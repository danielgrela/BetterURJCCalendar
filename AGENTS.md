# AGENTS.md — Better URJC Calendar

SPA que convierte el Excel oficial de exámenes de la URJC (servicios.urjc.es/examenes) en un calendario personal, con próximos exámenes y exportación a Excel e iCal (.ics). Todo ocurre en el navegador: no hay backend ni cuentas. React 19 + Vite 8 + Tailwind 4 (plugin `@tailwindcss/vite`) + React Router 7 en modo framework (`ssr: false` + `prerender`: sitio estático, sin servidor) + Zustand. **TypeScript (`.tsx`/`.ts`) con `strict`; sin `any`.** Idioma de trabajo y de la interfaz: español (no hay i18n).

## Comandos
- `npm run dev` → http://localhost:5173 · `npm run host` → igual, expuesto en la red local (para probar en el móvil)
- `npm run build` → `dist/client` (estático; prerenderiza `/` y `/dashboard/guia-de-uso`) · `npm run preview` → http://localhost:4173, responde como Vercel (lee `vercel.json`: reescrituras y 404 real)
- `npm run lint` → ESLint sobre `.js`/`.jsx`/`.ts`/`.tsx` (ignora `dist/`, `.claude/` y `.react-router/`)
- `npm run typecheck` → `react-router typegen` + `tsc` (genera en `.react-router/types` los tipos `./+types/<ruta>` de los módulos de ruta)
- `npm test` → Vitest (`vitest.config.ts`, entorno Node) sobre `src/**/*.test.ts`: solo lógica de `src/scripts/`, junto a cada archivo; `examenDePrueba.ts` da un `Examen` de ejemplo. Las fechas «de hoy» se pasan como parámetro (`hoy`), nunca se usa el reloj real en un test
- Verificación: `npm run build` + `npm run typecheck` + `npm run lint` + `npm test` + revisar en el navegador

## Mapa (solo lo que importa)
- `react-router.config.ts` → `appDirectory: 'src'`, `buildDirectory: 'dist'`, `ssr: false`, `prerender` (`/` y `/dashboard/guia-de-uso`) y `buildEnd`, que copia `__spa-fallback.html` a `404.html`. **Una página nueva pública va en `prerender`**
- `src/root.tsx` → documento HTML (`Layout`: script en línea `SCRIPT_TEMA_INICIAL` que aplica `.dark` y `data-tema` antes de pintar, `lang`, favicons, manifest, `preload` de Inter, `theme-color` y `og`/`twitter` comunes), `ToggleThemeButton` flotante de escritorio y `HydrateFallback` (título de respaldo en las rutas no prerenderizadas). No hay `index.html` ni `main.jsx`
- `src/routes.ts` → rutas, cada una en su chunk: `/` → `HeroPage` (portada) · `/dashboard` → `App` (layout con `SideBar` + `<Outlet>`) con hijas index → `HomePage`, `calendario` → `CalendarPage`, `importar` → `ImportPage`, `guia-de-uso` → `UseGuide` · `*` → `NotFound`. Importar de `react-router` (no `react-router-dom`)
- Prerender: lo prerenderizado se ejecuta en Node y luego se hidrata; no leer `window`/`localStorage` ni stores persistidos para decidir qué se pinta en `HeroPage`, `UseGuide`, `App`/`SideBar`, `root` (mismo HTML en Node y en el navegador, o habrá errores de hidratación). Por eso `ToggleThemeButton` elige el icono con `data-tema` en `<html>` (CSS) y lee el tema con `useSyncExternalStore` y `'sistema'` como valor del servidor, y `useMediaQuery` devuelve `false` en el servidor
- `src/App.tsx` → layout del dashboard: en móvil `flex-col-reverse` (la `SideBar` pasa a barra inferior y aparece `ReturnMobile` arriba); en `lg:` barra lateral fija a la izquierda
- `src/components/` (un componente por archivo, nombre en PascalCase):
  - Portada: `HeroPage` (Header + HeroPageMain + Features + Footer), `HeroPageMain` (titular, CTAs y `Calendar` en modo `compact` con `assets/jsonMockup.json`)
  - Dashboard: `SideBar`, `NavButtons` + `ButtonNavBar` (`NavLink` con `isActive`), `ReturnMobile`, `HomePage` (`DashboardHeader`, que incluye `ButtonsExportDashboard` —solo con datos— y en móvil lo baja al final con `display: contents` + `order`, y `NextExams`)
  - Calendario: `CalendarPage` decide con `useMediaQuery('(min-width: 1024px)')` entre `PCCalendar` (rejilla mensual `Calendar` con navegación de mes, «Hoy» y `<dialog>` con el detalle del día) y `MobileCalendar` (lista por meses con cabecera fija); ambos usan `FiltersCalendar`
  - `ExamCard`: el examen en dos formas, `card` (tarjeta con bloque de fecha: `NextExams`, `MobileCalendar` y detalle del día) y `line` (celda de `Calendar`, botón que abre el detalle)
  - `EmptyState` (estado vacío o sin resultados: icono, título, texto y siguiente paso; en `NextExams` y `CalendarPage`, que decide entre «Importar Excel» con `ImportButton` y «Quitar filtros») 
  - `PageMeta` (`<title>`, `description`, `canonical` y `og:title`/`og:description`/`og:url`, `twitter:*` y `noindex` por página con las etiquetas nativas de React 19; va dentro de cada página, no en `root.tsx`)
  - `AvisoActualizacion` (en `root.tsx`: registra el service worker y, tras un despliegue, avisa de que hay versión nueva con «Actualizar»/«Ahora no»; nunca recarga sola)
  - `ImportPage` (subida y validación del Excel), `UseGuide` (guía con capturas `assets/fotoguia0*.{png,jpg}`), `NotFound`, `ToggleThemeButton`
- `src/SocialIcons/Github.tsx` → icono SVG de GitHub (Tabler no trae logos de marca)
- `src/types/examen.ts` → tipos `Examen` (ver «Modelo de datos») y `FiltrosCalendario`
- `src/hooks/` → stores de Zustand (tipados con `create<Store>()`): `useFileStore` (exámenes importados, persistido en `localStorage` `file-storage`) · `useDarkMode` (tema `sistema`/`claro`/`oscuro`, persistido en `dark-mode` v1 con migración del `{ isDark }` antiguo; pone `.dark` y `data-tema` en `<html>` y en `sistema` sigue los cambios de `prefers-color-scheme`) · `useMediaQuery(query)` (hook de React, no store)
- `src/scripts/` → lógica sin UI:
  - `handleExcel.ts` → `excelTojson(file)`: lee la hoja 1 con `read-excel-file` (cargado con `import()` solo al importar), ignora las 2 primeras filas y mapea las columnas 1–10
  - `examen.ts` → `nombreAsignatura(ev)` (corta en el primer `(`), `diasHasta(fecha)`, `claveExamen(ev)` (`key` de listas) y el formato para mostrar: `nombreLegible`, `partesFecha`, `fechaCorta`, `fechaLarga`, `horaLegible`, `horaInicio`, `aulaLegible`
  - `sortEvents.ts` → `parseEventDate('DD-MM-YYYY')` (default) y `sortedEvents(json)` (por fecha y hora)
  - `filtersCalendar.ts` → `filtrarExamenes(examenes, filtros)` (convocatoria y "Pendientes") y `convocatoriasDe(examenes)`; el estado de los filtros vive en `CalendarPage`
  - `solapamientos.ts` → `detectarSolapamientos(examenes)` (pura, con tests): `Map` por `claveExamen` con `conflicto` (horas que se cruzan) o `mismoDia`; el mismo examen en otro grupo no cuenta. Se calcula en `NextExams` y `CalendarPage` sobre todos los exámenes y llega a `ExamCard` como `solapamiento`
  - `generateICS.ts` → `eventosICS(examenes)` (pura, con tests) y la descarga
  - `generateExcel.ts` → exporta con `write-excel-file` (cargado con `import()` solo al exportar); probado con un test de ida y vuelta con `handleExcel`
  - `tema.ts` → tipo `Tema`, `siguienteTema`, `esOscuro` y `temaDeEstado` (lee lo guardado, incluido el formato antiguo)
  - `temaInicial.ts` → texto del script del `<head>` (misma lógica que `temaDeEstado`; el test lo ejecuta) que aplica el tema guardado (o el del sistema) antes de hidratar
  - `generateExcel.ts` / `generateICS.ts` → descargas `horario_examenes.xlsx` / `.ics` con `descargarBlob(blob, nombre)` de `descargarBlob.ts`
- `src/index.css` → Tailwind, variante `dark` por clase `.dark`, fuente Inter autoalojada (`@fontsource-variable/inter`, solo latin, precargada en `root.tsx`) y tokens de color (ver DESIGN.md)
- `public/Examenes.xlsx` → Excel de ejemplo que se ofrece en la guía de uso
- `public/og-image.png` → imagen 1200×630 para Open Graph/Twitter (captura real del calendario)
- `public/robots.txt` y `public/sitemap.xml` → solo `/` y `/dashboard/guia-de-uso`; si se añade una ruta pública, añadirla al sitemap
- `src/assets/` y `public/*.png|ico` → imágenes (no leer, binarios)
- Documentación: `README.md` (para usuarios y quien quiera contribuir: qué hace, uso, privacidad, comandos, créditos), `DESIGN.md` (tokens, ratios de contraste y recetas de componentes) y `ROADMAP.md` (historial de fases y decisiones)
- `vercel.json` → `outputDirectory: dist/client`; reescribe a `/__spa-fallback.html` **solo** las rutas conocidas del dashboard (los archivos prerenderizados ganan a las reescrituras); el resto recibe `404.html` con estado 404. **Si se añade una ruta en `routes.ts`, añadirla también aquí** o dará 404 al recargar
- `vite.config.ts` → plugins de Tailwind, React Router, PWA (`vite-plugin-pwa`, `generateSW`: precache de todo `dist/client` menos `og-image.png` y `404.html`; navegación sin HTML propio → `__spa-fallback.html`) y `previewComoVercel` (solo para `npm run preview`). `buildEnd` de `react-router.config.ts` regenera el service worker tras el prerender para que entren esos HTML. El service worker no funciona en `npm run dev`; probarlo con `npm run build` + `npm run preview`

## Modelo de datos (examen)
Objeto con `Curso, Plan, Asignatura, CodigoPlan, CodigoAsignatura, CodigoGrupo, Convocatoria, Fecha, Hora, Aula`, tal y como sale de `handleExcel`.
- `Fecha` = `"DD-MM-YYYY"` (texto, no `Date`); parsear siempre con `parseEventDate`
- `Hora` = `"HH:MM - HH:MM"`; `Aula` puede ser `"-"` (sin asignar)
- `Asignatura` trae el código entre paréntesis; para mostrar, `nombreAsignatura(ev)`
- Convocatorias conocidas: Septiembre, Enero, Mayo, Junio
- Si cambia el formato del Excel de la URJC, se toca **solo** `handleExcel` (y la validación de `ImportPage`); el resto de la app consume el objeto anterior

## Convenciones
- Componentes funcionales con `export default function Nombre({ ... }: Props)` y props tipadas (interfaz `Props` en el mismo archivo; los datos de examen siempre con `Examen` de `src/types`); lógica pura (parseo, ordenación, exportación) en `src/scripts/`, estado compartido en un store de `src/hooks/`. No meter lógica de datos en los componentes si ya existe un helper.
- Estado global solo con Zustand; nada de Context nuevo ni de leer `localStorage` a mano.
- Iconos con `@tabler/icons-react` (`stroke={2}` por defecto); no añadir otra librería de iconos.
- Estilo solo con utilidades Tailwind. Colores siempre con los tokens de `index.css`, que ya cambian con el tema y por eso van **sin** pareja `dark:`: marca `primary` (con `sobre-primary` para el texto encima), `tertiary` y `enlace`; superficies `lienzo` (fondo de página) < `superficie` (tarjetas, barra lateral, formularios) < `superficie-alta` (chips, hovers, lo que va sobre una superficie); `borde` y `borde-fuerte` (controles: selects, zona de subida); texto `texto` y `texto-suave`; `error` para errores (no `primary`). Nunca hex sueltos en `className` ni en props (`color='#E4002B'` → `className="text-primary"`) ni pares `bg-white dark:bg-gray-950`; un color que no exista = token nuevo en `index.css` (y en `DESIGN.md`).
- **Responsive mobile-first (obligatorio)**: clases sin prefijo = móvil; se amplía con `lg:` (breakpoint principal del proyecto, coincide con el `matchMedia` de `CalendarPage`). Nunca al revés. Sin anchos/altos fijos que rompan en pantallas estrechas, sin scroll horizontal, zonas táctiles ≥ 44×44 px.
- **Modo oscuro**: todo elemento nuevo con fondo, borde o texto propio usa tokens (ya cambian con el tema); `dark:` solo para lo que no es color (p. ej. iconos que dependen de `.dark`). Comprobar contraste en ambos temas (ratios en `DESIGN.md`).
- Enlaces internos con `NavLink`/`useNavigate` de React Router; externos con `target="_blank" rel="noopener noreferrer"`.
- Accesibilidad: botones solo-icono con `aria-label`; `alt` en imágenes; un solo `h1` por página; controles de formulario con `label`.
- Texto visible en español, con tildes y signos de apertura (¿¡). Nombres de archivos de componentes en inglés como los existentes (no renombrar sin pedirlo); funciones y variables nuevas pueden ir en español como las de `scripts/` (`descargarCalendarioICS`).
- Privacidad: los datos del alumno no salen del navegador. No añadir analítica, llamadas a APIs ni subidas de archivos sin preguntar.
- **Verificar en móvil y PC** todo cambio visual antes de darlo por acabado: preview con `resize_window` en `mobile` (375×812), `tablet` (768×1024) y `desktop`, en tema claro y oscuro, recorriendo `/`, `/dashboard`, `/dashboard/calendario`, `/dashboard/importar` y `/dashboard/guia-de-uso` (con y sin datos importados: importar `public/Examenes.xlsx`); volver a `desktop` al terminar.
- **Servidores abiertos hasta el push**: el `vite`/`preview` que arranque el agente se deja corriendo entre tareas para que el usuario pueda revisar; se para justo después del push.
- **Ante la duda, preguntar**: alcance, copy, diseño, borrar algo, elegir entre opciones. No suponer.

## Git (commits y push)
Repo: `origin` = `danielgrela/BetterURJCCalendar` (GitHub), rama **`main`**. El proyecto se despliega en Vercel desde `main` (por eso existe `vercel.json`): tratar cada push a `main` como una subida a producción.
- **Cuándo commitear**: al terminar cada tarea (o cada paso del ROADMAP) ya verificada, sin pedir permiso. Nunca commitear trabajo a medias o roto.
- **Antes de commitear**: `npm run build` sin errores; revisar `git status` y `git diff --cached`; marcar `[x]` en ROADMAP si aplica (va en el mismo commit).
- **Un commit = un cambio lógico**: no mezclar tareas; si el árbol tiene cambios ajenos (del usuario u otra sesión), no incluirlos: `git add` con rutas concretas, nunca `git add -A` a ciegas.
- **Mensaje en español**, impersonal y en presente: `Se añade…`, `Se cambia…`, `Se arregla…`, `Se elimina…`. Primera línea ≤ 72 caracteres, sin punto final; si hace falta, línea en blanco y viñetas con el porqué. Sin prefijos tipo `feat:`/`refactor:` ni mensajes en inglés (el historial antiguo los mezcla; a partir de ahora, solo este formato).
- **Contribuciones externas** (PRs de otras personas, como la de modo oscuro): se revisan y se fusionan desde GitHub por el usuario; el agente no fusiona PRs ni empuja a ramas ajenas.
- **Nunca commitear**: secretos (`.env*`, tokens), `dist/`, `node_modules/`, `.claude/` (están en `.gitignore`; no forzar con `-f`).
- **Push**: solo cuando el usuario lo apruebe en esa conversación (preguntar en una línea qué commits se suben). Nada de `--force`, `--no-verify`, reescribir historia publicada (`rebase`/`amend` de commits subidos) ni borrar ramas remotas.
- **Tras el push**: comprobar el despliegue de Vercel unos minutos después (la portada y una ruta profunda como `/dashboard/calendario` deben responder 200).

## Deuda conocida
Ninguna apuntada: la del análisis inicial se resolvió en las fases F0–F7 del ROADMAP.

## Trabajo pendiente
[ROADMAP.md](ROADMAP.md) está completo (F0–F7). Trabajo nuevo = fase nueva al final del ROADMAP, con el mismo formato (tareas `F8.1`…, `dep:` y nota «Hecho: …» al marcar `[x]`). Cada petición de «seguir con el roadmap» cubre la fase entera, con un commit por tarea y preguntando al usuario en cuanto surja una duda. Guía visual en [DESIGN.md](DESIGN.md).

## Skills (`.claude/skills/`, copiadas del portfolio, no se versionan)
- `modern-web-guidance` (GoogleChrome, Apache 2.0): consultar antes de escribir HTML/CSS/JS de cliente (`npx -y modern-web-guidance@latest search "<consulta>"`). No para config/tooling.
- `/impeccable` (pbakaus, Apache 2.0): `audit`, `critique`, `polish`, `typeset`, `layout`… para revisar diseño y accesibilidad. Mantener `DESIGN.md` al día con lo que salga.
- `/unslop` (heydamir, CC BY 4.0, mantener crédito): quitar aspecto "hecho con IA" respetando contenido y orden de secciones.
- No usar las dos en la misma pasada: primero `audit` y después `unslop` o `polish`.

## Reglas para agentes (ahorro de tokens)
- No leer `node_modules/`, `dist/`, `package-lock.json`, imágenes ni `public/Examenes.xlsx`.
- Antes de abrir un archivo, usar este mapa; los componentes son pequeños, leer solo los implicados.
- Cambios quirúrgicos; no reformatear archivos no tocados (el código mezcla comillas simples/dobles e indentación: respetar la del archivo).
- Si cambia la estructura de archivos o las rutas, actualizar el mapa de este archivo en el mismo commit.
