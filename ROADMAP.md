# ROADMAP — Better URJC Calendar

Hoja de ruta para agentes. Parte de un análisis del código a fecha 2026-11-19 (commit `532cb92`). Es una propuesta: el usuario puede reordenar o descartar tareas. Las decisiones de alcance ya están tomadas (ver «Decisiones tomadas»).

## Reglas de ejecución
- **Git** (ver `AGENTS.md` › Git): un commit por tarea terminada y verificada, en español (`Se añade…`), incluyendo el `[x]` de aquí. **Push solo con permiso del usuario** (`main` despliega en Vercel).
- Servidores (`vite`, `preview`) abiertos hasta que el usuario pida push; se paran justo después.
- **Una fase entera por sesión de trabajo**: cuando el usuario pida seguir con el roadmap, se hace la fase completa (toda la F4, no solo F4.2) sin parar entre tareas; se sigue haciendo un commit por tarea. Solo se para antes si una tarea necesita una decisión del usuario o falla algo que no se puede resolver.
- **Preguntar siempre que haga falta** (con `AskUserQuestion`, en cuanto surja la duda y sin esperar al final de la fase): alcance, copy, diseño, borrar algo, elegir entre opciones o resultados que no cuadran con lo esperado. No suponer.
- Respetar el orden de fases; dentro de una fase, las tareas sin `dep:` son independientes.
- **Responsive mobile-first y modo oscuro** (ver `AGENTS.md` › Convenciones): todo cambio visual se comprueba a 375, 768 y ≥1024 px, en claro y oscuro, con y sin datos importados.
- Antes de cerrar: `npm run build` sin errores (y `npm run lint` cuando F0.1 esté hecho; `npm run typecheck` cuando F4.6 esté hecho; `npm test` cuando F4.7 esté hecho).
- Si cambia la estructura de archivos, actualizar el mapa de `AGENTS.md`.
- No cambiar contenido ni copy salvo que la tarea lo diga. Refactor = mismo resultado visual.
- Skills: `modern-web-guidance` antes de escribir HTML/CSS/JS de cliente; `impeccable <cmd>` y `unslop` donde se indique (nunca los dos en la misma pasada).

---

## Diagnóstico

### SEO
La portada es lo único que debería posicionar (buscan «calendario exámenes URJC», «exámenes URJC Excel»), y hoy Google recibe un HTML vacío:
- `index.html`: `lang="en"`, `<title>betterurjccalendar</title>`, sin `meta description`, sin Open Graph/Twitter (al compartir el enlace en WhatsApp o Discord sale sin título ni imagen), sin `canonical` ni `theme-color`.
- SPA pura: el texto de la portada solo existe tras ejecutar JS. Googlebot lo renderiza con retraso; Bing, los bots de redes sociales y los previsualizadores no lo ven.
- No hay `robots.txt` ni `sitemap.xml`. Las rutas del dashboard (sin datos son pantallas vacías) no llevan `noindex`.
- `vercel.json` reescribe todo a `index.html`: cualquier URL inventada devuelve **200** con la página de error (soft 404).
- Títulos por ruta: todas las páginas comparten el mismo `<title>`.
- Jerarquía: varios `h1` por página (`SideBar`, `Features`, `Footer`, `UseGuide`), `<main>` anidados (`App` › `HomePage`/`UseGuide`).
- Rendimiento (cuenta para Core Web Vitals): 1,28 MB de JS (365 kB gzip) en un único chunk porque ExcelJS se importa de forma estática; Inter se carga con `@import` de Google Fonts dentro del CSS (cadena bloqueante y, además, envía la IP del visitante a Google, lo que contradice la promesa de privacidad); el `favicon.svg` pesa 31 kB y acaba empaquetado como asset por la ruta `public/…`.
- `site.webmanifest`: `name` sin espacios, `theme_color` blanco también en oscuro, iconos solo `maskable` (falta uno `any`).

