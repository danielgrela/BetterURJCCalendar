import Calendar from './Calendar';
import FiltersCalendar from './FiltersCalendar';
import { mesDelProximoExamen, hayExamenesEnMes } from '../scripts/sortEvents';
import { 
    IconChevronLeft, 
    IconChevronRight, 
    IconInfoCircle,
} from '@tabler/icons-react';
import type { FiltersCalendarProps } from './FiltersCalendar';
import type { Examen } from '../types/examen';
import type { ReactNode } from 'react';
import type { Solapamiento } from '../scripts/solapamientos';

interface Props {
    date: Date;
    setDate: (date: Date) => void;
    visibleData: Examen[];
    filtersProps: FiltersCalendarProps;
    year: number;
    month: number;
    /** Aviso si no hay exámenes que mostrar (sin datos o sin resultados con los filtros) */
    estadoVacio: ReactNode;
    solapamientos: Map<string, Solapamiento>;
    onEliminar: (examen: Examen) => void;
}

export default function PCCalendar({date, setDate, visibleData, filtersProps, year, month, estadoVacio, solapamientos, onEliminar }: Props) {
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    const hoy = new Date();
    const esMesActual = year === hoy.getFullYear() && month === hoy.getMonth();
    const mesVacio = Array.isArray(visibleData) && visibleData.length > 0 && !hayExamenesEnMes(visibleData, year, month);
    function sanitizeDate(date: Date) {
        const aux = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
        return aux[0].toUpperCase() + aux.slice(1);
    }
    return (
        <>
            <header className="flex flex-row items-center justify-between gap-4 max-w-6xl mx-auto mb-6">
                <h1 className="text-4xl font-bold text-texto" aria-live="polite">
                    {sanitizeDate(date)}
                </h1>
                <div className="flex flex-row items-center gap-2">
                    <button type="button" onClick={() => setDate(new Date(hoy.getFullYear(), hoy.getMonth(), 1))} disabled={esMesActual} className="min-h-11 px-4 border border-borde-fuerte bg-superficie font-medium cursor-pointer hover:bg-superficie-alta transition-colors disabled:cursor-default disabled:text-texto-suave disabled:hover:bg-superficie">
                        Hoy
                    </button>
                    <div className="flex border border-borde-fuerte bg-superficie">
                        <button type="button" onClick={prevMonth} aria-label="Mes anterior" className="cursor-pointer size-11 flex items-center justify-center hover:bg-superficie-alta transition-colors text-texto">
                            <IconChevronLeft size={22} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={nextMonth} aria-label="Mes siguiente" className="cursor-pointer size-11 flex items-center justify-center border-l border-borde-fuerte hover:bg-superficie-alta transition-colors text-texto">
                            <IconChevronRight size={22} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>
            <FiltersCalendar {...filtersProps} className="max-w-6xl mx-auto mb-5" />
            {mesVacio && (
                <div className="max-w-6xl mx-auto mb-5 text-sm text-texto border border-borde bg-superficie rounded-sm px-4 py-1 gap-4 flex flex-row items-center">
                    <IconInfoCircle className="min-w-5 text-texto-suave" stroke={2} aria-hidden="true" />
                    <p>No hay exámenes en este mes.</p>
                    <button type="button" onClick={() => setDate(mesDelProximoExamen(visibleData))} className="ml-auto min-h-11 px-2 cursor-pointer font-semibold text-enlace hover:underline">
                        Ir al próximo examen
                    </button>
                </div>
            )}
            {estadoVacio && <div className="max-w-6xl mx-auto mb-5">{estadoVacio}</div>}
            <Calendar jsonData={visibleData} year={year} month={month} solapamientos={solapamientos} onEliminar={onEliminar} />
        </>
    );
}