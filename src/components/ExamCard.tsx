import { IconAlertTriangle, IconCalendarEvent, IconCircleCheck, IconCircleX, IconClock, IconMapPin } from '@tabler/icons-react';
import usePreferencias from '../hooks/usePreferencias';
import MenuAcciones from './MenuAcciones';
import useAccionesExamen from '../hooks/useAccionesExamen';
import { aulaLegible, claveEstable, diasHasta, fechaLarga, horaInicio, horaLegible, nombreLegible, partesFecha } from '../scripts/examen';
import type { Examen } from '../types/examen';
import type { Solapamiento } from '../scripts/solapamientos';
import type { Estado } from '../scripts/preferencias';

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

// Con texto e icono (no solo color). «No me presento» recuerda que no se exporta
function EtiquetaEstado({ estado }: { estado: Estado }) {
    return estado === 'aprobado'
        ? <p className="flex items-center gap-1.5 text-sm font-semibold text-texto"><IconCircleCheck size={16} stroke={2} className="min-w-fit" aria-hidden="true" />Aprobado</p>
        : <p className="flex items-center gap-1.5 text-sm font-semibold text-texto-suave"><IconCircleX size={16} stroke={2} className="min-w-fit" aria-hidden="true" />No me presento · no se exporta</p>;
}

// Aparte para poder usar el hook solo en las tarjetas que llevan menú
function AccionesExamen({ examen, alAvisar }: { examen: Examen; alAvisar?: () => void }) {
    const acciones = useAccionesExamen(examen, { alAvisar });
    return <MenuAcciones etiqueta={`Acciones de ${nombreLegible(examen)}`} acciones={acciones} className="absolute top-1 right-1 lg:top-2 lg:right-2" />;
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
    /** Solo en "card": menú «⋯» con las acciones del examen (eliminar, etc.) */
    conAcciones?: boolean;
    /** Con conAcciones: se llama tras una acción que muestra un aviso (el detalle del día lo usa para cerrarse) */
    alAvisar?: () => void;
}

export default function ExamCard({ examen, variant = 'card', solapamiento, onSelect, hoy = new Date(), conAcciones = false, alAvisar }: Props) {
    const nombre = nombreLegible(examen);
    // Solo en el dashboard (con menú o detalle): la portada prerenderizada no puede leer un store
    // persistido sin descuadrar la hidratación
    const enDashboard = conAcciones || !!onSelect;
    const estado = usePreferencias((state) => (enDashboard ? state.estados[claveEstable(examen)] : undefined));

    if (variant === 'line') {
        const conflicto = solapamiento?.tipo === 'conflicto';
        const contenido = (
            <>
                <span className="flex items-center gap-1 font-semibold tabular-nums text-texto-suave">
                    {horaInicio(examen.Hora)}
                    {conflicto && <IconAlertTriangle size={12} stroke={2.5} className="text-error" aria-hidden="true" />}
                </span>
                <span className={`line-clamp-2 font-medium ${estado === 'no-presento' ? 'text-texto-suave line-through' : 'text-texto'}`}>
                    {estado === 'aprobado' && <IconCircleCheck size={12} stroke={2.5} className="inline me-0.5 -mt-0.5" aria-hidden="true" />}
                    {nombre}
                </span>
                {conflicto && <span className="sr-only">. {textoSolapamiento(solapamiento)}</span>}
                {estado && <span className="sr-only">. {estado === 'aprobado' ? 'Aprobado' : 'No me presento'}</span>}
            </>
        );
        const clases = 'flex flex-col w-full text-start text-xs leading-snug rounded-sm px-1.5 py-1 bg-superficie-alta';
        return onSelect
            ? <button type="button" onClick={onSelect} className={`${clases} cursor-pointer hover:bg-borde-fuerte transition-colors`}>{contenido}</button>
            : <div className={clases}>{contenido}</div>;
    }

    const dias = diasHasta(examen.Fecha, hoy);
    const pasado = dias < 0;
    // Pasado o «No me presento»: se ve más apagado
    const atenuado = pasado || estado === 'no-presento';
    const { dia, diaSemana, mes } = partesFecha(examen.Fecha);
    return (
        <article className={`relative flex flex-row gap-4 p-4 lg:p-5 rounded-md border border-borde ${atenuado ? 'bg-lienzo' : 'bg-superficie shadow-sm dark:shadow-none'}`}>
            {/* Bloque de fecha como en una agenda; la fecha completa va en texto para lectores de pantalla */}
            <div aria-hidden="true" className={`flex flex-col items-center justify-center shrink-0 w-14 py-2 rounded-sm ${atenuado ? 'border border-borde' : 'bg-superficie-alta'}`}>
                <span className="text-xs font-medium text-texto-suave">{diaSemana}</span>
                <span className={`text-2xl font-bold leading-tight tabular-nums ${atenuado ? 'text-texto-suave' : 'text-texto'}`}>{dia}</span>
                <span className="text-xs font-medium text-texto-suave">{mes}</span>
            </div>
            <div className={`flex flex-col gap-1 min-w-0 ${conAcciones ? 'pe-10' : ''}`}>
                <h3 className={`text-base lg:text-lg font-bold leading-snug ${atenuado ? 'text-texto-suave' : 'text-texto'}`}>
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
                    <span className={atenuado ? '' : 'font-semibold text-primary'}>{textoDias(dias)}</span>
                </p>
                <p className="text-sm text-texto-suave">{examen.Plan}</p>
                {estado && <EtiquetaEstado estado={estado} />}
                {solapamiento && <AvisoSolapamiento solapamiento={solapamiento} />}
            </div>
            {conAcciones && <AccionesExamen examen={examen} alAvisar={alAvisar} />}
        </article>
    );
}
