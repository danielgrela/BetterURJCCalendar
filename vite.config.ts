import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vercel sirve dist/404.html con estado 404 en las rutas que no reescribe (vercel.json):
// es una copia de index.html para que React Router pinte NotFound.
function paginaNoEncontrada(): Plugin {
  return {
    name: 'pagina-no-encontrada',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') throw new Error('No se ha generado index.html')
      this.emitFile({ type: 'asset', fileName: '404.html', source: index.source })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), paginaNoEncontrada()],
})
