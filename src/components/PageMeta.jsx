const SITIO = 'Better URJC Calendar';
const DOMINIO = 'https://betterurjccalendar.danielgrela.com';

// React 19 sube <title>, <meta> y <link> al <head> y los quita al cambiar de ruta
export default function PageMeta({ titulo, descripcion, ruta, noindex = false }) {
    return (
        <>
            <title>{titulo ? `${titulo} · ${SITIO}` : `${SITIO} · Calendario de exámenes de la URJC`}</title>
            {descripcion && <meta name="description" content={descripcion} />}
            {ruta !== undefined && <link rel="canonical" href={`${DOMINIO}${ruta}`} />}
            {noindex && <meta name="robots" content="noindex" />}
        </>
    );
}
