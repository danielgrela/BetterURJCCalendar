import { useMemo } from 'react';
import { useExamenesExportables } from '../hooks/useExamenesVisibles';
import { cargaEstudio } from '../scripts/cargaEstudio';
import { claveExamen, fechaCorta, nombreLegible } from '../scripts/examen';
import Desplegable from './Desplegable';

const DIA_MES = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });

// "18 may – 24 may" (o "18–24 may" si es el mismo mes), sin el punto de la abreviatura
function textoSemana(lunes: Date): string {
    const domingo = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + 6);
    const [inicio, fin] = [lunes, domingo].map((d) => DIA_MES.format(d).replace('.', ''));
    return lunes.getMonth() === domingo.getMonth() ? `${lunes.getDate()}–${fin}` : `${inicio} – ${fin}`;
}

function textoDias(dias: number, primero: boolean): string {
    if (dias === 0) return primero ? 'Es hoy' : 'El mismo día que el anterior';
    if (dias === 1) return primero ? 'Mañana' : '1 día después del anterior';
    return primero ? `${dias} días desde hoy` : `${dias} días después del anterior`;
}

// Desplegable de Inicio: el margen para preparar cada examen pendiente y la semana más cargada.
// Cuenta solo lo que vas a hacer (sin ocultos, aprobados ni «No me presento»)
export default function PanelCargaEstudio() {
    const examenes = useExamenesExportables();
    const { preparacion, semanaMasCargada } = useMemo(() => cargaEstudio(examenes), [examenes]);
    if (preparacion.length === 0) return null;

    const resumen = [
        preparacion.length === 1 ? '1 examen pendiente' : `${preparacion.length} exámenes pendientes`,
        semanaMasCargada && `semana más cargada: ${textoSemana(semanaMasCargada.lunes)} (${semanaMasCargada.examenes.length})`,
    ].filter(Boolean).join(' · ');

    return (
        <Desplegable id="carga" titulo="Carga de estudio" resumen={resumen}>
            {semanaMasCargada && (
                <p className="text-sm text-texto">
                    <span className="font-semibold">La semana del {textoSemana(semanaMasCargada.lunes)}</span> tienes {semanaMasCargada.examenes.length} exámenes: {semanaMasCargada.examenes.map(nombreLegible).join(', ')}.
                </p>
            )}
            <ol className="mt-3 flex flex-col">
                {preparacion.map(({ examen, dias, anterior }) => {
                    // Con un día o menos de margen se marca en color de error (con texto, no solo color)
                    const justo = !!anterior && dias <= 1;
                    return (
                        <li key={claveExamen(examen)} className="flex flex-col gap-0.5 py-2 border-t border-borde first:border-t-0 lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
                            <span className="font-medium text-texto">{nombreLegible(examen)} <span className="text-sm font-normal text-texto-suave">· {fechaCorta(examen.Fecha)}</span></span>
                            <span className={`text-sm ${justo ? 'font-semibold text-error' : 'text-texto-suave'}`}>
                                {textoDias(dias, !anterior)}{justo && ': poco margen'}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </Desplegable>
    );
}
