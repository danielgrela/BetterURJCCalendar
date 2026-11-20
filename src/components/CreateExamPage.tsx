import { useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { NavLink } from 'react-router';
import { IconCalendarPlus, IconCircleCheck, IconExclamationCircle } from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
import useExamenes from '../hooks/useExamenes';
import PageMeta from './PageMeta.tsx';
import ExamCard from './ExamCard';
import { claveExamen, nombreLegible } from '../scripts/examen';
import { sortedEvents } from '../scripts/sortEvents';
import { detectarSolapamientos } from '../scripts/solapamientos';
import { convocatoriasDe } from '../scripts/filtersCalendar';
import {
    CONVOCATORIAS_URJC, asignaturasConocidas, buscarAsignatura, convocatoriaPorFecha, crearExamen,
    errorEnDatos, franjasFrecuentes, masFrecuentes, sumarMinutos, type DatosExamen,
} from '../scripts/examenPropio';
import type { Examen } from '../types/examen';

const CAMPO = 'w-full min-h-11 px-3 rounded-sm border border-borde-fuerte bg-superficie text-texto';
const ETIQUETA = 'text-sm font-medium text-texto';
// Duración por defecto al poner la hora de inicio (la mayoría de exámenes del Excel duran 2 h)
const DURACION_MINUTOS = 120;

interface CampoProps {
    id: string;
    etiqueta: string;
    children: ReactNode;
    ayuda?: string;
}

function Campo({ id, etiqueta, children, ayuda }: CampoProps) {
    return (
        <div className="flex flex-col gap-1.5 min-w-0">
            <label htmlFor={id} className={ETIQUETA}>{etiqueta}</label>
            {children}
            {ayuda && <p className="text-xs text-texto-suave">{ayuda}</p>}
        </div>
    );
}

interface AtajosProps {
    etiqueta: string;
    valores: string[];
    actual: string;
    onElegir: (valor: string) => void;
    mostrar?: (valor: string) => string;
}

// Valores ya usados en el calendario para rellenar un campo de un toque
function Atajos({ etiqueta, valores, actual, onElegir, mostrar = (v) => v }: AtajosProps) {
    if (valores.length === 0) return null;
    return (
        <div role="group" aria-label={etiqueta} className="flex flex-row flex-wrap gap-2">
            {valores.map((valor) => (
                <button key={valor} type="button" onClick={() => onElegir(valor)} aria-pressed={valor === actual}
                    className={`min-h-11 px-3 text-sm text-start font-medium rounded-sm border cursor-pointer transition-colors ${valor === actual ? 'border-primary bg-superficie text-texto' : 'border-borde bg-superficie-alta text-texto hover:border-borde-fuerte'}`}>
                    {mostrar(valor)}
                </button>
            ))}
        </div>
    );
}

// Curso, plan y convocatoria cambian poco entre exámenes: se arranca con los del último creado
// o, si no hay, con los más repetidos del calendario
function datosIniciales(examenes: Examen[], propios: Examen[]): DatosExamen {
    const ultimo = propios.at(-1);
    return {
        asignatura: '',
        fecha: '',
        inicio: '',
        fin: '',
        aula: '',
        convocatoria: ultimo?.Convocatoria ?? '',
        curso: ultimo?.Curso ?? masFrecuentes(examenes.map((ev) => ev.Curso), 1)[0] ?? '',
        plan: ultimo?.Plan ?? masFrecuentes(examenes.map((ev) => ev.Plan), 1)[0] ?? '',
    };
}

export default function CreateExamPage() {
    const id = useId();
    const examenes = useExamenes();
    const propios = useFileStore((state) => state.propios);
    const anadirPropio = useFileStore((state) => state.anadirPropio);

    const [datos, setDatos] = useState<DatosExamen>(() => datosIniciales(examenes, propios));
    // Mientras no se toquen a mano, la hora de fin y la convocatoria se deducen de inicio y fecha
    const [finAMano, setFinAMano] = useState(false);
    const [convocatoriaAMano, setConvocatoriaAMano] = useState(datos.convocatoria !== '');
    const [error, setError] = useState<string | null>(null);
    const [anadido, setAnadido] = useState<string | null>(null);
    const asignaturaRef = useRef<HTMLInputElement>(null);

    const asignaturas = useMemo(() => [...asignaturasConocidas(examenes).values()].map(nombreLegible), [examenes]);
    const cursos = useMemo(() => masFrecuentes(examenes.map((ev) => ev.Curso), 4), [examenes]);
    const planes = useMemo(() => masFrecuentes(examenes.map((ev) => ev.Plan), 2), [examenes]);
    const aulas = useMemo(() => masFrecuentes(examenes.flatMap((ev) => ev.Aula.split(', ')), 30), [examenes]);
    const franjas = useMemo(() => franjasFrecuentes(examenes), [examenes]);
    const convocatorias = useMemo(() => [...new Set([...CONVOCATORIAS_URJC, ...convocatoriasDe(examenes)])], [examenes]);
    const misExamenes = useMemo(() => sortedEvents(propios), [propios]);
    const solapamientos = useMemo(() => detectarSolapamientos(examenes), [examenes]);
    const conocida = datos.asignatura ? buscarAsignatura(examenes, datos.asignatura) : undefined;

    const cambiar = (cambios: Partial<DatosExamen>) => {
        setDatos((previos) => ({ ...previos, ...cambios }));
        setError(null);
        setAnadido(null);
    };

    const handleAsignatura = (e: ChangeEvent<HTMLInputElement>) => {
        const asignatura = e.target.value;
        // Una asignatura que ya está en el calendario trae su curso y su plan
        const encontrada = buscarAsignatura(examenes, asignatura);
        cambiar(encontrada ? { asignatura, curso: encontrada.Curso, plan: encontrada.Plan } : { asignatura });
    };

    const handleFecha = (e: ChangeEvent<HTMLInputElement>) => {
        const fecha = e.target.value;
        cambiar(convocatoriaAMano ? { fecha } : { fecha, convocatoria: convocatoriaPorFecha(fecha) });
    };

    const handleInicio = (e: ChangeEvent<HTMLInputElement>) => {
        const inicio = e.target.value;
        cambiar(finAMano ? { inicio } : { inicio, fin: sumarMinutos(inicio, DURACION_MINUTOS) });
    };

    const elegirFranja = (franja: string) => {
        const [inicio, fin] = franja.split(' - ');
        setFinAMano(false);
        cambiar({ inicio, fin });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const problema = errorEnDatos(datos);
        if (problema) {
            setError(problema);
            return;
        }
        const nuevo = crearExamen(datos, examenes);
        if (examenes.some((ev) => claveExamen(ev) === claveExamen(nuevo))) {
            setError('Ese examen ya está en el calendario (misma asignatura, grupo, fecha y hora).');
            return;
        }
        anadirPropio(nuevo);
        setAnadido(nombreLegible(nuevo));
        // Se dejan curso, plan y convocatoria para añadir el siguiente más rápido
        setDatos((previos) => ({ ...previos, asignatura: '', fecha: '', inicio: '', fin: '', aula: '' }));
        setFinAMano(false);
        setError(null);
        asignaturaRef.current?.focus();
    };

    return (
        <div className="flex flex-col gap-8">
            <PageMeta titulo="Crear examen" noindex />
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Crear examen</h1>
                <p className="text-sm lg:text-base text-texto-suave max-w-prose">Añade exámenes que no estén en el Excel, como un parcial o una recuperación. Se suman a tu calendario, se guardan solo en este navegador y se mantienen aunque importes otro archivo.</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-superficie p-5 lg:p-8 rounded border border-borde shadow-sm dark:shadow-none">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="lg:col-span-2">
                        <Campo id={`${id}-asignatura`} etiqueta="Asignatura" ayuda={conocida ? 'Ya está en tu calendario: se usan su curso y su plan.' : undefined}>
                            <input ref={asignaturaRef} id={`${id}-asignatura`} name="asignatura" type="text" required autoComplete="off" list={`${id}-asignaturas`}
                                value={datos.asignatura} onChange={handleAsignatura} placeholder="Por ejemplo, Bases de datos" className={CAMPO} />
                            <datalist id={`${id}-asignaturas`}>
                                {asignaturas.map((nombre) => <option key={nombre} value={nombre} />)}
                            </datalist>
                        </Campo>
                    </div>

                    <Campo id={`${id}-fecha`} etiqueta="Fecha">
                        <input id={`${id}-fecha`} name="fecha" type="date" required value={datos.fecha} onChange={handleFecha} className={CAMPO} />
                    </Campo>

                    <Campo id={`${id}-convocatoria`} etiqueta="Convocatoria" ayuda={convocatoriaAMano ? undefined : 'Se elige sola según la fecha.'}>
                        <select id={`${id}-convocatoria`} name="convocatoria" value={datos.convocatoria}
                            onChange={(e) => { setConvocatoriaAMano(e.target.value !== ''); cambiar({ convocatoria: e.target.value }); }} className={CAMPO}>
                            <option value="">Según la fecha</option>
                            {convocatorias.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Campo>

                    <fieldset className="lg:col-span-2 flex flex-col gap-3 min-w-0">
                        <legend className={`${ETIQUETA} mb-1.5`}>Hora</legend>
                        <Atajos etiqueta="Franjas habituales" valores={franjas} actual={`${datos.inicio} - ${datos.fin}`} onElegir={elegirFranja} mostrar={(f) => f.replace(' - ', '–')} />
                        <div className="grid grid-cols-2 gap-3 lg:max-w-md">
                            <Campo id={`${id}-inicio`} etiqueta="Empieza">
                                <input id={`${id}-inicio`} name="inicio" type="time" required value={datos.inicio} onChange={handleInicio} className={CAMPO} />
                            </Campo>
                            <Campo id={`${id}-fin`} etiqueta="Termina">
                                <input id={`${id}-fin`} name="fin" type="time" required value={datos.fin}
                                    onChange={(e) => { setFinAMano(true); cambiar({ fin: e.target.value }); }} className={CAMPO} />
                            </Campo>
                        </div>
                    </fieldset>

                    <div className="flex flex-col gap-3 min-w-0">
                        <Campo id={`${id}-curso`} etiqueta="Curso y grupo" ayuda="Como en el Excel: curso/grupo, por ejemplo 3/BT.">
                            <input id={`${id}-curso`} name="curso" type="text" autoComplete="off" value={datos.curso} onChange={(e) => cambiar({ curso: e.target.value })} className={CAMPO} />
                        </Campo>
                        <Atajos etiqueta="Cursos usados" valores={cursos} actual={datos.curso} onElegir={(curso) => cambiar({ curso })} />
                    </div>

                    <Campo id={`${id}-aula`} etiqueta="Aula (opcional)">
                        <input id={`${id}-aula`} name="aula" type="text" autoComplete="off" list={`${id}-aulas`} value={datos.aula} onChange={(e) => cambiar({ aula: e.target.value })} placeholder="Sin asignar" className={CAMPO} />
                        <datalist id={`${id}-aulas`}>
                            {aulas.map((aula) => <option key={aula} value={aula} />)}
                        </datalist>
                    </Campo>

                    <div className="lg:col-span-2 flex flex-col gap-3 min-w-0">
                        <Campo id={`${id}-plan`} etiqueta="Plan de estudios (opcional)">
                            <input id={`${id}-plan`} name="plan" type="text" autoComplete="off" value={datos.plan} onChange={(e) => cambiar({ plan: e.target.value })} className={CAMPO} />
                        </Campo>
                        <Atajos etiqueta="Planes usados" valores={planes} actual={datos.plan} onElegir={(plan) => cambiar({ plan })} />
                    </div>
                </div>

                {error && (
                    <p role="alert" className="flex flex-row gap-2 items-start text-sm text-error font-medium">
                        <IconExclamationCircle size={20} stroke={2} className="min-w-5" aria-hidden="true" />
                        {error}
                    </p>
                )}
                {anadido && (
                    <p role="status" className="flex flex-row flex-wrap gap-x-2 gap-y-1 items-center text-sm text-texto font-medium">
                        <IconCircleCheck size={20} stroke={2} className="min-w-5 text-texto-suave" aria-hidden="true" />
                        Se ha añadido «{anadido}» al calendario.
                        <NavLink to="/dashboard/calendario" className="text-enlace underline underline-offset-2 hover:decoration-2">Ver el calendario</NavLink>
                    </p>
                )}

                <button type="submit" className="lg:self-end min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">
                    <IconCalendarPlus size={20} stroke={2} aria-hidden="true" />
                    Añadir al calendario
                </button>
            </form>

            <section className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">Creados por ti</h2>
                {misExamenes.length === 0
                    ? <p className="text-sm text-texto-suave">Aún no has creado ningún examen.</p>
                    : <div className="flex flex-col gap-4">
                        {misExamenes.map((ev) => (
                            <ExamCard key={claveExamen(ev)} examen={ev} solapamiento={solapamientos.get(claveExamen(ev))} conAcciones />
                        ))}
                    </div>}
                <p className="text-sm text-texto-suave">Los exámenes importados también se pueden eliminar con la papelera de su tarjeta, en Inicio o en el calendario.</p>
            </section>
        </div>
    );
}
