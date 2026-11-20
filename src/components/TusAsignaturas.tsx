import { useId, useMemo } from 'react';
import useExamenes from '../hooks/useExamenes';
import usePreferencias from '../hooks/usePreferencias';
import { asignaturasDe } from '../scripts/preferencias';
import Desplegable from './Desplegable';

// Desplegable de Inicio: mostrar u ocultar cada asignatura y, si viene en varios grupos, elegir el tuyo
export default function TusAsignaturas() {
    const id = useId();
    const examenes = useExamenes();
    const asignaturas = useMemo(() => asignaturasDe(examenes), [examenes]);
    const ocultas = usePreferencias((state) => state.ocultas);
    const grupos = usePreferencias((state) => state.grupos);
    const setOculta = usePreferencias((state) => state.setOculta);
    const setGrupo = usePreferencias((state) => state.setGrupo);
    if (asignaturas.length === 0) return null;

    const nOcultas = asignaturas.filter((a) => ocultas.includes(a.clave)).length;
    const resumen = `${asignaturas.length} ${asignaturas.length === 1 ? 'asignatura' : 'asignaturas'}${nOcultas > 0 ? ` · ${nOcultas} ${nOcultas === 1 ? 'oculta' : 'ocultas'}` : ''}`;
    return (
        <Desplegable id="asignaturas" titulo="Tus asignaturas" resumen={resumen}>
            <p className="text-sm text-texto-suave">Desmarca las que no quieras ver. Lo oculto no aparece en el calendario ni se exporta, y no cuenta para los solapamientos.</p>
            <ul className="mt-2 flex flex-col">
                {asignaturas.map((asignatura) => {
                    const visible = !ocultas.includes(asignatura.clave);
                    const idGrupo = `${id}-${asignatura.clave}-grupo`;
                    return (
                        <li key={asignatura.clave} className="flex flex-col gap-2 py-2 border-t border-borde first:border-t-0 lg:flex-row lg:items-center lg:justify-between">
                            <label className="min-h-11 flex flex-row items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={visible} onChange={(e) => setOculta(asignatura.clave, !e.target.checked)} className="size-5 shrink-0" />
                                <span className={`font-medium ${visible ? 'text-texto' : 'text-texto-suave line-through'}`}>{asignatura.nombre}</span>
                                <span className="text-sm text-texto-suave whitespace-nowrap">{asignatura.examenes.length === 1 ? '1 examen' : `${asignatura.examenes.length} exámenes`}</span>
                            </label>
                            {asignatura.grupos.length > 1 && (
                                <div className="flex flex-row items-center gap-2 ps-8 lg:ps-0">
                                    <label htmlFor={idGrupo} className="text-sm font-medium text-texto-suave">Tu grupo</label>
                                    <select id={idGrupo} value={grupos[asignatura.clave] ?? ''} onChange={(e) => setGrupo(asignatura.clave, e.target.value || null)} disabled={!visible}
                                        className="min-h-11 px-3 rounded-sm border border-borde-fuerte bg-superficie text-texto disabled:text-texto-suave">
                                        <option value="">Todos</option>
                                        {asignatura.grupos.map((grupo) => <option key={grupo} value={grupo}>{grupo}</option>)}
                                    </select>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </Desplegable>
    );
}
