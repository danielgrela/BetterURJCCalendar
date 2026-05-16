import { NavLink } from "react-router-dom";
import { IconCirclePlus } from '@tabler/icons-react';

export default function DashboardHeader() {
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl lg:text-5xl font-bold">Dashboard</h1>
                <p className="text-sm lg:text-base text-neutral">Aquí puedes ver los próximos exámenes y eventos relacionados con tu calendario académico.</p>
            </div>
                <NavLink to="/dashboard/importar" className="text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-primary text-white">
                    <IconCirclePlus className="min-w-fit"  stroke={2} />
                    Nuevo Calendario / Importar Excel
                </NavLink>
            
        </div>
    )
}