import { defineConfig, type Plugin } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
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

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), previewComoVercel()],
})
