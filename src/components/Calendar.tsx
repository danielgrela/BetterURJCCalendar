import { useEffect, useRef, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import ExamCard from './ExamCard';
import { claveExamen, fechaLarga } from '../scripts/examen';
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

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Exámenes que caben en una celda; el resto se resume en «+N más» y se ven en el detalle del día
const MAX_POR_DIA = 2;

// today: día que se resalta (por defecto, hoy) · compact: mockup de la portada, sin detalle al pulsar
export default function Calendar({ jsonData, year, month, today = new Date(), compact = false, solapamientos }: Props) {
    const [diaAbierto, setDiaAbierto] = useState<number | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (diaAbierto !== null) dialogRef.current?.showModal();
    }, [diaAbierto]);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const porDia = new Map<number, Examen[]>();
    for (const evento of Array.isArray(jsonData) ? jsonData : []) {
        if (!evento.Fecha) continue;
        const [d, m, y] = evento.Fecha.split('-').map(Number);
        if (m === month + 1 && y === year) porDia.set(d, [...(porDia.get(d) ?? []), evento]);
    }
    const examenesAbiertos = diaAbierto !== null ? porDia.get(diaAbierto) ?? [] : [];
    const abrir = compact ? undefined : (dia: number) => () => setDiaAbierto(dia);

    return (
        <>
        <div className={`grid grid-cols-7 gap-px bg-borde rounded-md overflow-hidden border border-borde shadow-sm dark:shadow-none max-w-6xl mx-auto ${compact ? '[zoom:0.75]' : ''}`}>
            {DIAS_SEMANA.map((d) => (
                <div key={d} className="text-center text-sm font-medium text-texto-suave py-2 bg-superficie">
                    {d}
                </div>
            ))}

            {/* Huecos del mes anterior */}
            {[...Array(startingDay)].map((_, i) => (
                <div key={`empty-${i}`} className="min-h-28 bg-lienzo" />
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayEvents = porDia.get(day) ?? [];
                const ocultos = dayEvents.length - MAX_POR_DIA;
                const isToday =
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();

                return (
                    <div key={day} className="min-h-28 p-1.5 flex flex-col gap-1 bg-superficie">
                        <span className={`inline-flex items-center justify-center size-7 text-sm rounded-full tabular-nums
                            ${isToday ? 'ring-2 ring-primary text-primary font-bold' : 'text-texto-suave font-medium'}`}>
                            {day}
                            {isToday && <span className="sr-only"> (hoy)</span>}
                        </span>
                        {dayEvents.slice(0, MAX_POR_DIA).map((ev) => (
                            <ExamCard key={claveExamen(ev)} examen={ev} variant="line" solapamiento={solapamientos?.get(claveExamen(ev))} onSelect={abrir?.(day)} />
                        ))}
                        {ocultos > 0 && (abrir
                            ? <button type="button" onClick={abrir(day)} className="text-start text-xs font-semibold text-enlace px-1.5 py-0.5 rounded-sm cursor-pointer hover:underline">+{ocultos} más</button>
                            : <span className="text-xs font-semibold text-texto-suave px-1.5">+{ocultos} más</span>
                        )}
                    </div>
                );
            })}
        </div>
        {!compact && (
            // Detalle del día: todos sus exámenes en tarjeta completa. Esc, el botón o pulsar fuera lo cierran
            <dialog
                ref={dialogRef}
                onClose={() => setDiaAbierto(null)}
                onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
                aria-labelledby="detalle-dia-titulo"
                className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[85dvh] rounded-md bg-lienzo text-texto border border-borde p-0 shadow-lg dark:shadow-none overscroll-contain backdrop:bg-black/50">
                <div className="flex flex-col gap-4 p-5">
                    <div className="flex flex-row items-center justify-between gap-4">
                        <h2 id="detalle-dia-titulo" className="text-xl font-bold first-letter:uppercase">
                            {examenesAbiertos[0] ? fechaLarga(examenesAbiertos[0].Fecha) : ''}
                        </h2>
                        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar" className="size-11 shrink-0 flex items-center justify-center rounded-sm cursor-pointer text-texto-suave hover:bg-superficie-alta transition-colors">
                            <IconX size={22} stroke={2} aria-hidden="true" />
                        </button>
                    </div>
                    {examenesAbiertos.map((ev) => (
                        <ExamCard key={claveExamen(ev)} examen={ev} solapamiento={solapamientos?.get(claveExamen(ev))} hoy={today} />
                    ))}
                </div>
            </dialog>
        )}
        </>
    );
}
