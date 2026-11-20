# Better URJC Calendar

El Excel oficial de exámenes de la URJC, convertido en un calendario que se entiende de un vistazo.

**[betterurjccalendar.danielgrela.com](https://betterurjccalendar.danielgrela.com/)**

![Calendario de mayo de 2026 con exámenes importados](public/og-image.png)

## Qué hace
- **Calendario personal**: rejilla mensual en el ordenador y lista por meses en el móvil, con filtros por convocatoria y por exámenes pendientes.
- **Próximos exámenes** con la cuenta atrás de cada uno.
- **Aviso de solapamientos**: marca los exámenes cuyas horas se cruzan y los que caen el mismo día.
- **Exportación** a Excel (`.xlsx`) y a iCal (`.ics`) para Google Calendar, Outlook o el calendario del móvil.
- **Modo claro y oscuro** (sigue al sistema por defecto) y **funciona sin conexión** como PWA una vez cargada.

## Cómo se usa
1. Entra en [servicios.urjc.es/examenes](https://servicios.urjc.es/examenes/alumno/login) con tus credenciales de la URJC y pulsa «Descargar en Excel».
2. En la app, ve a **Importar** y arrastra o elige el archivo.
3. Pulsa «Importar»: te lleva al Calendario, y en Inicio verás los próximos exámenes.

La [guía de uso](https://betterurjccalendar.danielgrela.com/dashboard/guia-de-uso) lo explica con capturas y ofrece un [Excel de ejemplo](public/Examenes.xlsx) para probarla.

## Privacidad
Todo ocurre en tu navegador: el Excel no se sube a ningún servidor, no hay cuentas ni analítica. Los exámenes importados se guardan en el `localStorage` de tu navegador y puedes borrarlos desde Importar.

## Desarrollo
Requiere Node.js 20.19+ o 22.12+ (lo que pide Vite 8).

```sh
npm install
npm run dev        # http://localhost:5173
```

| Comando | Qué hace |
|---|---|
| `npm run host` | Igual que `dev`, accesible desde otros dispositivos de la red (para probar en el móvil) |
| `npm run build` | Sitio estático en `dist/client` (prerenderiza la portada y la guía de uso) |
| `npm run preview` | Sirve el build en http://localhost:4173 como lo haría Vercel |
| `npm run typecheck` | Tipos de las rutas + `tsc` |
| `npm run lint` | ESLint |
| `npm test` | Tests de la lógica (Vitest) |

Hecho con React 19, React Router 7 (modo framework, sitio estático), Vite, Tailwind CSS 4, Zustand y TypeScript. Se despliega en Vercel desde `main`.

Para contribuir: [`AGENTS.md`](AGENTS.md) describe la estructura y las convenciones, [`DESIGN.md`](DESIGN.md) la guía visual y [`ROADMAP.md`](ROADMAP.md) el trabajo hecho y pendiente.

## Créditos
- Creado por [Daniel Grela](https://www.danielgrela.com).
- Iconos de [Tabler Icons](https://tabler.io/icons) y fuente [Inter](https://rsms.me/inter/).
- Lectura y escritura de Excel con [read-excel-file](https://gitlab.com/catamphetamine/read-excel-file) y [write-excel-file](https://gitlab.com/catamphetamine/write-excel-file); iCal con [ics](https://github.com/adamgibbons/ics).

Proyecto independiente, sin relación oficial con la Universidad Rey Juan Carlos. Es open source: se permite su uso y modificación libremente.
