import handleChange from '../scripts/filtersCalendar';
import parseEventDate from '../scripts/sortEvents';
export default function FiltersCalendar({ sortedEvents, ...props }) {
    return (
        <form onChange={(e) => handleChange(e, parseEventDate, sortedEvents)} className={`w-full mt-4 flex flex-row gap-1 ${props.className}`}>
            <select id="convocatoria" name="convocatoria" className="w-48 px-2 py-3 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Convocatoria">Convocatoria</option>
                <option value="Septiembre">Septiembre</option>
                <option value="Enero">Enero</option>
                <option value="Mayo">Mayo</option>
                <option value="Junio">Junio</option>
            </select>
            <select id="fecha" name="fecha" className="w-32 p-3 rounded-lg border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Todos">Todos</option>
                <option value="Pendientes">Pendientes</option>
            </select>
        </form>
    );
}