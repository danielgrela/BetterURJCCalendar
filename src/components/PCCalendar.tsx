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
import { useEffect, type ReactNode } from 'react';
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
}

export default function PCCalendar({date, setDate, visibleData, filtersProps, year, month, estadoVacio, solapamientos }: Props) {
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    const hoy = new Date();
    const esMesActual = year === hoy.getFullYear() && month === hoy.getMonth();
    // Atajos: ← y → cambian de mes, T vuelve a hoy. No cuentan mientras se escribe, con un diálogo
    // o un menú abiertos, ni combinados con modificadores (Alt+← es «atrás» en el navegador)
    useEffect(() => {
        const alPulsar = (e: KeyboardEvent) => {
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const destino = e.target instanceof HTMLElement ? e.target : null;
            if (destino?.closest('input, textarea, select, [contenteditable="true"]')) return;
            if (document.querySelector('dialog[open], :popover-open')) return;
            const tecla = e.key.toLowerCase();
            const nuevo = tecla === 'arrowleft' ? new Date(year, month - 1, 1)
                : tecla === 'arrowright' ? new Date(year, month + 1, 1)
                : tecla === 't' ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                : null;
            if (!nuevo) return;
            e.preventDefault();
            setDate(nuevo);
        };
        document.addEventListener('keydown', alPulsar);
        return () => document.removeEventListener('keydown', alPulsar);
    }, [year, month, setDate]);
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
                    <button type="button" onClick={() => setDate(new Date(hoy.getFullYear(), hoy.getMonth(), 1))} disabled={esMesActual} aria-keyshortcuts="T" title="Volver al mes actual (T)" className="min-h-11 px-4 border border-borde-fuerte bg-superficie font-medium cursor-pointer hover:bg-superficie-alta transition-colors disabled:cursor-default disabled:text-texto-suave disabled:hover:bg-superficie">
                        Hoy
                    </button>
                    <div className="flex border border-borde-fuerte bg-superficie">
                        <button type="button" onClick={prevMonth} aria-label="Mes anterior" aria-keyshortcuts="ArrowLeft" title="Mes anterior (←)" className="cursor-pointer size-11 flex items-center justify-center hover:bg-superficie-alta transition-colors text-texto">
                            <IconChevronLeft size={22} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={nextMonth} aria-label="Mes siguiente" aria-keyshortcuts="ArrowRight" title="Mes siguiente (→)" className="cursor-pointer size-11 flex items-center justify-center border-l border-borde-fuerte hover:bg-superficie-alta transition-colors text-texto">
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
            <Calendar jsonData={visibleData} year={year} month={month} solapamientos={solapamientos} conAcciones />
        </>
    );
}