### Framework y tecnologías
| Pieza | Estado | Veredicto |
|---|---|---|
| React 19 + Vite 8 | Correcto y actual | Mantener |
| React Router 7 (modo librería, `BrowserRouter`) | Funciona, pero sin code-splitting ni prerender | **Pasar a modo framework con `ssr: false` + `prerender`** (decidido): misma librería, genera HTML estático de `/` y `/dashboard/guia-de-uso` para SEO, carga cada ruta por separado y da `meta` por ruta. Es el salto más pequeño con más beneficio |
| Zustand 5 | Bien elegido para este tamaño | Mantener; corregir el uso (ver Refactor) |
| Tailwind 4 vía PostCSS + `autoprefixer` | `autoprefixer` sobra (Tailwind 4 ya prefija) | Pasar a `@tailwindcss/vite` (más rápido) y quitar `autoprefixer` |
| ExcelJS (lectura y escritura) | ~900 kB minificados para leer 10 columnas | Primero `import()` dinámico; después probar `read-excel-file` + `write-excel-file` (decenas de kB) y decidir con cifras |
| `ics` | Correcto | Mantener; fijar zona `Europe/Madrid` o dejar hora flotante documentada |
| `glob`, `rimraf`, `uuid`, `@types/node` | Sin uso en `src/` | Quitar |
| JavaScript sin tipos | El modelo de examen y los parseos no tienen ninguna comprobación | **Migrar a TypeScript** (decidido), de forma gradual y después del modo framework, que genera los tipos de rutas |
| Sin tests | La lógica crítica (parseo, orden, ICS) no tiene red | Añadir Vitest solo para `src/scripts/` |
| PWA | Ya hay manifest y todo es local | Service worker (`vite-plugin-pwa`) para usarla sin conexión el día del examen (decidido) |

Alternativas descartadas: Next.js (no hay backend; añade servidor y peso), Astro + isla React (separar portada y app duplica layout y tema; solo compensaría si la portada creciera mucho), Svelte/Vue (reescritura completa sin ganancia para el usuario).

### Código (buenas prácticas)
- **Bugs**:
  - `useFileStoreJsonFilters` no se limpia al importar otro Excel: tras reimportar, el calendario puede seguir mostrando los exámenes filtrados del archivo anterior.
  - `ImportPage` promete «Arrastra tu archivo» pero no hay `onDrop`; acepta `.xls` y `.csv`, que ExcelJS no lee; valida solo la primera fila; usa `alert()` y deja `console.log` con los datos del alumno.
  - `handleExcel` asume que `Fecha`/`Hora` son texto: si el Excel trae una celda de tipo fecha o texto enriquecido, `split` revienta más adelante.
  - `PCCalendar` abre en el mes actual aunque los exámenes estén en otro: pantalla vacía sin explicación.
  - `Features` promete «Identifica rápidamente solapamientos», pero no existe esa función.
  - No hay forma de borrar el calendario guardado (`clearJsonData` existe pero no se usa).
- **Estructura**: `CalendarMainMockup` copia `Calendar` (con «hoy» fijado al 18-05-2026); la tarjeta de examen se repite con variantes en `NextExams`, `MobileCalendar` y `Calendar`; `FiltersCalendar` lee el DOM por `id` y las convocatorias están escritas a mano en vez de salir de los datos; `generateExcel`/`generateICS` duplican la descarga; dos botones «Importar» casi iguales por breakpoint.
- **React**: función interna `NextExams` que tapa al componente; `key={idx}` en listas; `sortedEvents()` en cada render sin `useMemo`; `matchMedia` con ramas para navegadores de 2015 (`addListener`) y un estado `loading` que provoca un parpadeo; `ButtonNavBar` resalta a mano lo que `NavLink` ya resuelve con `isActive`; `children` pasado como prop.
- **Herramientas**: lint roto (`typescript-eslint` y solo `*.ts`), `handleExcel` sin extensión, README de plantilla.

