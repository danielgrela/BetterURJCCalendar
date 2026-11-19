import { useId, type ChangeEvent } from 'react';
import type { FiltrosCalendario } from '../types/examen';

export interface FiltersCalendarProps {
    filtros: FiltrosCalendario;
    setFiltros: (filtros: FiltrosCalendario) => void;
    convocatorias: string[];
    className?: string;
}

export default function FiltersCalendar({ filtros, setFiltros, convocatorias, className = '' }: FiltersCalendarProps) {
    const id = useId();
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
    return (
        <form onSubmit={(e) => e.preventDefault()} className={`w-full mt-4 flex flex-row gap-1 ${className}`}>
            <label htmlFor={`${id}-convocatoria`} className="sr-only">Convocatoria</label>
            <select id={`${id}-convocatoria`} name="convocatoria" value={filtros.convocatoria} onChange={handleChange} className="w-48 px-2 py-3 rounded-lg border border-borde-fuerte bg-superficie shadow-sm dark:shadow-none">
                <option value="">Convocatoria</option>
                {convocatorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <label htmlFor={`${id}-fecha`} className="sr-only">Exámenes que se muestran</label>
            <select id={`${id}-fecha`} name="fecha" value={filtros.fecha} onChange={handleChange} className="w-32 p-3 rounded-lg border border-borde-fuerte bg-superficie shadow-sm dark:shadow-none">
                <option value="Todos">Todos</option>
                <option value="Pendientes">Pendientes</option>
            </select>
        </form>
    );
}
