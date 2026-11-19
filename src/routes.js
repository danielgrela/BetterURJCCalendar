import { route, index } from '@react-router/dev/routes'

// Cada página se carga por separado. Si se añade una ruta, añadirla también
// a vercel.json (y al sitemap y a prerender si es pública)
export default [
  index('components/HeroPage.tsx'),
  route('dashboard', 'App.jsx', [
    index('components/HomePage.tsx'),
    route('calendario', 'components/CalendarPage.tsx'),
    route('importar', 'components/ImportPage.tsx'),
    route('guia-de-uso', 'components/UseGuide.tsx'),
  ]),
  route('*', 'components/NotFound.tsx'),
]
