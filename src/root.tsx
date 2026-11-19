import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { ReactNode } from 'react'
import type { Route } from './+types/root'
import interUrl from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'
import './index.css'
import ToggleThemeButton from './components/ToggleThemeButton.tsx'
import AvisoActualizacion from './components/AvisoActualizacion.tsx'

const DOMINIO = 'https://betterurjccalendar.danielgrela.com'

export const links: Route.LinksFunction = () => [
  { rel: 'preload', href: interUrl, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
  { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'shortcut icon', href: '/favicon.ico' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'manifest', href: '/site.webmanifest' },
]

// Documento HTML común a todas las rutas. <title>, description, canonical y og:title/description/url
// los pone cada página con PageMeta; aquí solo va lo que es igual en todo el sitio.
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#f3f4f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#030712" media="(prefers-color-scheme: dark)" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Better URJC Calendar" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:image" content={`${DOMINIO}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Calendario mensual de Better URJC Calendar con los exámenes de mayo de 2026" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${DOMINIO}/og-image.png`} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <>
      <Outlet />
      <ToggleThemeButton className="fixed hidden lg:block bottom-8 right-8" />
      <AvisoActualizacion />
    </>
  )
}

// Lo que se ve en las rutas no prerenderizadas (dashboard y 404) mientras carga el JS: nada, como antes,
// pero con un título de respaldo hasta que la página ponga el suyo
export function HydrateFallback() {
  return <title>Better URJC Calendar · Calendario de exámenes de la URJC</title>
}
