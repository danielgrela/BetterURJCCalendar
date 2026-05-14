import React, { useEffect, useState } from 'react';
import { 
    IconClock,
    IconChevronLeft, 
    IconChevronRight, 
    IconSchool,
} from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
import Calendar from './Calendar';
import { MobileCalendar } from './MobileCalendar';
export function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [isLg, setIsLg] = useState(false);
    const jsonData = useFileStore((state) => state.jsonData);
    const year = date.getFullYear();
    const month = date.getMonth();
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    function sanitizeDate(date) {
        let aux = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
        return aux[0].toUpperCase() + aux.slice(1);
    }
    function isLgBreakpoint() {
        return isLg;
    }

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia('(min-width: 1024px)');
        const handleChange = (event) => setIsLg(event.matches);

        handleChange(media);

        if (media.addEventListener) {
            media.addEventListener('change', handleChange);
        } else {
            media.addListener(handleChange);
        }

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', handleChange);
            } else {
                media.removeListener(handleChange);
            }
        };
    }, []);
    return (
        <>
        {isLgBreakpoint() ? (
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
            <Calendar jsonData={jsonData} year={year} month={month} />
            </>
            ) : 
                <MobileCalendar jsonData={jsonData} year={year} month={month} />
            }
        </>
    );
}