### Interfaz y temas
Lo bueno: un solo color de marca, CTAs rectos y directos, tarjeta de examen clara, navegación inferior en móvil. Lo que suena a «hecho con IA» o rompe el sistema:
- **Calendario**: el día de hoy en `indigo-600` con sombra de color y los eventos en `indigo-50` (fuera de la paleta); `rounded-2xl` + `shadow-2xl`; cabecera en mayúsculas espaciadas a 11 px; textos a 9–10 px ilegibles; mezcla de `slate-*` y `gray-*`; `font-black`.
- **Portada**: píldora con megáfono («De Daniel para Daniel»), rejilla de 3 tarjetas con cuadrado de icono de color (`bg-red-200`, `bg-blue-100`, sin variante oscura), iconos que crecen al pasar el ratón (`hover:scale-120`), mockup del calendario con `zoom: 0.75`.
- **Modo oscuro** (el punto más flojo):
  - Contraste: blanco sobre `primary` oscuro (`#FF2D3E`) da ~3,7:1, no llega a AA en texto normal (botones «Exportar a .ics», «Importar», CTAs). `neutro` (`#717171`) no cambia en oscuro: ~3,6:1 sobre `gray-900`, falla. `tertiary` pasa a blanco y pierde su función de acento.
  - Elevación invertida: las tarjetas (`gray-950`) son más oscuras que el lienzo (`gray-900`); en oscuro lo elevado debería ser más claro, no más hundido.
  - Arranque: el tema se aplica cuando carga el JS (destello blanco al abrir en oscuro) y la primera vez ignora `prefers-color-scheme`. No se declara `color-scheme`, así que los `<select>`, el selector de archivo y las barras de scroll nativas siguen en claro.
  - Inconsistencias: el botón activo de la navegación usa texto negro sobre rojo en oscuro y el resto de botones rojos texto blanco; `Header` en `gray-800` y la sección siguiente en `gray-900`; `hover:dark:bg-gray-700` en la zona de subida sobre un fondo `gray-950`.
  - Cada componente repite pares `bg-white dark:bg-gray-950`, `border-gray-200 dark:border-gray-800`…: fácil olvidar uno (ya pasa en `Features` y en el selector de archivo).
- **Accesibilidad**: botones de mes sin `aria-label`; `aria-label` del tema no dice el estado; foco visible solo en los `<select>`; `select` sin `label`; zonas táctiles de los enlaces del footer y de «Volver al inicio» por debajo de 44 px.

---

## Decisiones tomadas (2026-11-19)
1. **Dominio de producción**: `https://betterurjccalendar.danielgrela.com/` (para `canonical`, `og:url`, `sitemap.xml` y `robots.txt`).
2. **Prerender**: React Router 7 en modo framework con `ssr: false` + `prerender` (F4.4).
3. **Excel**: primero `import()` dinámico; después probar `read-excel-file`/`write-excel-file` y decidir con cifras (F4.1, F4.8).
4. **Tokens semánticos de superficie**: aprobados; cambian la convención de `AGENTS.md` (F5.1, F7.3).
5. **Elevación en oscuro**: tarjetas más claras que el fondo, bordes finos en lugar de sombras (F5.3).
6. **Funciones prometidas**: se implementan las dos, arrastrar y soltar (F1.2) y aviso de solapamientos (F6.6).
7. **Extras**: migración a TypeScript (F4.6) y PWA sin conexión (F4.9).

---

## F0 · Arreglos base
- [x] **F0.1 Lint**: instalar `typescript-eslint` (se migra a TS en F4.6) y ampliar `files` a `**/*.{js,jsx,ts,tsx}` para que revise ya el código actual. `npm run lint` debe pasar o dejar solo avisos acordados.
- [x] **F0.2 Rutas de `public/`**: en `index.html` y en el enlace de `UseGuide` a `Examenes.xlsx`, usar `/favicon…`, `/site.webmanifest`, `/Examenes.xlsx`. Comprobar en `npm run preview` que cargan y que el favicon ya no sale en `dist/assets`.
- [x] **F0.3 Clases rotas**: `text-neuto`/`text-neutral` → `text-neutro`; `flex-flex-col` → `flex flex-col`; quitar `hover:bg-primary-dark`; `w-38` es válida en Tailwind 4 (se deja); `color='#E4002B'` → `className="text-primary"`. Para que el texto que pasa a `neutro` no pierda contraste en oscuro, `neutro` ya tiene valor oscuro (`#9CA3AF`); F5.2 revisará el resto.
- [x] **F0.4 Dependencias y assets muertos**: quitar `glob`, `rimraf`, `uuid`, `@types/node`; confirmar con grep y borrar `src/assets/{hero.png,react.svg,vite.svg}` y `public/icons.svg`. Preguntar antes de borrar.
- [x] **F0.5 Datos del alumno fuera de la consola**: quitar los `console.log` con el contenido del Excel.

