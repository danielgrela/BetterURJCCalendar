import { useId, type ChangeEvent } from 'react';
import { IconSearch } from '@tabler/icons-react';
import type { FiltrosCalendario } from '../types/examen';
import AvisoOcultos from './AvisoOcultos';

export interface FiltersCalendarProps {
    filtros: FiltrosCalendario;
    setFiltros: (filtros: FiltrosCalendario) => void;
    convocatorias: string[];
    /** Exámenes que no se ven por los ajustes de asignaturas */
    ocultos?: number;
    className?: string;
}

export default function FiltersCalendar({ filtros, setFiltros, convocatorias, ocultos = 0, className = '' }: FiltersCalendarProps) {
    const id = useId();
    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
    return (
        <form role="search" onSubmit={(e) => e.preventDefault()} className={`w-full grid grid-cols-2 gap-3 lg:flex lg:flex-row lg:flex-wrap lg:items-end ${className}`}>
            <div className="col-span-2 flex flex-col gap-1 min-w-0">
                <label htmlFor={`${id}-texto`} className="text-sm font-medium text-texto-suave">Buscar asignatura</label>
                <div className="relative">
                    <IconSearch size={18} stroke={2} className="absolute start-3 top-1/2 -translate-y-1/2 text-texto-suave pointer-events-none" aria-hidden="true" />
                    <input id={`${id}-texto`} type="search" name="texto" value={filtros.texto} onChange={handleChange} placeholder="Nombre o código" autoComplete="off" enterKeyHint="search" className="w-full lg:w-64 min-h-11 ps-10 pe-3 rounded-sm border border-borde-fuerte bg-superficie text-texto placeholder:text-texto-suave shadow-sm dark:shadow-none" />
                </div>
            </div>
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
            <AvisoOcultos ocultos={ocultos} className="col-span-2 lg:w-full" />
        </form>
    );
}
