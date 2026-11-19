import FiltersCalendar from './FiltersCalendar';
import ExamCard from './ExamCard';
import { claveExamen } from '../scripts/examen';
import type { FiltersCalendarProps } from './FiltersCalendar';
import type { Examen } from '../types/examen';

export default function MobileCalendar({ visibleData, filtersProps }: { visibleData: Examen[], filtersProps: FiltersCalendarProps }) {
    return (
        <div className="flex flex-col gap-6 max-h-full">
            <header className="flex flex-col mx-auto h-fit items-start justify-between mb-4 w-full">
                <h1 className="text-3xl font-black text-texto tracking-tight">
                    Mis exámenes
                </h1>
                <FiltersCalendar {...filtersProps} />
            </header>
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-2">
                {Array.isArray(visibleData) && visibleData.length > 0 ? (visibleData.map((ev) => (
                    <ExamCard key={claveExamen(ev)} examen={ev} variant="list" />
                    )))
                    : <p className='font-medium text-center'>No hay nada aquí. Si crees que es un error recarga la página o asegúrate de haber importado tus exámenes</p>
                }
            </div>
        </div>
    )
}