import { useEffect, useState } from 'react';
import useFileStore from '../hooks/useFileStore';
import MobileCalendar from './MobileCalendar';
import PCCalendar from './PCCalendar';
import parseEventDate, { sortedEvents } from '../scripts/sortEvents';
export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [isLg, setIsLg] = useState(false);
    const [loading, setLoading] = useState(true);
    const jsonData = useFileStore((state) => state.jsonData);
    const year = date.getFullYear();
    const month = date.getMonth();
    function isLgBreakpoint() {
        return isLg;
    }
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia('(min-width: 1024px)');
        const handleChange = (event) => setIsLg(event.matches);
        setLoading(false);

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
        {loading ? (
            <div className="flex items-center justify-center p-8">
                <p className="text-lg text-gray-600 dark:text-gray-400">Cargando calendario...</p>
            </div>
        ) : isLgBreakpoint() ? (
            <PCCalendar date={date} setDate={setDate} jsonData={sortedEvents(jsonData)} year={year} month={month} />
            ) : 
                <MobileCalendar jsonData={sortedEvents(jsonData)} year={year} month={month} />
            }
        </>
    );
}