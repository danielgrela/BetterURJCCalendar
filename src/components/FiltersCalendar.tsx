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
        <form onSubmit={(e) => e.preventDefault()} className={`w-full grid grid-cols-2 gap-3 lg:flex lg:flex-row ${className}`}>
            <div className="flex flex-col gap-1 min-w-0">
                <label htmlFor={`${id}-convocatoria`} className="text-sm font-medium text-texto-suave">Convocatoria</label>
                <select id={`${id}-convocatoria`} name="convocatoria" value={filtros.convocatoria} onChange={handleChange} className="w-full lg:w-48 min-h-11 px-3 rounded-sm border border-borde-fuerte bg-superficie shadow-sm dark:shadow-none">
                    <option value="">Todas</option>
                    {convocatorias.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
                <label htmlFor={`${id}-fecha`} className="text-sm font-medium text-texto-suave">Mostrar</label>
                <select id={`${id}-fecha`} name="fecha" value={filtros.fecha} onChange={handleChange} className="w-full lg:w-48 min-h-11 px-3 rounded-sm border border-borde-fuerte bg-superficie shadow-sm dark:shadow-none">
                    <option value="Todos">Todos</option>
                    <option value="Pendientes">Solo pendientes</option>
                </select>
            </div>
        </form>
    );
}