## F1 · Bugs funcionales
- [x] **F1.1** Limpiar `dataFiltered` al importar un archivo nuevo (y al borrar el calendario).
- [x] **F1.2** Zona de subida con arrastrar y soltar real (`dragover`/`dragleave`/`drop`, estado visual con borde `primary`, mismo flujo de validación que el selector). `accept=".xlsx"` solamente.
- [x] **F1.3** Validación de importación en `handleExcel`: normalizar `Fecha` a `DD-MM-YYYY` y `Hora` a `HH:MM - HH:MM` aunque la celda sea fecha o texto enriquecido; descartar filas vacías; error claro si ninguna fila es válida. Sustituir `alert()` por el mensaje de error en línea.
- [x] **F1.4** `PCCalendar` abre en el mes del próximo examen (o del último, si ya pasaron todos) y avisa cuando el mes visible no tiene exámenes.
- [x] **F1.5** Botón «Borrar calendario» (con confirmación) en Importar o en el dashboard: el alumno debe poder eliminar sus datos del navegador.
- [x] **F1.6** `NextExams` sin exámenes futuros (todos pasados) no muestra nada bajo «Próximos Exámenes»: el filtro devuelve `[]` y solo se pinta el aviso cuando es `null`. Mostrar estado vacío («No te quedan exámenes pendientes») con enlace al calendario.

## F2 · Refactor sin cambio visual
- [x] **F2.1** `scripts/handleExcel` → `handleExcel.js` y actualizar el import de `ImportPage`.
- [x] **F2.2** Helper único de descarga (`descargarBlob(blob, nombre)`) usado por `generateExcel.js` y `generateICS.js`.
- [x] **F2.3** `CalendarMainMockup` reutiliza `Calendar` (props `today` y `compact`) en vez de duplicarlo; quitar `zoom` en línea.
- [x] **F2.4** `FiltersCalendar` con estado controlado (sin `document.getElementById`), filtros calculados con `useMemo` en `CalendarPage` y convocatorias sacadas de los datos. dep: F1.1
- [x] **F2.5** Componente `ExamCard` (variantes `full` y `compact`) para `NextExams`, `MobileCalendar` y `Calendar`; helper `nombreAsignatura(ev)` para el corte en `(`. Hecho con una tercera variante `list` para la lista móvil, que no se parece a ninguna de las otras dos (refactor sin cambio visual); unificarlas queda para F6.3.
- [x] **F2.6** Limpieza React: renombrar la función interna de `NextExams` (`proximosExamenes`), `key` estable (`CodigoAsignatura + Fecha + Hora`), `useMemo` para `sortedEvents`, hook `useMediaQuery` sin `addListener` ni estado `loading`, `NavLink` con `isActive` en `ButtonNavBar`, `children` como hijos JSX, un solo botón «Importar» responsive.

