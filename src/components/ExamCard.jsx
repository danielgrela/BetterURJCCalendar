import { IconCalendar, IconClock, IconMapPin, IconSchool } from '@tabler/icons-react';
import { nombreAsignatura, diasHasta } from '../scripts/examen';

function textoDias(dias) {
    switch (dias) {
        case 0:
            return 'Hoy';
        case 1:
            return 'Mañana';
    }
    return `Quedan ${dias} días`;
}

// variant: "full" (Próximos exámenes), "list" (calendario móvil), "compact" (celda de la rejilla)
export default function ExamCard({ examen, variant = 'full' }) {
    if (variant === 'compact') {
        return (
            <div className="group relative p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border-l-[3px] border-primary text-primary shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-0.5">
                    <IconSchool size={10} className="text-tertiary" />
                    <p className="text-[10px] font-bold leading-tight truncate uppercase">
                        {nombreAsignatura(examen)}
                    </p>
                </div>
                
                <div className="flex items-center gap-1 text-[9px] text-tertiary font-medium">
                    <IconClock size={10} className="min-w-fit" />
                    <span>{examen.Hora}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-tertiary font-medium">
                    <IconMapPin size={10} className='min-w-fit'/>
                    <span>{examen.Aula}</span>
                </div>
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className="flex flex-col gap-2 group relative p-5 border-l-5 border-primary text-primary rounded-md shadow-sm bg-white dark:bg-gray-950">
                <div className='flex flex-row justify-between items-center'>
                    <div className='bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-sm py-1 px-4'>
                            <span>{examen.Convocatoria}</span>
                    </div>
                    <div className='flex flex-col w-1/2 items-end'>
                        <div className="flex items-center gap-1 text-lg font-bold text-primary">
                            <IconClock size={15} className='min-w-fit' />
                            <span>{examen.Hora}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-primary">
                            <span>{examen.Fecha}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-0.5 overflow-hidden">
                    <IconSchool size={22} className="text-primary min-w-fit" />
                    <p className="text-lg font-bold leading-tight truncate uppercase">
                        {nombreAsignatura(examen)}
                    </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-tertiary font-medium">
                    <span className='line-clamp-2'>{examen.Plan}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-tertiary font-medium">
                    <IconMapPin size={16} className='min-w-fit'/>
                    <span>{examen.Aula}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full shadow-sm border border-gray-200 dark:border-gray-800 border-l-6 p-4 lg:p-8 border-l-primary dark:border-l-primary bg-white dark:bg-gray-950">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-4 items-center">
                    <p className="bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-sm py-px px-3 w-fit font-medium">{examen.Convocatoria}</p>
                    <p className="text-sm text-primary font-bold">{textoDias(diasHasta(examen.Fecha))}</p>
                </div>
                <h3 className="text-xl font-bold dark:text-gray-100">{nombreAsignatura(examen)}</h3>
                <p className="text-sm font-medium dark:text-gray-300">{examen.Plan}</p>
            </div>
            <div className="flex flex-col gap-2 w-full lg:items-end">
                <div className="flex flex-row items-center gap-2">
                    <IconCalendar />
                    <p>{examen.Fecha},</p>
                    <p>{examen.Hora}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <IconMapPin />
                    <p>{examen.Aula}</p>
                </div>
            </div>
        </div>
    );
}
