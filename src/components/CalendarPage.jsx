import { useEffect, useMemo, useState } from 'react';
import useFileStore from '../hooks/useFileStore';
import MobileCalendar from './MobileCalendar';
import PCCalendar from './PCCalendar';
import { sortedEvents, mesDelProximoExamen } from '../scripts/sortEvents';
import { FILTROS_INICIALES, convocatoriasDe, filtrarExamenes } from '../scripts/filtersCalendar';
export default function CalendarPage() {
    const jsonData = useFileStore((state) => state.jsonData);
    const [date, setDate] = useState(() => mesDelProximoExamen(jsonData));
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const examenes = useMemo(() => sortedEvents(jsonData), [jsonData]);
    const convocatorias = useMemo(() => convocatoriasDe(examenes), [examenes]);
    const visibleData = useMemo(() => filtrarExamenes(examenes, filtros), [examenes, filtros]);
    const filtersProps = { filtros, setFiltros, convocatorias };
    const [isLg, setIsLg] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
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
            <PCCalendar date={date} setDate={setDate} visibleData={visibleData} filtersProps={filtersProps} year={year} month={month} />
            ) :
                <MobileCalendar visibleData={visibleData} filtersProps={filtersProps} />
            }
        </>
    );
}