# ROADMAP — Better URJC Calendar

Hoja de ruta para agentes, sacada de la deuda de `AGENTS.md`. Es una propuesta: el usuario puede reordenar o descartar tareas.

## Reglas de ejecución
- **Git** (ver `AGENTS.md` › Git): un commit por tarea terminada y verificada, en español (`Se añade…`), incluyendo el `[x]` de aquí. **Push solo con permiso del usuario** (`main` despliega en Vercel).
- Servidores (`vite`, `preview`) abiertos hasta que el usuario pida push; se paran justo después.
- **Si hay dudas, preguntar al usuario** antes de decidir; no suponer.
- Respetar el orden de fases; dentro de una fase, las tareas sin `dep:` son independientes.
- **Responsive mobile-first y modo oscuro** (ver `AGENTS.md` › Convenciones): todo cambio visual se comprueba a 375, 768 y ≥1024 px, en claro y oscuro, con y sin datos importados.
- Antes de cerrar: `npm run build` sin errores (y `npm run lint` cuando F0.1 esté hecho).
- Si cambia la estructura de archivos, actualizar el mapa de `AGENTS.md`.
- No cambiar contenido ni copy salvo que la tarea lo diga. Refactor = mismo resultado visual.
- Skills: `modern-web-guidance` antes de escribir HTML/CSS/JS de cliente; `impeccable <cmd>` donde se indique.

---

## F0 · Arreglos base
- [ ] **F0.1 Lint**: `eslint.config.js` para `**/*.{js,jsx}` sin `typescript-eslint` (o instalarlo si se decide pasar a TS: preguntar). `npm run lint` debe pasar o dejar solo avisos acordados.
- [ ] **F0.2 Rutas de `public/`**: en `index.html` y en el enlace de `UseGuide` a `Examenes.xlsx`, usar `/favicon…`, `/site.webmanifest`, `/Examenes.xlsx`. Comprobar en `npm run preview` que cargan.
- [ ] **F0.3 `index.html`**: `lang="es"`, `<title>Better URJC Calendar</title>` y `meta description`.
- [ ] **F0.4 Clases rotas**: `text-neuto`/`text-neutral` → `text-neutro`; `flex-flex-col` → `flex flex-col`; quitar `hover:bg-primary-dark`; `w-38` revisar; `color='#E4002B'` → `className="text-primary"`.
- [ ] **F0.5 Código y assets muertos**: confirmar con grep y borrar `src/assets/{hero.png,react.svg,vite.svg}` y `public/icons.svg`. Preguntar antes de borrar.
- [ ] **F0.6 README** propio: qué es, cómo se usa, `npm run dev`, privacidad (todo en local).

## F1 · Refactor sin cambio visual
- [ ] **F1.1** `scripts/handleExcel` → `handleExcel.js` y actualizar el import de `ImportPage`.
- [ ] **F1.2** Helper único de descarga (`descargarBlob(blob, nombre)`) usado por `generateExcel.js` y `generateICS.js`.
- [ ] **F1.3** `CalendarMainMockup` reutiliza `Calendar` (prop para modo demo) en vez de duplicarlo.
- [ ] **F1.4** `FiltersCalendar` con estado controlado (sin `document.getElementById`).
- [ ] **F1.5** Cargar ExcelJS con `import()` dinámico solo al importar/exportar; el chunk principal debe bajar claramente de 1,3 MB.

## F2 · Diseño y accesibilidad
- [ ] **F2.1** `impeccable audit` de portada, dashboard, calendario e importación; guardar el resultado y convertirlo en tareas aquí. dep: F0
- [ ] **F2.2** Jerarquía de encabezados: un `h1` por página (Características y Footer usan `h1`).
- [ ] **F2.3** Zonas táctiles ≥ 44 px y foco visible en navegación, botones de exportar y selects.
- [ ] **F2.4** `ToggleThemeButton`: `aria-label` que diga el estado ("Activar modo oscuro/claro") y respetar `prefers-color-scheme` la primera vez.
- [ ] **F2.5** Actualizar `DESIGN.md` con lo que cambie. dep: F2.1