## F3 · SEO
- [x] **F3.1** `index.html`: `lang="es"`, `<title>` y `meta description` en español con las búsquedas reales («calendario de exámenes de la URJC»), `theme-color` claro y oscuro (`media="(prefers-color-scheme: …)"`).
- [x] **F3.2** Open Graph y Twitter Card (`og:title`, `og:description`, `og:image` 1200×630 hecha con una captura real del calendario, `og:url`, `og:locale=es_ES`) y `canonical` con `https://betterurjccalendar.danielgrela.com/`. Imagen en `public/og-image.png` (calendario de mayo de 2026 con `public/Examenes.xlsx`, tema claro); rehacerla tras F6.9.
- [x] **F3.3** Título y descripción por ruta con los `<title>`/`<meta>` nativos de React 19 dentro de cada página; `noindex` en `/dashboard`, `/dashboard/calendario`, `/dashboard/importar` y en `NotFound`. Hecho con `PageMeta`: `<title>`, `description` y `canonical` salen solo de React (quitados de `index.html` para no duplicarlos; el `<title>` estático se queda de respaldo, React pone el suyo delante). Las `og:*` siguen globales en `index.html` apuntando a `/` hasta F4.4.
- [x] **F3.4** `public/robots.txt` y `public/sitemap.xml` (solo `/` y `/dashboard/guia-de-uso`, con el dominio `betterurjccalendar.danielgrela.com`; línea `Sitemap:` en `robots.txt`). `/dashboard` no va en `Disallow` a propósito: Google tiene que rastrearlo para leer su `noindex`.
- [x] **F3.5** Datos estructurados JSON-LD `WebApplication` (nombre, descripción, `applicationCategory: EducationalApplication`, `offers` gratis, `inLanguage: es`) en la portada. En `HeroPage` (solo existe tras ejecutar JS hasta F4.4); no da resultado enriquecido de app porque faltan valoraciones, solo describe el sitio.
- [x] **F3.6** Semántica: un `h1` por página (los de `SideBar`, `Features`, `Footer` pasan a `p`/`h2`; en `UseGuide` los pasos son `h2`/`h3`), un solo `<main>`, `<header>`/`<nav>`/`<footer>` donde corresponda, `alt` descriptivos en las capturas. Hecho: `nav` en `NavButtons`, `header` en `Header`, `h1` `sr-only` «Guía de uso» en la guía (sin cambiar lo visible), `alt` de las capturas corregidos (estaban cruzados entre `fotoguia01` y `fotoguia02`) y `alt=""` en imágenes decorativas (gato de la 404, icono del portfolio, que ya tiene `aria-label` en su enlace).
- [x] **F3.7** `site.webmanifest`: `name: "Better URJC Calendar"`, `lang: "es"`, `start_url: "/dashboard"`, icono `any` además de `maskable`. Hecho; el icono `any` reutiliza los PNG `maskable` (tienen margen de seguridad, así que en escritorio se ven algo más pequeños). `theme_color` claro (`#f3f4f6`): el manifest no admite valor por tema; el oscuro lo pone la `meta theme-color` de `index.html`.
- [x] **F3.8** 404 real: en Vercel, servir `index.html` solo para rutas conocidas y devolver 404 en el resto (o, como mínimo, `noindex` en `NotFound`). Comprobar con `curl -I` tras el despliegue. Implementado (`vercel.json` con rutas concretas, `trailingSlash: false` y `404.html` generado en el build); Comprobado en producción el 2026-11-19: rutas del dashboard 200, `/no-existe` y `/dashboard/no-existe` 404 con `NotFound`, `/dashboard/` → 308 a `/dashboard`.

