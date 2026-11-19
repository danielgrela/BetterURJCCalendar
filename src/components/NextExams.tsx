import { useMemo } from "react";
import useFileStore from "../hooks/useFileStore";
import parseEventDate, { sortedEvents } from "../scripts/sortEvents";
import { IconCalendarOff, IconCircleCheck } from "@tabler/icons-react";
import ImportButton from "./ImportButton";
import EmptyState from "./EmptyState";
import ExamCard from "./ExamCard";
import { claveExamen } from "../scripts/examen";
import { detectarSolapamientos } from "../scripts/solapamientos";
import { NavLink } from 'react-router';
import type { Examen } from '../types/examen';
// Los 5 primeros exámenes desde hoy; null si no hay datos importados
function proximosExamenes(examenes: Examen[]): Examen[] | null {
    if(!examenes || examenes?.length === 0){
        return null;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return examenes
        .filter((examen) => parseEventDate(examen.Fecha) >= hoy)
        .slice(0, 5);
}

export default function NextExams() {
    const jsonData = useFileStore((state) => state.jsonData);
    const solapamientos = useMemo(() => detectarSolapamientos(jsonData), [jsonData]);
    const proximos = useMemo(() => proximosExamenes(sortedEvents(jsonData)), [jsonData]);
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Próximos exámenes</h2>
            {!proximos ?
                <EmptyState icono={<IconCalendarOff size={32} stroke={2} />} titulo="Aún no hay exámenes" texto="Importa el Excel de exámenes de la URJC y aquí verás los próximos.">
                    <ImportButton />
                </EmptyState>
                : proximos.length === 0 ?
                // Hay exámenes importados pero ya han pasado todos
                <EmptyState icono={<IconCircleCheck size={32} stroke={2} />} titulo="No te quedan exámenes pendientes" texto="Los que ya han pasado siguen en el calendario.">
                    <NavLink to="/dashboard/calendario" className="min-h-11 inline-flex items-center px-2 font-semibold text-enlace hover:underline">Ver el calendario completo</NavLink>
                </EmptyState>
                : 
                <div className="flex flex-col gap-4">
                    {proximos.map((examen) => (
                        <ExamCard key={claveExamen(examen)} examen={examen} variant="full" solapamiento={solapamientos.get(claveExamen(examen))} />
                ))}
                </div>
                }
        </section>
    )
}