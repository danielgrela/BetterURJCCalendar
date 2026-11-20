import { useRef, useState } from 'react';
import { IconAlertTriangle, IconCalendarEvent, IconClock, IconMapPin, IconTrash } from '@tabler/icons-react';
import { aulaLegible, diasHasta, fechaLarga, horaInicio, horaLegible, nombreLegible, partesFecha } from '../scripts/examen';
import type { Examen } from '../types/examen';
import type { Solapamiento } from '../scripts/solapamientos';

function textoDias(dias: number) {
    if (dias < 0) return 'Ya pasó';
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Mañana';
    return `Quedan ${dias} días`;
}

function textoSolapamiento({ tipo, con }: Solapamiento) {
    const otros = con.map((ev) => `${nombreLegible(ev)} (${horaLegible(ev.Hora)})`).join(', ');
    return tipo === 'conflicto' ? `Se solapa con ${otros}` : `Mismo día que ${otros}`;
}

// Aviso con texto (no solo color): conflicto de horas en color de error, mismo día en gris
function AvisoSolapamiento({ solapamiento }: { solapamiento: Solapamiento }) {
    const conflicto = solapamiento.tipo === 'conflicto';
    const Icono = conflicto ? IconAlertTriangle : IconCalendarEvent;
    return (
        <p className={`flex items-start gap-1.5 text-sm font-semibold ${conflicto ? 'text-error' : 'text-texto-suave'}`}>
            <Icono size={16} stroke={2} className="min-w-fit mt-0.5" aria-hidden="true" />
            <span>{textoSolapamiento(solapamiento)}</span>
        </p>
    );
}

interface Props {
    examen: Examen;
    /** "card": tarjeta completa (Próximos exámenes, lista móvil, detalle del día) · "line": línea de la rejilla */
    variant?: 'card' | 'line';
    /** Si coincide con otro examen ese día (detectarSolapamientos) */
    solapamiento?: Solapamiento;
    /** Solo en "line": abre el detalle del día. Sin él la línea no es interactiva (mockup de la portada) */
    onSelect?: () => void;
    /** Para calcular «Quedan N días» y atenuar los pasados */
    hoy?: Date;
    /** Solo en "card": muestra la papelera y, tras confirmar, lo llama */
    onEliminar?: () => void;
}

export default function ExamCard({ examen, variant = 'card', solapamiento, onSelect, hoy = new Date(), onEliminar }: Props) {
    const nombre = nombreLegible(examen);
    const [confirmando, setConfirmando] = useState(false);
    const papeleraRef = useRef<HTMLButtonElement>(null);
    // Al cancelar, el foco vuelve a la papelera (que se había ocultado) y no se pierde en el documento
    const cancelar = () => {
        setConfirmando(false);
        requestAnimationFrame(() => papeleraRef.current?.focus());
    };

    if (variant === 'line') {
        const conflicto = solapamiento?.tipo === 'conflicto';
        const contenido = (
            <>
                <span className="flex items-center gap-1 font-semibold tabular-nums text-texto-suave">
                    {horaInicio(examen.Hora)}
                    {conflicto && <IconAlertTriangle size={12} stroke={2.5} className="text-error" aria-hidden="true" />}
                </span>
                <span className="line-clamp-2 font-medium text-texto">{nombre}</span>
                {conflicto && <span className="sr-only">. {textoSolapamiento(solapamiento)}</span>}
            </>
        );
        const clases = 'flex flex-col w-full text-start text-xs leading-snug rounded-sm px-1.5 py-1 bg-superficie-alta';
        return onSelect
            ? <button type="button" onClick={onSelect} className={`${clases} cursor-pointer hover:bg-borde-fuerte transition-colors`}>{contenido}</button>
            : <div className={clases}>{contenido}</div>;
    }

    const dias = diasHasta(examen.Fecha, hoy);
    const pasado = dias < 0;
    const { dia, diaSemana, mes } = partesFecha(examen.Fecha);
    return (
        <article className={`relative flex flex-row gap-4 p-4 lg:p-5 rounded-md border border-borde ${pasado ? 'bg-lienzo' : 'bg-superficie shadow-sm dark:shadow-none'}`}>
            {/* Bloque de fecha como en una agenda; la fecha completa va en texto para lectores de pantalla */}
            <div aria-hidden="true" className={`flex flex-col items-center justify-center shrink-0 w-14 py-2 rounded-sm ${pasado ? 'border border-borde' : 'bg-superficie-alta'}`}>
                <span className="text-xs font-medium text-texto-suave">{diaSemana}</span>
                <span className={`text-2xl font-bold leading-tight tabular-nums ${pasado ? 'text-texto-suave' : 'text-texto'}`}>{dia}</span>
                <span className="text-xs font-medium text-texto-suave">{mes}</span>
            </div>
            <div className={`flex flex-col gap-1 min-w-0 ${onEliminar ? 'pe-10' : ''}`}>
                <h3 className={`text-base lg:text-lg font-bold leading-snug ${pasado ? 'text-texto-suave' : 'text-texto'}`}>
                    {nombre}
                    <span className="sr-only">, {fechaLarga(examen.Fecha)}</span>
                </h3>
                <p className="flex flex-row flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-texto">
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <IconClock size={16} stroke={2} className="min-w-fit text-texto-suave" aria-hidden="true" />
                        {horaLegible(examen.Hora)}
                    </span>
                    <span className="inline-flex items-start gap-1.5">
                        <IconMapPin size={16} stroke={2} className="min-w-fit mt-0.5 text-texto-suave" aria-hidden="true" />
                        {aulaLegible(examen.Aula)}
                    </span>
                </p>
                <p className="text-sm text-texto-suave">
                    {examen.Convocatoria}
                    {' · '}
                    <span className={pasado ? '' : 'font-semibold text-primary'}>{textoDias(dias)}</span>
                </p>
                <p className="text-sm text-texto-suave">{examen.Plan}</p>
                {solapamiento && <AvisoSolapamiento solapamiento={solapamiento} />}
                {onEliminar && confirmando && (
                    <div className="mt-2 pt-3 border-t border-borde flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <p className="text-sm font-medium text-texto">¿Eliminar este examen del calendario?</p>
                        <div className="flex flex-row gap-2">
                            <button type="button" onClick={onEliminar} className="min-h-11 inline-flex items-center justify-center gap-2 px-4 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">Eliminar</button>
                            <button type="button" onClick={cancelar} autoFocus className="min-h-11 inline-flex items-center justify-center gap-2 px-4 font-medium border border-borde-fuerte bg-superficie text-texto cursor-pointer hover:bg-superficie-alta transition-colors">Cancelar</button>
                        </div>
                    </div>
                )}
            </div>
            {onEliminar && !confirmando && (
                <button ref={papeleraRef} type="button" onClick={() => setConfirmando(true)} aria-label={`Eliminar ${nombre}`} title="Eliminar examen" className="absolute top-1 right-1 lg:top-2 lg:right-2 size-11 flex items-center justify-center rounded-sm text-texto-suave cursor-pointer hover:bg-superficie-alta hover:text-error transition-colors">
                    <IconTrash size={20} stroke={2} aria-hidden="true" />
                </button>
            )}
        </article>
    );
}
