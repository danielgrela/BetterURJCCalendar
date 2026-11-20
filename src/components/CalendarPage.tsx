import { useMemo, useState } from 'react';
import useExamenes from '../hooks/useExamenes';
import { useExamenesVisibles } from '../hooks/useExamenesVisibles';
import useMediaQuery from '../hooks/useMediaQuery';
import MobileCalendar from './MobileCalendar';
import PCCalendar from './PCCalendar';
import { sortedEvents, mesDelProximoExamen } from '../scripts/sortEvents';
import { FILTROS_INICIALES, convocatoriasDe, filtrarExamenes } from '../scripts/filtersCalendar';
import PageMeta from './PageMeta.tsx';
import { detectarSolapamientos } from '../scripts/solapamientos';
import type { FiltersCalendarProps } from './FiltersCalendar';
import EmptyState from './EmptyState';
import ImportButton from './ImportButton';
import CreateExamLink from './CreateExamLink';
import { IconCalendarOff, IconFilterOff } from '@tabler/icons-react';
export default function CalendarPage() {
    const hayExamenes = useExamenes().length > 0;
    const { visibles: jsonData, ocultos } = useExamenesVisibles();
    const [date, setDate] = useState(() => mesDelProximoExamen(jsonData));
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const examenes = useMemo(() => sortedEvents(jsonData), [jsonData]);
    // Sobre todo lo visible: un cruce existe aunque el filtro oculte uno de los dos (pero no con
    // una asignatura oculta o de otro grupo)
    const solapamientos = useMemo(() => detectarSolapamientos(examenes), [examenes]);
    const convocatorias = useMemo(() => convocatoriasDe(examenes), [examenes]);
    const visibleData = useMemo(() => filtrarExamenes(examenes, filtros), [examenes, filtros]);
    const filtersProps: FiltersCalendarProps = { filtros, setFiltros, convocatorias, ocultos };
    const isLg = useMediaQuery('(min-width: 1024px)');
    // Sin datos → Importar; con datos pero nada tras filtrar → Quitar filtros
    const estadoVacio = !hayExamenes ? (
        <EmptyState icono={<IconCalendarOff size={32} stroke={2} />} titulo="Aún no hay exámenes" texto="Importa el Excel de exámenes de la URJC para verlos en el calendario, o añade los tuyos a mano.">
            <ImportButton />
            <CreateExamLink />
        </EmptyState>
    ) : visibleData.length === 0 ? (
        <EmptyState icono={<IconFilterOff size={32} stroke={2} />} titulo="Ningún examen coincide con los filtros">
            <button type="button" onClick={() => setFiltros(FILTROS_INICIALES)} className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors">
                Quitar filtros
            </button>
        </EmptyState>
    ) : null;
    const year = date.getFullYear();
    const month = date.getMonth();
    return (
        <>
        <PageMeta titulo="Calendario" noindex />
        {isLg ? (
            <PCCalendar date={date} setDate={setDate} visibleData={visibleData} filtersProps={filtersProps} year={year} month={month} estadoVacio={estadoVacio} solapamientos={solapamientos} />
            ) :
                <MobileCalendar visibleData={visibleData} filtersProps={filtersProps} estadoVacio={estadoVacio} solapamientos={solapamientos} />
            }
        </>
    );
}
