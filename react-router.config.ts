import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src',
  buildDirectory: 'dist',
  // Sin servidor: todo es estático. La portada y la guía se prerenderizan (SEO);
  // el resto de rutas usan __spa-fallback.html y se pintan en el navegador.
  ssr: false,
  prerender: ['/', '/dashboard/guia-de-uso'],
  // Vercel sirve dist/client/404.html con estado 404 en las rutas que no reescribe (vercel.json):
  // es una copia del fallback para que React Router pinte NotFound.
  async buildEnd({ reactRouterConfig }) {
    const cliente = join(reactRouterConfig.buildDirectory, 'client')
    await copyFile(join(cliente, '__spa-fallback.html'), join(cliente, '404.html'))
  },
} satisfies Config
