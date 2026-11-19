import FiltersCalendar from './FiltersCalendar';
import ExamCard from './ExamCard';
import { claveExamen } from '../scripts/examen';
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

export default function MobileCalendar({ visibleData, filtersProps, estadoVacio, solapamientos }: Props) {
    return (
        <div className="flex flex-col gap-6 max-h-full">
            <header className="flex flex-col mx-auto h-fit items-start justify-between mb-4 w-full">
                <h1 className="text-3xl font-black text-texto tracking-tight">
                    Mis exámenes
                </h1>
                <FiltersCalendar {...filtersProps} />
            </header>
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-2">
                {estadoVacio ?? visibleData.map((ev) => (
                    <ExamCard key={claveExamen(ev)} examen={ev} variant="list" solapamiento={solapamientos.get(claveExamen(ev))} />
                ))}
            </div>
        </div>
    )
}