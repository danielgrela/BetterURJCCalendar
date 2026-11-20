import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { IconChevronDown } from '@tabler/icons-react';

interface Props {
    /** Ancla: un enlace a #id lo abre y lo trae a la vista */
    id: string;
    titulo: string;
    /** Una línea bajo el título que resume el contenido sin abrirlo */
    resumen?: string;
    children: ReactNode;
}

// Sección plegable del dashboard (<details>): Inicio agrupa así las herramientas que no hacen
// falta a diario, sin sumar secciones al menú (en móvil no caben más)
export default function Desplegable({ id, titulo, resumen, children }: Props) {
    const ref = useRef<HTMLDetailsElement>(null);
    const { hash } = useLocation();

    useEffect(() => {
        if (hash !== `#${id}` || !ref.current) return;
        ref.current.open = true;
        ref.current.scrollIntoView({ block: 'start' });
    }, [hash, id]);

    return (
        <details ref={ref} id={id} className="group scroll-mt-4 rounded-md border border-borde bg-superficie shadow-sm dark:shadow-none">
            <summary className="min-h-11 flex flex-row items-center justify-between gap-4 p-4 lg:px-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-md hover:bg-superficie-alta transition-colors">
                {/* <summary> admite un encabezado, no un <div>: el resumen va dentro del h2 */}
                <h2 className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-lg font-bold">{titulo}</span>
                    {resumen && <span className="text-sm font-normal text-texto-suave">{resumen}</span>}
                </h2>
                <IconChevronDown size={22} stroke={2} className="shrink-0 text-texto-suave group-open:rotate-180 transition-transform" aria-hidden="true" />
            </summary>
            <div className="px-4 pb-4 lg:px-5 lg:pb-5">{children}</div>
        </details>
    );
}
