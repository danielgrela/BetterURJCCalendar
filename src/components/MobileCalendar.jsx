import { 
    IconClock,
    IconSchool,
} from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
export const MobileCalendar = ({ jsonData, year, month }) => {
    function parseEventDate(fecha) {
        if (!fecha) {
            return new Date(0);
        }

        const [day, monthValue, yearValue] = fecha.split('-').map(Number);
        if (!day || !monthValue || !yearValue) {
            return new Date(0);
        }

        return new Date(yearValue, monthValue - 1, day);
    }
    const sortedEvents = Array.isArray(jsonData)
            ? [...jsonData]
                .filter((event) => event && event.Fecha)
                .sort((a, b) => {
                    const dateDiff = parseEventDate(a.Fecha) - parseEventDate(b.Fecha);
                    if (dateDiff !== 0) {
                        return dateDiff;
                    }
    
                    return (a.Hora || '').localeCompare(b.Hora || '');
                })
            : [];
    const [dataFiltered, setDataFiltered] = useState(sortedEvents);
    const handleChange = (e) => {
        const target = e.target;
        if(target?.name === 'convocatoria') {
            console.log(target.value);
            const value = target.value;
            setDataFiltered((value && value !== 'Convocatoria') ? sortedEvents.filter(ev => ev.Convocatoria === value) : sortedEvents );
        }
    };
    return (
        <div className="flex flex-col gap-6 max-h-full pt-8">
            <header className="flex flex-col mx-auto h-fit items-start justify-between mb-4 px-4 w-full">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    Mis Exámenes
                </h1>
                <form onChange={handleChange} className='w-full mt-4'>
                    <select id="convocatoria" name="convocatoria" className="w-full p-3 rounded-lg border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="Convocatoria">Convocatoria</option>
                        <option value="Septiembre">Septiembre</option>
                        <option value="Enero">Enero</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Junio">Junio</option>
                    </select>
                </form>
            </header>
            <div className="flex flex-col gap-1.5 px-3 overflow-y-auto custom-scrollbar pb-2">
                {sortedEvents.length > 0 ? dataFiltered.map((ev, idx) => (
                    <div 
                        key={idx}
                        className="flex flex-col gap-2 group relative p-5 border-l-5 border-primary text-primary rounded-md shadow-sm">
                        <div className='flex flex-row justify-between items-center'>
                            <div className='bg-gray-200 rounded-sm py-1 px-4'>
                                    <span>{ev.Convocatoria}</span>
                            </div>
                            <div className='flex flex-col w-1/2 items-end'>
                                <div className="flex items-center gap-1 text-xl font-bold text-primary">
                                    <IconClock size={10} />
                                    <span>{ev.Hora}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-bold text-primary">
                                    <span>{ev.Fecha}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mb-0.5 overflow-hidden flex-1">
                            <IconSchool size={25} className="text-primary" />
                            <p className="text-xl font-bold leading-tight truncate uppercase">
                                {ev.Asignatura.split('(')[0].trim()}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-md text-tertiary font-medium">
                            <span className='line-clamp-2'>{ev.Plan}</span>
                        </div>
                        <div className="flex items-center gap-1 text-md text-tertiary font-medium">
                            <IconSchool size={16} />
                            <span>{ev.Aula}</span>
                        </div>
                    </div> 
                    )) 
                    : <p>Porfavor, importa tus exámenes</p>
                }
            </div>
        </div>
    )
}