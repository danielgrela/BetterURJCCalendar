import React, { useState } from 'react';
import { 
    IconChevronLeft, 
    IconChevronRight, 
    IconSchool,
    IconClock,
    IconMapPin
} from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
export function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const jsonData = useFileStore((state) => state.jsonData);

    const year = date.getFullYear();
    const month = date.getMonth();

    // Configuración del calendario
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    const getEventsForDay = (day) => {
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

    function sanitizeDate(date) {
        let aux = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
        return aux[0].toUpperCase() + aux.slice(1);
    }

    return (
        <>
            <header className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-8">
                <h1 className="text-5xl font-black text-slate-800 tracking-tight">
                    {sanitizeDate(date)}
                </h1>
                
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600">
                        <IconChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600">
                        <IconChevronRight size={24} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto border border-slate-200">
                {/* Cabecera Días */}
                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                    <div key={d} className="text-center text-[11px] font-bold uppercase tracking-widest text-secundario py-4 bg-white">
                        {d}
                    </div>
                ))}

                {/* Huecos mes anterior */}
                {[...Array(startingDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-36 bg-slate-50/50" />
                ))}

                {/* Días del mes */}
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    const isToday = 
                        day === new Date().getDate() && 
                        month === new Date().getMonth() && 
                        year === new Date().getFullYear();

                    return (
                        <div key={day} className={`relative h-36 p-2 border-t border-slate-100 transition-colors bg-white hover:bg-slate-50`}>
                            <span className={`inline-flex items-center justify-center w-8 h-8 text-sm rounded-full mb-2
                                ${isToday ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200' : 'text-slate-600 font-semibold'}`}>
                                {day}
                            </span>

                            <div className="flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden max-h-25 pr-1 custom-scrollbar pb-2">
                                {dayEvents.map((ev, idx) => ( console.log(ev),
                                    <div 
                                        key={idx}
                                        className="group relative p-2 rounded-lg bg-indigo-50 border-l-[3px] border-primary text-primary shadow-sm hover:shadow-md transition-shadow cursor-help"
                                    >
                                        <div className="flex items-center gap-1 mb-0.5">
                                            <IconSchool size={10} className="text-tertiary" />
                                            <p className="text-[10px] font-bold leading-tight truncate uppercase">
                                                {ev.Asignatura.split('(')[0].trim()}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 text-[9px] text-tertiary font-medium">
                                            <IconClock size={10} />
                                            <span>{ev.Hora}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] text-tertiary font-medium">
                                            <IconClock size={10} />
                                            <span>{ev.Aula}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}