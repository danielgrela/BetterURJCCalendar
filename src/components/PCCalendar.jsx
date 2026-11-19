import Calendar from './Calendar';
import FiltersCalendar from './FiltersCalendar';
import { mesDelProximoExamen, hayExamenesEnMes } from '../scripts/sortEvents';
import { 
    IconChevronLeft, 
    IconChevronRight, 
    IconInfoCircle,
} from '@tabler/icons-react';
export default function PCCalendar({date, setDate, visibleData, filtersProps, year, month }) {
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    const mesVacio = Array.isArray(visibleData) && visibleData.length > 0 && !hayExamenesEnMes(visibleData, year, month);
    function sanitizeDate(date) {
        let aux = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
        return aux[0].toUpperCase() + aux.slice(1);
    }
    return (
        <>
            <header className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-8">
                <h1 className="text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {sanitizeDate(date)}
                </h1>
                <div className="flex gap-2 bg-white dark:bg-gray-950 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <button onClick={prevMonth} className="cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all text-slate-600 dark:text-slate-300">
                        <IconChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all text-slate-600 dark:text-slate-300">
                        <IconChevronRight size={24} />
                    </button>
                </div>
            </header>
            <FiltersCalendar {...filtersProps} className="max-w-6xl mx-auto mb-5" />
            {mesVacio && (
                <div className="max-w-6xl mx-auto mb-5 text-sm text-secundario dark:text-gray-300 border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 rounded-sm px-4 py-1 gap-4 flex flex-row items-center">
                    <IconInfoCircle className="min-w-5" stroke={2} />
                    <p>No hay exámenes en este mes.</p>
                    <button type="button" onClick={() => setDate(mesDelProximoExamen(visibleData))} className="ml-auto min-h-11 px-2 cursor-pointer font-semibold text-primary hover:underline">
                        Ir al próximo examen
                    </button>
                </div>
            )}
            <Calendar jsonData={visibleData} year={year} month={month} />
        </>
    );
}