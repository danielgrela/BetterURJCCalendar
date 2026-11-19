import type { ReactNode } from 'react';

interface Props {
    icono: ReactNode;
    titulo: string;
    texto?: string;
    /** Siguiente paso: un botón o enlace */
    children?: ReactNode;
}

// Estado vacío o sin resultados: qué pasa y qué hacer a continuación
export default function EmptyState({ icono, titulo, texto, children }: Props) {
    return (
        <div className="flex flex-col items-center gap-2 text-center py-10 px-4 rounded-sm border border-borde bg-superficie">
            <span className="text-texto-suave" aria-hidden="true">{icono}</span>
            <p className="text-lg font-bold text-texto">{titulo}</p>
            {texto && <p className="text-sm text-texto-suave max-w-prose">{texto}</p>}
            {children && <div className="mt-3">{children}</div>}
        </div>
    );
}
