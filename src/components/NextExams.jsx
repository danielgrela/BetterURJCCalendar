import useFileStore from "../hooks/useFileStore";
import parseEventDate, { sortedEvents } from "../scripts/sortEvents";
import { IconCalendar, IconMapPin, IconExclamationCircle } from "@tabler/icons-react";
export default function NextExams() {
    const jsonData = useFileStore((state) => state.jsonData);
    const proximosExamenes = NextExams(sortedEvents(jsonData));
    function NextExams(jsonData) {
        if(!jsonData || jsonData?.length === 0){
            return null;
        }
        else{
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            return jsonData
                .filter((examen) => {
                    const fechaExamen = parseEventDate(examen.Fecha);
                    fechaExamen.setHours(0, 0, 0, 0);
                    return fechaExamen >= hoy;
                })
                .slice(0, 5);
        }
    }
    function sanitizeDate(dateInt){
        switch(dateInt){
            case 0:
                return "Hoy";
            case 1:
                return "Mañana";
        }
        return `Quedan ${dateInt} días`;
    }
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold dark:text-gray-100">Próximos Exámenes</h2>
            {!proximosExamenes ?
                <div className="flex flex-row gap-2 text-primary items-center justify-center">              
                    <IconExclamationCircle className="min-w-fit" stroke={2} />  
                    <h3 className="text-xl font-bold text-center">Aún no hay exámenes</h3>
                </div>
                : 
                <div className="flex flex-col gap-4">
                    {proximosExamenes.map((examen, id) => (
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center w-full shadow-sm border border-gray-200 dark:border-gray-800 border-l-6 p-4 lg:p-8 border-l-primary bg-white dark:bg-gray-950" key={id}>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-4 items-center">
                                    <p className="bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-sm py-px px-3 w-fit font-medium">{examen.Convocatoria}</p>
                                    <p className="text-sm text-primary font-bold">{sanitizeDate(Math.floor((parseEventDate(examen.Fecha).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)))}</p>
                                </div>
                                <h2 className="text-xl font-bold dark:text-gray-100">{examen.Asignatura.split('(')[0].trim()}</h2>
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
                ))}
                </div>
                }
        </section>
    )
}