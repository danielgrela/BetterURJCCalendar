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

interface Props {
    date: Date;
    setDate: (date: Date) => void;
    visibleData: Examen[];
    filtersProps: FiltersCalendarProps;
    year: number;
    month: number;
}

export default function PCCalendar({date, setDate, visibleData, filtersProps, year, month }: Props) {
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    const mesVacio = Array.isArray(visibleData) && visibleData.length > 0 && !hayExamenesEnMes(visibleData, year, month);
    function sanitizeDate(date: Date) {
        const aux = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
        return aux[0].toUpperCase() + aux.slice(1);
    }
    return (
        <>
            <header className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-8">
                <h1 className="text-5xl font-black text-texto tracking-tight">
                    {sanitizeDate(date)}
                </h1>
                <div className="flex gap-2 bg-superficie p-1.5 rounded-2xl shadow-sm dark:shadow-none border border-borde">
                    <button type="button" onClick={prevMonth} aria-label="Mes anterior" className="cursor-pointer size-11 flex items-center justify-center hover:bg-superficie-alta rounded-xl transition-all text-texto-suave">
                        <IconChevronLeft size={24} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={nextMonth} aria-label="Mes siguiente" className="cursor-pointer size-11 flex items-center justify-center hover:bg-superficie-alta rounded-xl transition-all text-texto-suave">
                        <IconChevronRight size={24} aria-hidden="true" />
                    </button>
                </div>
            </header>
            <FiltersCalendar {...filtersProps} className="max-w-6xl mx-auto mb-5" />
            {mesVacio && (
                <div className="max-w-6xl mx-auto mb-5 text-sm text-texto border border-borde bg-superficie rounded-sm px-4 py-1 gap-4 flex flex-row items-center">
                    <IconInfoCircle className="min-w-5" stroke={2} />
                    <p>No hay exámenes en este mes.</p>
                    <button type="button" onClick={() => setDate(mesDelProximoExamen(visibleData))} className="ml-auto min-h-11 px-2 cursor-pointer font-semibold text-primary hover:underline">
                        Ir al próximo examen
                    </button>
                </div>
            )}
            <Calendar jsonData={visibleData} year={year} month={month} />
        </>
    );
}