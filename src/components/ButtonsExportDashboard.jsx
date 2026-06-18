import { NavLink } from "react-router-dom";
import { IconFileTypeXls } from '@tabler/icons-react';
import { descargarCalendarioExcel } from "../scripts/generateExcel";
import { descargarCalendarioICS } from "../scripts/generateICS";
import { IconCalendarDown } from '@tabler/icons-react';
import { IconCirclePlus } from '@tabler/icons-react';
import useFileStore from "../hooks/useFileStore";

export default function ButtonsExportDashboard({ className }) {
    const jsonData = useFileStore((state) => state.jsonData);
    return (
        <>
            {jsonData && jsonData.length > 0 ?
                    <div className={`flex flex-col lg:flex-row gap-2 lg:gap-4 ${className}`}>
                        <button className="cursor-pointer text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-white  border-2 border-primary lg:border-0 lg:bg-gray-200 text-primary font-bold" onClick={() => descargarCalendarioExcel(jsonData)}>
                            <IconFileTypeXls className="min-w-fit" stroke={2} />
                            Exportar a Excel
                        </button>
                        <button className="cursor-pointer text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-primary text-white font-bold" onClick={() => descargarCalendarioICS(jsonData)}>
                            <IconCalendarDown className="min-w-fit" stroke={2} />
                            Exportar a .ics
                        </button>
                    </div>
                    : 
                    <NavLink to="/dashboard/importar" className={`text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-primary text-white ${className}`}>
                        <IconCirclePlus className="min-w-fit"  stroke={2} />
                        Nuevo Calendario / Importar Excel
                    </NavLink>
            }
        </>
    );
}