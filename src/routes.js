import { route, index } from '@react-router/dev/routes'

// Cada página se carga por separado. Si se añade una ruta, añadirla también
// a vercel.json (y al sitemap y a prerender si es pública)
export default [
  index('components/HeroPage.jsx'),
  route('dashboard', 'App.jsx', [
    index('components/HomePage.jsx'),
    route('calendario', 'components/CalendarPage.jsx'),
    route('importar', 'components/ImportPage.jsx'),
    route('guia-de-uso', 'components/UseGuide.jsx'),
  ]),
  route('*', 'components/NotFound.jsx'),
]
