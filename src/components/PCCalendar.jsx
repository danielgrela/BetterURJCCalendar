import Calendar from './Calendar';
import { 
    IconChevronLeft, 
    IconChevronRight, 
} from '@tabler/icons-react';
export default function PCCalendar({ date, setDate, jsonData, year, month }) {
    const prevMonth = () => setDate(new Date(year, month - 1, 1));
    const nextMonth = () => setDate(new Date(year, month + 1, 1));
    function sanitizeDate(date) {
        let aux = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
        return aux[0].toUpperCase() + aux.slice(1);
    }
    return (
        <>
            <header className="flex flex-row items-center justify-between max-w-6xl mx-auto mb-8">
                <h1 className="text-5xl font-black text-slate-800 tracking-tight">
                    {sanitizeDate(date)}
                </h1>
                <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                    <button onClick={prevMonth} className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600">
                        <IconChevronLeft size={24} />
                    </button>
                    <button onClick={nextMonth} className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600">
                        <IconChevronRight size={24} />
                    </button>
                </div>
            </header>
            <Calendar jsonData={jsonData} year={year} month={month} />
        </>
    );
}