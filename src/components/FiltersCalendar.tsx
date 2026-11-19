import type { ChangeEvent } from 'react';
import type { FiltrosCalendario } from '../types/examen';

export interface FiltersCalendarProps {
    filtros: FiltrosCalendario;
    setFiltros: (filtros: FiltrosCalendario) => void;
    convocatorias: string[];
    className?: string;
}

export default function FiltersCalendar({ filtros, setFiltros, convocatorias, className = '' }: FiltersCalendarProps) {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
    return (
        <form onSubmit={(e) => e.preventDefault()} className={`w-full mt-4 flex flex-row gap-1 ${className}`}>
            <select name="convocatoria" value={filtros.convocatoria} onChange={handleChange} className="w-48 px-2 py-3 rounded-lg border border-borde bg-superficie shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Convocatoria</option>
                {convocatorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <select name="fecha" value={filtros.fecha} onChange={handleChange} className="w-32 p-3 rounded-lg border border-borde bg-superficie shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Todos">Todos</option>
                <option value="Pendientes">Pendientes</option>
            </select>
        </form>
    );
}
