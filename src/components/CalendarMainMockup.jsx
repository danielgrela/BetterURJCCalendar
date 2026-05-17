import {
    IconSchool,
    IconClock,
    IconMapPin} from '@tabler/icons-react';

export default function Calendar({ jsonData, year, month }) {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
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
    return(
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto border border-slate-200 dark:border-gray-700">
            {/* Cabecera Días */}
            {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
                <div key={d} className="text-center text-[11px] font-bold uppercase tracking-widest dark:text-gray-400 py-4 bg-white dark:bg-gray-950">
                    {d}
                </div>
                ))}

                {/* Huecos mes anterior */}
                {[...Array(startingDay)].map((_, i) => (
                    <div key={`empty-${i}`} className="h-36 bg-slate-50/50 dark:bg-gray-800/50" />
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
                        <div key={day} className={`pb-10 relative h-36 p-2 border-t border-slate-100 dark:border-gray-700 transition-colors bg-white dark:bg-gray-950 hover:bg-slate-50 dark:hover:bg-gray-750`}>
                            <span className={`inline-flex items-center justify-center w-8 h-8 text-sm rounded-full
                                ${isToday ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-200 dark:shadow-indigo-800' : 'text-slate-600 dark:text-slate-300 font-semibold'}`}>
                                {day}
                            </span>

                            <div className="flex flex-col gap-1.5 max-h-full overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar pb-2">
                                {dayEvents.map((ev, idx) => (
                                    <div 
                                        key={idx}
                                        className="group relative p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border-l-[3px] border-primary text-primary shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-1 mb-0.5">
                                            <IconSchool size={10} className="text-tertiary" />
                                            <p className="text-[10px] font-bold leading-tight truncate uppercase">
                                                {ev.Asignatura.split('(')[0].trim()}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 text-[9px] text-tertiary font-medium">
                                            <IconClock size={10} className="min-w-fit" />
                                            <span>{ev.Hora}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] text-tertiary font-medium">
                                            <IconMapPin size={10} className='min-w-fit'/>
                                            <span>{ev.Aula}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    }