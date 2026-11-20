import { useMemo } from "react";
import useExamenes from "../hooks/useExamenes";
import { useExamenesVisibles } from "../hooks/useExamenesVisibles";
import AvisoOcultos from "./AvisoOcultos";
import parseEventDate, { sortedEvents } from "../scripts/sortEvents";
import { IconCalendarOff, IconCircleCheck } from "@tabler/icons-react";
import ImportButton from "./ImportButton";
import CreateExamLink from "./CreateExamLink";
import EmptyState from "./EmptyState";
import ExamCard from "./ExamCard";
import { claveExamen } from "../scripts/examen";
import { detectarSolapamientos } from "../scripts/solapamientos";
import { NavLink } from 'react-router';
import type { Examen } from '../types/examen';
// Los 5 primeros exámenes desde hoy
function proximosExamenes(examenes: Examen[]): Examen[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return examenes
        .filter((examen) => parseEventDate(examen.Fecha) >= hoy)
        .slice(0, 5);
}

export default function NextExams() {
    const hayExamenes = useExamenes().length > 0;
    // Solapamientos sobre lo visible: una asignatura oculta o de otro grupo no choca con nada
    const { visibles, ocultos } = useExamenesVisibles();
    const solapamientos = useMemo(() => detectarSolapamientos(visibles), [visibles]);
    const proximos = useMemo(() => proximosExamenes(sortedEvents(visibles)), [visibles]);
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Próximos exámenes</h2>
            <AvisoOcultos ocultos={ocultos} />
            {!hayExamenes ?
                <EmptyState icono={<IconCalendarOff size={32} stroke={2} />} titulo="Aún no hay exámenes" texto="Importa el Excel de exámenes de la URJC o añade los tuyos a mano, y aquí verás los próximos.">
                    <ImportButton />
                    <CreateExamLink />
                </EmptyState>
                : proximos.length === 0 ?
                // Hay exámenes importados pero ya han pasado todos
                <EmptyState icono={<IconCircleCheck size={32} stroke={2} />} titulo="No te quedan exámenes pendientes" texto="Los que ya han pasado siguen en el calendario.">
                    <NavLink to="/dashboard/calendario" className="min-h-11 inline-flex items-center px-2 font-semibold text-enlace hover:underline">Ver el calendario completo</NavLink>
                </EmptyState>
                : 
                <div className="flex flex-col gap-4">
                    {proximos.map((examen) => (
                        <ExamCard key={claveExamen(examen)} examen={examen} solapamiento={solapamientos.get(claveExamen(examen))} conAcciones />
                ))}
                </div>
                }
        </section>
    )
}