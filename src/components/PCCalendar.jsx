import Calendar from './Calendar';
import FiltersCalendar from './FiltersCalendar';
import { useFileStoreJsonFilters } from '../hooks/useFileStore';
import { 
    IconChevronLeft, 
    IconChevronRight, 
} from '@tabler/icons-react';
export default function PCCalendar({date, setDate, jsonData, year, month }) {
    const dataFiltered = useFileStoreJsonFilters((state) => state.dataFiltered);
    const visibleData = dataFiltered ?? jsonData;
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
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
                <div className="flex gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <button onClick={prevMonth} className="cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all text-slate-600 dark:text-slate-300">
                        <IconChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl transition-all text-slate-600 dark:text-slate-300">
                        <IconChevronRight size={24} />
                    </button>
                </div>
            </header>
            <FiltersCalendar sortedEvents={jsonData} className="max-w-6xl mx-auto mb-5" />
            <Calendar jsonData={visibleData} year={year} month={month} />
        </>
    );
}