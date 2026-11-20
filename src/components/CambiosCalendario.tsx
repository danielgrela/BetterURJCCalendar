import type { ReactNode } from 'react';
import { IconRefreshAlert } from '@tabler/icons-react';
import { textoCambio, type Cambio } from '../scripts/cambios';

interface Props {
    cambios: Cambio[];
    titulo: string;
    /** Botones bajo la lista (p. ej. «Entendido» en Inicio) */
    children?: ReactNode;
}

// Lista de lo que cambia entre dos importaciones: antes de importar (Importar) y después (Inicio)
export default function CambiosCalendario({ cambios, titulo, children }: Props) {
    return (
        <section aria-label={titulo} className="flex flex-row gap-4 p-4 lg:p-5 rounded-md border border-borde bg-superficie shadow-sm dark:shadow-none">
            <IconRefreshAlert size={24} stroke={2} className="min-w-fit text-primary" aria-hidden="true" />
            <div className="flex flex-col gap-2 min-w-0">
                <h2 className="text-base lg:text-lg font-bold">{titulo}</h2>
                <ul className="flex flex-col gap-1 text-sm text-texto list-disc ps-5">
                    {cambios.map((cambio, i) => <li key={i}>{textoCambio(cambio)}</li>)}
                </ul>
                {children && <div className="mt-2 flex flex-row flex-wrap gap-2">{children}</div>}
            </div>
        </section>
    );
}
