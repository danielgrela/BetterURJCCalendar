import { defineConfig, type Plugin } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// `npm run preview` responde como Vercel con vercel.json: archivo estático si existe (también
// carpeta/index.html), reescrituras al fallback del dashboard y 404.html con estado 404 en el resto.
function previewComoVercel(): Plugin {
  return {
    name: 'preview-como-vercel',
    configurePreviewServer(server) {
      const cliente = join(server.config.root, 'dist', 'client')
      const { rewrites } = JSON.parse(readFileSync(join(server.config.root, 'vercel.json'), 'utf8'))
      const reglas = rewrites.map(({ source, destination }: { source: string, destination: string }) => ({
        patron: new RegExp(`^${source.replace(/:\w+\(/g, '(')}$`),
        destination,
      }))
      const esArchivo = (ruta: string) => existsSync(ruta) && statSync(ruta).isFile()
      server.middlewares.use((req, res, next) => {
        const [ruta, consulta = ''] = (req.url ?? '/').split('?')
        const sufijo = consulta ? `?${consulta}` : ''
        if (esArchivo(join(cliente, ruta))) return next()
        if (esArchivo(join(cliente, ruta, 'index.html'))) {
          req.url = `${ruta.replace(/\/$/, '')}/index.html${sufijo}`
          return next()
        }
        const regla = reglas.find(({ patron }: { patron: RegExp }) => patron.test(ruta))
        if (regla) {
          req.url = regla.destination + sufijo
          return next()
        }
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(join(cliente, '404.html')))
      })
    },
  }
}

// Service worker para usar la app sin conexión. React Router prerenderiza después del build del cliente,
// así que react-router.config.ts vuelve a generarlo en buildEnd para que entren los HTML prerenderizados.
const pwa = VitePWA({
  registerType: 'prompt', // no se recarga sola: AvisoActualizacion pregunta al usuario
  injectRegister: false,
  manifest: false, // se usa public/site.webmanifest
  outDir: 'dist/client',
  workbox: {
    globPatterns: ['**/*.{js,css,html,woff2,png,jpg,svg,ico,webmanifest}'],
    // og-image solo sirve para redes sociales; 404.html es una copia del fallback
    globIgnores: ['og-image.png', '404.html'],
    // /dashboard/guia-de-uso está prerenderizada en dashboard/guia-de-uso/index.html
    manifestTransforms: [async (entradas) => ({
      manifest: entradas.map((e) => ({ ...e, url: e.url.replace(/(.+)\/index\.html$/, '$1') })),
      warnings: [],
    })],
    // Rutas sin HTML propio (dashboard, 404): el fallback, que pinta la ruta en el navegador
    navigateFallback: '/__spa-fallback.html',
    cleanupOutdatedCaches: true,
  },
})

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), pwa, previewComoVercel()],
})
