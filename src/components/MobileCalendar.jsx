import { 
    IconClock,
    IconSchool, IconMapPin
} from '@tabler/icons-react';
import FiltersCalendar from './FiltersCalendar';
import { useFileStoreJsonFilters } from '../hooks/useFileStore';
export default function MobileCalendar({ jsonData, year, month }) {
    const dataFiltered = useFileStoreJsonFilters((state) => state.dataFiltered);
    const visibleData = dataFiltered ?? jsonData;
    return (
        <div className="flex flex-col gap-6 max-h-full px-4">
            <header className="flex flex-col mx-auto h-fit items-start justify-between mb-4 w-full">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    Mis Exámenes
                </h1>
                <FiltersCalendar sortedEvents={jsonData} />
            </header>
            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pb-2">
                {Array.isArray(visibleData) && visibleData.length > 0 ? (visibleData.map((ev, idx) => (
                    <div 
                        key={idx}
                        className="flex flex-col gap-2 group relative p-5 border-l-5 border-primary text-primary rounded-md shadow-sm">
                        <div className='flex flex-row justify-between items-center'>
                            <div className='bg-gray-200 rounded-sm py-1 px-4'>
                                    <span>{ev.Convocatoria}</span>
                            </div>
                            <div className='flex flex-col w-1/2 items-end'>
                                <div className="flex items-center gap-1 text-lg font-bold text-primary">
                                    <IconClock size={15} className='min-w-fit' />
                                    <span>{ev.Hora}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-primary">
                                    <span>{ev.Fecha}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-0.5 overflow-hidden">
                            <IconSchool size={22} className="text-primary min-w-fit" />
                            <p className="text-lg font-bold leading-tight truncate uppercase">
                                {ev.Asignatura.split('(')[0].trim()}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-tertiary font-medium">
                            <span className='line-clamp-2'>{ev.Plan}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-tertiary font-medium">
                            <IconMapPin size={16} className='min-w-fit'/>
                            <span>{ev.Aula}</span>
                        </div>
                    </div> 
                    )))
                    : <p className='font-medium text-center'>No hay nada aquí. Si crees que es un error recarga la página o asegurate de haber importado tus exámenes</p>
                }
            </div>
        </div>
    )
}