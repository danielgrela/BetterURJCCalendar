import { useEffect, useState } from 'react';
import useFileStore from '../hooks/useFileStore';
import { MobileCalendar } from './MobileCalendar';
import PCCalendar from './PCCalendar';
export function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [isLg, setIsLg] = useState(false);
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
            <PCCalendar date={date} setDate={setDate} jsonData={jsonData} year={year} month={month} />
            ) : 
                <MobileCalendar jsonData={jsonData} year={year} month={month} />
            }
        </>
    );
}