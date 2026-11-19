import { useMemo, useState } from 'react';
import useFileStore from '../hooks/useFileStore';
import useMediaQuery from '../hooks/useMediaQuery';
import MobileCalendar from './MobileCalendar';
import PCCalendar from './PCCalendar';
import { sortedEvents, mesDelProximoExamen } from '../scripts/sortEvents';
import { FILTROS_INICIALES, convocatoriasDe, filtrarExamenes } from '../scripts/filtersCalendar';
import PageMeta from './PageMeta.tsx';
import type { FiltersCalendarProps } from './FiltersCalendar';
export default function CalendarPage() {
    const jsonData = useFileStore((state) => state.jsonData);
    const [date, setDate] = useState(() => mesDelProximoExamen(jsonData));
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const examenes = useMemo(() => sortedEvents(jsonData), [jsonData]);
    const convocatorias = useMemo(() => convocatoriasDe(examenes), [examenes]);
    const visibleData = useMemo(() => filtrarExamenes(examenes, filtros), [examenes, filtros]);
    const filtersProps: FiltersCalendarProps = { filtros, setFiltros, convocatorias };
    const isLg = useMediaQuery('(min-width: 1024px)');
    const year = date.getFullYear();
    const month = date.getMonth();
    return (
        <>
        <PageMeta titulo="Calendario" noindex />
        {isLg ? (
            <PCCalendar date={date} setDate={setDate} visibleData={visibleData} filtersProps={filtersProps} year={year} month={month} />
            ) :
                <MobileCalendar visibleData={visibleData} filtersProps={filtersProps} />
            }
        </>
    );
}
