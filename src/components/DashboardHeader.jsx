import { NavLink } from "react-router-dom";
import { IconCirclePlus } from '@tabler/icons-react';
import { descargarCalendarioICS } from "../scripts/generateICS";
import useFileStore from "../hooks/useFileStore";

export default function DashboardHeader() {
    const jsonData = useFileStore((state) => state.jsonData);
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl lg:text-5xl font-bold dark:text-gray-100">Dashboard</h1>
                <p className="text-sm lg:text-base text-neutral dark:text-gray-400">Aquí puedes ver los próximos exámenes y eventos relacionados con tu calendario académico.</p>
            </div>
            {jsonData && jsonData.length > 0 ?
                <button className="cursor-pointer text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-primary text-white" onClick={() => descargarCalendarioICS(jsonData)}>
                    <IconCirclePlus className="min-w-fit"  stroke={2} />
                    Exportar a .ics
                </button>
                : 
                <NavLink to="/dashboard/importar" className="text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-primary text-white">
                    <IconCirclePlus className="min-w-fit"  stroke={2} />
                    Nuevo Calendario / Importar Excel
                </NavLink>}
            
        </div>
    )
}