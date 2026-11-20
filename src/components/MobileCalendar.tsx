import { useMemo } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import FiltersCalendar from './FiltersCalendar';
import ExamCard from './ExamCard';
import { claveExamen, diasHasta } from '../scripts/examen';
import parseEventDate from '../scripts/sortEvents';
import type { FiltersCalendarProps } from './FiltersCalendar';
import type { Examen } from '../types/examen';
import type { ReactNode } from 'react';
import type { Solapamiento } from '../scripts/solapamientos';

interface Props {
    visibleData: Examen[];
    filtersProps: FiltersCalendarProps;
    /** Lo que se pinta si no hay exámenes que mostrar */
    estadoVacio: ReactNode;
    solapamientos: Map<string, Solapamiento>;
}

const MES_Y_ANIO = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
const ID_PROXIMO = 'proximo-examen';

// Exámenes (ya ordenados) agrupados por mes: [«Mayo de 2026», [...]]
function porMes(examenes: Examen[]): [string, Examen[]][] {
    const grupos = new Map<string, Examen[]>();
    for (const ev of examenes) {
        const mes = MES_Y_ANIO.format(parseEventDate(ev.Fecha));
        grupos.set(mes, [...(grupos.get(mes) ?? []), ev]);
    }
    return [...grupos];
}

export default function MobileCalendar({ visibleData, filtersProps, estadoVacio, solapamientos }: Props) {
    const grupos = useMemo(() => porMes(visibleData), [visibleData]);
    const hoy = new Date();
    const proximo = visibleData.find((ev) => diasHasta(ev.Fecha, hoy) >= 0);
    // El atajo solo tiene sentido si hay exámenes pasados por encima del próximo
    const hayPasadosAntes = proximo !== undefined && visibleData[0] !== proximo;
    const irAlProximo = () => document.getElementById(ID_PROXIMO)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
    });
    return (
        <div className="flex flex-col gap-4">
            <header className="flex flex-col gap-4 w-full">
                <h1 className="text-3xl font-bold text-texto">Mis exámenes</h1>
                <FiltersCalendar {...filtersProps} />
                {hayPasadosAntes && (
                    <button type="button" onClick={irAlProximo} className="self-start min-h-11 inline-flex items-center gap-2 px-1 font-semibold text-enlace cursor-pointer hover:underline">
                        <IconArrowDown size={18} stroke={2} aria-hidden="true" />
                        Ir al próximo examen
                    </button>
                )}
            </header>
            {estadoVacio ?? grupos.map(([mes, examenes]) => (
                <section key={mes} aria-labelledby={`mes-${mes}`} className="flex flex-col gap-3">
                    {/* Cabecera fija mientras se recorre el mes (main es el contenedor que hace scroll) */}
                    <h2 id={`mes-${mes}`} className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-lienzo border-b border-borde text-lg font-bold first-letter:uppercase">
                        {mes}
                    </h2>
                    {examenes.map((ev) => (
                        <div key={claveExamen(ev)} id={ev === proximo ? ID_PROXIMO : undefined} className="scroll-mt-14">
                            <ExamCard examen={ev} solapamiento={solapamientos.get(claveExamen(ev))} hoy={hoy} conAcciones />
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
}
