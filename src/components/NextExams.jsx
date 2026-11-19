import { useMemo } from "react";
import useFileStore from "../hooks/useFileStore";
import parseEventDate, { sortedEvents } from "../scripts/sortEvents";
import { IconExclamationCircle, IconCircleCheck } from "@tabler/icons-react";
import ExamCard from "./ExamCard";
import { claveExamen } from "../scripts/examen";
import { NavLink } from 'react-router';
// Los 5 primeros exámenes desde hoy; null si no hay datos importados
function proximosExamenes(examenes) {
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
    const proximos = useMemo(() => proximosExamenes(sortedEvents(jsonData)), [jsonData]);
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold dark:text-gray-100">Próximos Exámenes</h2>
            {!proximos ?
                <div className="flex flex-row gap-2 text-primary items-center justify-center">              
                    <IconExclamationCircle className="min-w-fit" stroke={2} />  
                    <h3 className="text-xl font-bold text-center">Aún no hay exámenes</h3>
                </div>
                : proximos.length === 0 ?
                // Hay exámenes importados pero ya han pasado todos
                <div className="flex flex-col gap-2 items-center text-center py-6">
                    <div className="flex flex-col lg:flex-row gap-2 items-center text-secundario dark:text-gray-100">
                        <IconCircleCheck className="min-w-fit text-primary" stroke={2} />
                        <h3 className="text-xl font-bold">No te quedan exámenes pendientes</h3>
                    </div>
                    <NavLink to="/dashboard/calendario" className="min-h-11 inline-flex items-center px-2 font-semibold text-primary hover:underline">Ver el calendario completo</NavLink>
                </div>
                : 
                <div className="flex flex-col gap-4">
                    {proximos.map((examen) => (
                        <ExamCard key={claveExamen(examen)} examen={examen} variant="full" />
                ))}
                </div>
                }
        </section>
    )
}