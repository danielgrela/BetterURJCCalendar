import ExamCard from './ExamCard';
import { claveExamen } from '../scripts/examen';
import type { Examen } from '../types/examen';
import type { Solapamiento } from '../scripts/solapamientos';

interface Props {
    jsonData: Examen[] | null | undefined;
    year: number;
    /** 0 = enero */
    month: number;
    today?: Date;
    compact?: boolean;
    solapamientos?: Map<string, Solapamiento>;
}

// today: día que se resalta (por defecto, hoy) · compact: versión reducida para la portada
export default function Calendar({ jsonData, year, month, today = new Date(), compact = false, solapamientos }: Props) {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const getEventsForDay = (day: number) => {
    if (!jsonData || !Array.isArray(jsonData)) return [];
        return jsonData.filter(evento => {
            if (!evento.Fecha) return false;
            const [d, m, y] = evento.Fecha.split('-').map(Number);
            return (
                d === day &&
                m === (month + 1) &&
                y === year
            );
        });
    };
    return(
        <div className={`grid grid-cols-7 gap-px bg-borde rounded-2xl overflow-hidden shadow-2xl dark:shadow-none max-w-6xl mx-auto border border-borde ${compact ? '[zoom:0.75]' : ''}`}>
            {/* Cabecera Días */}
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                <div key={d} className="text-center text-[11px] font-bold uppercase tracking-widest text-texto-suave py-4 bg-superficie">
                    {d}
                </div>
                ))}

                {/* Huecos mes anterior */}
                {[...Array(startingDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-36 bg-lienzo" />
                ))}

                {/* Días del mes */}
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    const isToday = 
                        day === today.getDate() && 
                        month === today.getMonth() && 
                        year === today.getFullYear();

                    return (
                        <div key={day} className={`pb-10 relative h-36 p-2 border-t border-borde transition-colors bg-superficie hover:bg-lienzo`}>
                            <span className={`inline-flex items-center justify-center w-8 h-8 text-sm rounded-full
                                ${isToday ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200 dark:shadow-indigo-800' : 'text-texto-suave font-semibold'}`}>
                                {day}
                            </span>

                            <div className="flex flex-col gap-1.5 max-h-full overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar pb-2">
                                {dayEvents.map((ev) => (
                                    <ExamCard key={claveExamen(ev)} examen={ev} variant="compact" solapamiento={solapamientos?.get(claveExamen(ev))} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }