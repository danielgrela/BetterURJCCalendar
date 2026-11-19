import { IconAlertTriangle, IconCalendar, IconCalendarEvent, IconClock, IconMapPin, IconSchool } from '@tabler/icons-react';
import { nombreAsignatura, diasHasta } from '../scripts/examen';
import type { Examen } from '../types/examen';
import type { Solapamiento } from '../scripts/solapamientos';

function textoDias(dias: number) {
    switch (dias) {
        case 0:
            return 'Hoy';
        case 1:
            return 'Mañana';
    }
    return `Quedan ${dias} días`;
}

function textoSolapamiento({ tipo, con }: Solapamiento) {
    const otros = con.map((ev) => `${nombreAsignatura(ev)} (${ev.Hora})`).join(', ');
    return tipo === 'conflicto' ? `Se solapa con ${otros}` : `Mismo día que ${otros}`;
}

// Aviso con texto (no solo color): conflicto de horas en color de error, mismo día en gris
function AvisoSolapamiento({ solapamiento, corto = false }: { solapamiento: Solapamiento, corto?: boolean }) {
    const conflicto = solapamiento.tipo === 'conflicto';
    const Icono = conflicto ? IconAlertTriangle : IconCalendarEvent;
    const texto = textoSolapamiento(solapamiento);
    return (
        <p title={corto ? texto : undefined} className={`flex items-start gap-1 font-semibold ${corto ? 'text-[10px]' : 'text-sm'} ${conflicto ? 'text-error' : 'text-texto-suave'}`}>
            <Icono size={corto ? 10 : 16} stroke={2} className="min-w-fit mt-px" aria-hidden="true" />
            {corto ? <><span aria-hidden="true">{conflicto ? 'Se solapa' : 'Mismo día'}</span><span className="sr-only">{texto}</span></> : <span>{texto}</span>}
        </p>
    );
}

interface Props {
    examen: Examen;
    /** "full" (Próximos exámenes), "list" (calendario móvil), "compact" (celda de la rejilla) */
    variant?: 'full' | 'list' | 'compact';
    /** Si coincide con otro examen ese día (detectarSolapamientos) */
    solapamiento?: Solapamiento;
}

export default function ExamCard({ examen, variant = 'full', solapamiento }: Props) {
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
                {solapamiento && <AvisoSolapamiento solapamiento={solapamiento} corto />}
            </div>
        );
    }

    if (variant === 'list') {
        return (
            <div className="flex flex-col gap-2 group relative p-5 border border-borde border-l-5 border-l-primary text-primary rounded-md shadow-sm dark:shadow-none bg-superficie">
                <div className='flex flex-row justify-between items-center'>
                    <div className='bg-superficie-alta rounded-sm py-1 px-4'>
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
                {solapamiento && <AvisoSolapamiento solapamiento={solapamiento} />}
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full shadow-sm dark:shadow-none border border-borde border-l-6 p-4 lg:p-8 border-l-primary bg-superficie">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-4 items-center">
                    <p className="bg-superficie-alta rounded-sm py-px px-3 w-fit font-medium">{examen.Convocatoria}</p>
                    <p className="text-sm text-primary font-bold">{textoDias(diasHasta(examen.Fecha))}</p>
                </div>
                <h3 className="text-xl font-bold">{nombreAsignatura(examen)}</h3>
                <p className="text-sm font-medium text-texto-suave">{examen.Plan}</p>
                {solapamiento && <AvisoSolapamiento solapamiento={solapamiento} />}
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
