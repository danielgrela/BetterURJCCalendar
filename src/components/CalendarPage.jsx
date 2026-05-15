import { useEffect, useState } from 'react';
import useFileStore from '../hooks/useFileStore';
import MobileCalendar from './MobileCalendar';
import PCCalendar from './PCCalendar';
export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [isLg, setIsLg] = useState(false);
    const jsonData = useFileStore((state) => state.jsonData);
    const year = date.getFullYear();
    const month = date.getMonth();
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
            <PCCalendar parseEventDate={parseEventDate} date={date} setDate={setDate} jsonData={sortedEvents} year={year} month={month} />
            ) : 
                <MobileCalendar parseEventDate={parseEventDate} jsonData={sortedEvents} year={year} month={month} />
            }
        </>
    );
}