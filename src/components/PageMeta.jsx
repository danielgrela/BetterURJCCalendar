const SITIO = 'Better URJC Calendar';
const DOMINIO = 'https://betterurjccalendar.danielgrela.com';

// React 19 sube <title>, <meta> y <link> al <head> (también en el HTML prerenderizado) y los quita
// al cambiar de ruta. Lo común a todo el sitio (og:image, twitter:card…) está en root.jsx
export default function PageMeta({ titulo, descripcion, ruta, noindex = false }) {
    const tituloCompleto = titulo ? `${titulo} · ${SITIO}` : `${SITIO} · Calendario de exámenes de la URJC`;
    return (
        <>
            <title>{tituloCompleto}</title>
            <meta property="og:title" content={tituloCompleto} />
            <meta name="twitter:title" content={tituloCompleto} />
            {descripcion && <meta name="description" content={descripcion} />}
            {descripcion && <meta property="og:description" content={descripcion} />}
            {descripcion && <meta name="twitter:description" content={descripcion} />}
            {ruta !== undefined && <link rel="canonical" href={`${DOMINIO}${ruta}`} />}
            {ruta !== undefined && <meta property="og:url" content={`${DOMINIO}${ruta}`} />}
            {noindex && <meta name="robots" content="noindex" />}
        </>
    );
}