## F4 · Stack y rendimiento
- [x] **F4.1** ExcelJS con `import()` dinámico solo al importar/exportar; el chunk inicial debe bajar claramente de 1,3 MB (anotar antes/después). Hecho en `handleExcel.js` y `generateExcel.js`: chunk inicial de 1.286,18 kB (367,59 kB gzip) a 356,11 kB (110,86 kB gzip); ExcelJS va aparte en `exceljs.min-*.js` (929,91 kB, 256,42 kB gzip) y solo se descarga al importar o exportar a Excel.
- [x] **F4.2** Tailwind con `@tailwindcss/vite` en lugar de PostCSS; quitar `autoprefixer` y `postcss.config.js`. Mismo CSS resultante. Hecho (fuera también `postcss`, que ya trae Vite); Tailwind sube de 4.3.0 a 4.3.5 por el plugin. El CSS solo cambia en minificado y en el prefijo `-o-object-fit` de `autoprefixer`. El `@import` de Google Fonts pasa delante del de Tailwind: el plugin descarta un `@import` que no vaya primero (lo quita F4.3).
- [x] **F4.3** Inter autoalojada (`@fontsource-variable/inter`, solo latin) con `font-display: swap` y `preload`; fuera el `@import` de Google Fonts (rendimiento y privacidad). Hecho con un `@font-face` propio en `index.css` (familia `Inter`, solo el `woff2` latin variable de 48 kB) y `preload` en `index.html`; Vite resuelve las dos rutas al mismo archivo con hash. Ya no hay peticiones a Google.
- [x] **F4.4** React Router en modo framework (`ssr: false`, `prerender: ["/", "/dashboard/guia-de-uso"]`), rutas en `app/routes.js`, `meta` por ruta y carga diferida por página. Verificar que el HTML de `dist` contiene el texto de la portada. dep: F2, F3.3 Hecho con `appDirectory: 'src'` (rutas en `src/routes.js`, documento en `src/root.jsx`; sin mover componentes a `app/`) y salida en `dist/client`. Las metas siguen en `PageMeta` (React 19 las sube al `<head>` también en el prerender) y ahora incluyen `og:title`/`og:description`/`og:url` y `twitter:*` por página. `dist/client/index.html` y `dashboard/guia-de-uso/index.html` traen el texto, el título y las metas; el resto usa `__spa-fallback.html` y `404.html` (copia que hace `buildEnd`). `npm run preview` imita `vercel.json`. Chunk inicial de la portada: `entry.client` 186 kB (58,7 kB gzip) + `jsx-runtime` 130 kB (43 kB gzip) + `HeroPage` 10,7 kB.
- [x] **F4.5** Comprobar en Vercel tras F4.4: portada y guía servidas como HTML estático, rutas del dashboard funcionando al recargar y 404 real (F3.8). Ajustar `vercel.json` si hace falta. dep: F4.4 Comprobado en producción el 2026-11-19 (commit `154dc1a`): `/` y `/dashboard/guia-de-uso` 200 con el texto en el HTML; `/dashboard`, `/calendario` e `/importar` 200 con el fallback y se pintan al recargar; `/no-existe` y `/dashboard/no-existe` 404; `/dashboard/` → 308. Sin cambios en `vercel.json`.
- [ ] **F4.6** Migración gradual a TypeScript: `tsconfig` con `allowJs` + `strict`, script `npm run typecheck` (`tsc --noEmit`) y tipo `Examen` en `src/types`. Orden: `src/scripts/` → stores de `src/hooks/` → componentes (de hoja a raíz) → rutas, un commit por bloque. Sin `any` salvo en la frontera con la librería de Excel, comentado. Al terminar, quitar `allowJs`. dep: F2, F4.4
- [ ] **F4.7** Vitest para `src/scripts/` (`parseEventDate`, `sortedEvents`, filtros, normalización de `handleExcel`, eventos ICS, detección de solapamientos) y script `npm test`. Si F4.6 ya está, los tests en `.ts`.
- [ ] **F4.8** Si tras F4.1 el chunk de Excel sigue siendo enorme: probar `read-excel-file`/`write-excel-file` con `public/Examenes.xlsx`, comparar tamaño y resultado (incluido el Excel exportado) y presentar las cifras al usuario antes de cambiar. dep: F4.1
- [ ] **F4.9** PWA sin conexión (`vite-plugin-pwa`, precache del shell y de las rutas prerenderizadas; los datos ya están en `localStorage`). Aviso discreto de «nueva versión disponible», sin recargar sola. Probar en móvil en modo avión. dep: F4.4
- [ ] **F4.10** Lighthouse móvil de `/` antes y después de F3–F4; objetivo ≥ 95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO. Anotar cifras aquí.

## F5 · Modo claro y oscuro
- [ ] **F5.1** Tokens semánticos en `index.css` que cambian con el tema: `lienzo`, `superficie`, `superficie-alta`, `borde`, `texto`, `texto-suave`, `sobre-primary`. Sustituir los pares `bg-white dark:bg-gray-950` repetidos. Actualizar la convención de `AGENTS.md` y `DESIGN.md`.
- [ ] **F5.2** Contraste AA en ambos temas: valor oscuro de `primary` que dé ≥ 4,5:1 con su texto (o texto oscuro sobre rojo en oscuro, igual en todos los botones), `neutro` propio en oscuro (≥ 4,5:1 sobre lienzo y superficie), `tertiary` oscuro que siga siendo un azul. Medir y apuntar los ratios en `DESIGN.md`.
- [ ] **F5.3** Elevación en oscuro: lienzo más oscuro, tarjetas un escalón más claras, bordes sutiles en lugar de sombras (las sombras no se ven sobre negro). dep: F5.1
- [ ] **F5.4** Sin destello al cargar: script en línea en `<head>` que aplica `.dark` antes de pintar, leyendo `dark-mode` de `localStorage` o `prefers-color-scheme`.
- [ ] **F5.5** Tres estados en `ToggleThemeButton`: sistema / claro / oscuro (por defecto sistema, escuchando cambios del SO); `aria-label` con el estado actual; mismo comportamiento en portada, dashboard y 404.
- [ ] **F5.6** `color-scheme: light dark` en `:root` y `.dark` para que `<select>`, selector de archivo, barras de scroll y autocompletado sigan el tema; `accent-color: var(--primary)`.
- [ ] **F5.7** Barrido de variantes que faltan: cuadros de icono de `Features` (y su borde izquierdo rojo, que `dark:border-gray-700` tapa en oscuro), borde de la zona de subida, `Header` frente a la portada, hovers en oscuro, imágenes de la guía (borde sutil para que no floten sobre negro). Revisar cada ruta en los dos temas con y sin datos.

