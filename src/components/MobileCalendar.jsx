import FiltersCalendar from './FiltersCalendar';
import ExamCard from './ExamCard';
export default function MobileCalendar({ visibleData, filtersProps }) {
    return (
        <div className="flex flex-col gap-6 max-h-full">
            <header className="flex flex-col mx-auto h-fit items-start justify-between mb-4 w-full">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    Mis Exámenes
                </h1>
                <FiltersCalendar {...filtersProps} />
            </header>
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-2">
                {Array.isArray(visibleData) && visibleData.length > 0 ? (visibleData.map((ev, idx) => (
                    <ExamCard key={idx} examen={ev} variant="list" />
                    )))
                    : <p className='font-medium text-center'>No hay nada aquí. Si crees que es un error recarga la página o asegurate de haber importado tus exámenes</p>
                }
            </div>
        </div>
    )
}