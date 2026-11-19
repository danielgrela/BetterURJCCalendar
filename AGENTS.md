# AGENTS.md — Better URJC Calendar

SPA que convierte el Excel oficial de exámenes de la URJC (servicios.urjc.es/examenes) en un calendario personal, con próximos exámenes y exportación a Excel e iCal (.ics). Todo ocurre en el navegador: no hay backend ni cuentas. React 19 + Vite 8 + Tailwind 4 (vía PostCSS) + React Router 7 + Zustand. **JavaScript (`.jsx`/`.js`), no TypeScript.** Idioma de trabajo y de la interfaz: español (no hay i18n).

## Comandos
- `npm run dev` → http://localhost:5173 · `npm run host` → igual, expuesto en la red local (para probar en el móvil)
- `npm run build` / `npm run preview`
- `npm run lint` → ESLint sobre `.js`/`.jsx` (ignora `dist/` y `.claude/`). No hay tests. La verificación es `npm run build` + revisar en el navegador

## Mapa (solo lo que importa)
- `index.html` → raíz de Vite, monta `src/main.jsx`; favicons y manifest
- `src/main.jsx` → rutas (`BrowserRouter`): `/` → `HeroPage` (portada) · `/dashboard` → `App` (layout con `SideBar` + `<Outlet>`) con hijas `""` → `HomePage`, `calendario` → `CalendarPage`, `importar` → `ImportPage`, `guia-de-uso` → `UseGuide` · `*` → `NotFound`. También pinta el `ToggleThemeButton` flotante de escritorio
- `src/App.jsx` → layout del dashboard: en móvil `flex-col-reverse` (la `SideBar` pasa a barra inferior y aparece `ReturnMobile` arriba); en `lg:` barra lateral fija a la izquierda
- `src/components/` (un componente por archivo, nombre en PascalCase):
  - Portada: `HeroPage` (Header + HeroPageMain + Features + Footer), `HeroPageMain` (titular, CTAs y `CalendarMainMockup` con `assets/jsonMockup.json`)
  - Dashboard: `SideBar`, `NavButtons` + `ButtonNavBar` (resaltado por último segmento de la ruta), `ReturnMobile`, `HomePage` (`DashboardHeader` + `NextExams` + `ButtonsExportDashboard`)
  - Calendario: `CalendarPage` decide por `matchMedia('(min-width: 1024px)')` entre `PCCalendar` (rejilla mensual `Calendar` con navegación de mes) y `MobileCalendar` (lista); ambos usan `FiltersCalendar`
  - `ImportPage` (subida y validación del Excel), `UseGuide` (guía con capturas `assets/fotoguia0*.{png,jpg}`), `NotFound`, `ToggleThemeButton`
- `src/SocialIcons/Github.jsx` → icono SVG de GitHub (Tabler no trae logos de marca)
- `src/hooks/` → stores de Zustand: `useFileStore` (exámenes importados, persistido en `localStorage` `file-storage`; `useFileStoreJsonFilters` = resultado de filtros, sin persistir) · `useDarkMode` (persistido en `dark-mode`, añade/quita `.dark` en `<html>`)
- `src/scripts/` → lógica sin UI:
  - `handleExcel` (**sin extensión**) → `excelTojson(file)`: lee la hoja 1 con ExcelJS, ignora las 2 primeras filas y mapea las columnas 1–10
  - `sortEvents.js` → `parseEventDate('DD-MM-YYYY')` (default) y `sortedEvents(json)` (por fecha y hora)
  - `filtersCalendar.js` → filtro por convocatoria y "Pendientes" (lee los `<select>` por `id`)
  - `generateExcel.js` / `generateICS.js` → descargas `horario_examenes.xlsx` / `.ics`
- `src/index.css` → Tailwind, variante `dark` por clase `.dark`, fuente Inter (Google Fonts) y tokens de color (ver DESIGN.md)
- `public/Examenes.xlsx` → Excel de ejemplo que se ofrece en la guía de uso
- `src/assets/` y `public/*.png|ico` → imágenes (no leer, binarios)
- `vercel.json` → reescribe todo a `/index.html` (necesario para las rutas de la SPA)

## Modelo de datos (examen)
Objeto con `Curso, Plan, Asignatura, CodigoPlan, CodigoAsignatura, CodigoGrupo, Convocatoria, Fecha, Hora, Aula`, tal y como sale de `handleExcel`.
- `Fecha` = `"DD-MM-YYYY"` (texto, no `Date`); parsear siempre con `parseEventDate`
- `Hora` = `"HH:MM - HH:MM"`; `Aula` puede ser `"-"` (sin asignar)
- `Asignatura` trae el código entre paréntesis; para mostrar se corta en el primer `(`
- Convocatorias conocidas: Septiembre, Enero, Mayo, Junio
- Si cambia el formato del Excel de la URJC, se toca **solo** `handleExcel` (y la validación de `ImportPage`); el resto de la app consume el objeto anterior

## Convenciones
- Componentes funcionales con `export default function Nombre()`; lógica pura (parseo, ordenación, exportación) en `src/scripts/`, estado compartido en un store de `src/hooks/`. No meter lógica de datos en los componentes si ya existe un helper.
- Estado global solo con Zustand; nada de Context nuevo ni de leer `localStorage` a mano.
- Iconos con `@tabler/icons-react` (`stroke={2}` por defecto); no añadir otra librería de iconos.
- Estilo solo con utilidades Tailwind. Colores de marca con los tokens de `index.css` (`primary`, `secundario`, `tertiary`, `neutro`), que ya cambian con el tema; nunca hex sueltos en `className` ni en props (`color='#E4002B'` → `className="text-primary"`). Grises de Tailwind (`gray-*`) para fondos y bordes, siempre con su pareja `dark:`.
- **Responsive mobile-first (obligatorio)**: clases sin prefijo = móvil; se amplía con `lg:` (breakpoint principal del proyecto, coincide con el `matchMedia` de `CalendarPage`). Nunca al revés. Sin anchos/altos fijos que rompan en pantallas estrechas, sin scroll horizontal, zonas táctiles ≥ 44×44 px.
- **Modo oscuro**: todo elemento nuevo con fondo, borde o texto propio lleva su variante `dark:`; comprobar contraste en ambos temas.
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

## Deuda conocida (candidatos a refactor, ver ROADMAP)
- `README.md` es la plantilla de Vite (habla de TypeScript).
- `index.html`: `<html lang="en">` y `<title>` sin cuidar, sin meta de SEO (F3).
- `scripts/handleExcel` sin extensión `.js`; `generateExcel.js`/`generateICS.js` duplican la lógica de descarga.
- `CalendarMainMockup` es casi una copia de `Calendar`; `FiltersCalendar` lee el DOM por `id` en vez de estado.
- Bundle de 1,3 MB (ExcelJS entero en el chunk principal): candidato a `import()` dinámico al importar/exportar.
- Assets sin uso: `src/assets/{hero.png,react.svg,vite.svg}`, `public/icons.svg` (comprobar con grep antes de borrar).

## Trabajo pendiente
Seguir [ROADMAP.md](ROADMAP.md) por fases. Marcar tareas `[x]` al terminar. Guía visual en [DESIGN.md](DESIGN.md).

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