## F6 · Interfaz (sin aspecto «IA»)
- [ ] **F6.1** `impeccable audit` de portada, dashboard, calendario, importación y guía en claro y oscuro; convertir el resultado en tareas aquí. dep: F5.2
- [ ] **F6.2** Calendario de escritorio: «hoy» con `primary` (anillo o número en rojo, sin sombra de color), eventos en superficie neutra con borde izquierdo rojo, nada de `indigo`/`slate`; cabecera de días en tamaño legible y sin mayúsculas espaciadas; textos mínimos de 12 px; `rounded-md` y sombra suave como el resto; botones de mes con `aria-label` y botón «Hoy».
- [ ] **F6.3** Calendario móvil: agrupar por mes con cabecera fija, fecha legible («lun 12 ene») en vez de `12-01-2026`, marcar los exámenes pasados como atenuados y saltar al próximo.
- [ ] **F6.4** Portada (`unslop`, respetando contenido y orden de secciones): quitar la píldora con megáfono o convertirla en texto normal, los cuadrados de icono de color y el `hover:scale`; mockup del calendario como captura real a tamaño nativo. dep: F6.1
- [ ] **F6.5** Estados vacíos y de error con siguiente paso claro (sin datos → «Importar Excel»; filtro sin resultados → «Quitar filtros»; mes vacío → «Ir al próximo examen»).
- [ ] **F6.6** Aviso de solapamiento: helper puro `detectarSolapamientos(examenes)` en `src/scripts/` (horas que se cruzan = conflicto; mismo día sin cruce = aviso suave) y marca visible en `NextExams`, el calendario de escritorio y la lista móvil, con texto y no solo color. dep: F2.5
- [ ] **F6.7** Accesibilidad: zonas táctiles ≥ 44 px (footer, «Volver al inicio», navegación), `focus-visible` con anillo `primary` en todos los controles, `label` (visible o `sr-only`) en los `<select>`, `aria-current="page"` en la navegación, `prefers-reduced-motion`.
- [ ] **F6.8** Copy: tildes que faltan («exámenes», «aquí», «Ahórrate», «Olvídate», «céntrate», «asegúrate»), mayúsculas coherentes en botones y textos de ayuda en el mismo tono.
- [ ] **F6.9 Legibilidad del calendario (rediseño global)**: pedido por el usuario el 2026-11-19. Revisar el diseño de todo lo que muestra exámenes para que se lea de un vistazo, como un único sistema y no tres piezas sueltas. Empezar con `impeccable critique` del calendario de escritorio, la lista móvil, `NextExams` y el mockup de la portada, en claro y oscuro, y **proponer la dirección al usuario antes de implementar**. Cubrir: jerarquía de la tarjeta (asignatura > fecha y hora > aula > plan), tamaños mínimos (12 px en la rejilla, 14 px en las listas), nada de mayúsculas forzadas ni `truncate` que corte el nombre de la asignatura sin forma de verlo entero, celdas con varios exámenes sin scroll interno (resumen tipo «+2 más» o detalle al pulsar), contraste AA de `tertiary` y `primary` sobre las superficies, fecha y hora en formato humano y unificar las variantes de `ExamCard` (`full`/`list`/`compact`, ver F2.5). Engloba F6.2 y F6.3: se hacen dentro de esta tarea y se marcan juntas. dep: F5.2, F6.1

## F7 · Documentación
- [ ] **F7.1** `README.md` propio: qué es, captura, cómo se usa, `npm run dev`, privacidad (todo en local), créditos.
- [ ] **F7.2** `DESIGN.md` al día con los tokens, ratios de contraste y componentes que cambien en F5–F6. dep: F5, F6
- [ ] **F7.3** `AGENTS.md`: mapa (estructura del modo framework), comandos (`npm test`, `npm run typecheck`), «TypeScript» en lugar de «JavaScript, no TypeScript», convención de tokens y deuda resuelta. Se va actualizando en cada commit que lo cambie; esta tarea es la revisión final. dep: F2, F4, F5
