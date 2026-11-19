import { IconFileTypeXls } from '@tabler/icons-react';
import { descargarCalendarioExcel } from "../scripts/generateExcel";
import { descargarCalendarioICS } from "../scripts/generateICS";
import { IconCalendarDown } from '@tabler/icons-react';
import useFileStore from "../hooks/useFileStore";

export default function ButtonsExportDashboard({ className = '' }: { className?: string }) {
    const jsonData = useFileStore((state) => state.jsonData);
    // Sin datos no hay nada que exportar: el estado vacío de NextExams lleva a Importar
    if (!jsonData || jsonData.length === 0) return null;
    return (
                    <div className={`flex flex-col lg:flex-row gap-2 lg:gap-4 ${className}`}>
                        <button className="cursor-pointer text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-superficie border-2 border-primary text-primary font-bold" onClick={() => descargarCalendarioExcel(jsonData)}>
                            <IconFileTypeXls className="min-w-fit" stroke={2} />
                            Exportar a Excel
                        </button>
                        <button className="cursor-pointer text-sm flex flex-row gap-2 px-6 py-4 items-center h-fit hover:brightness-80 bg-primary text-sobre-primary font-bold" onClick={() => descargarCalendarioICS(jsonData)}>
                            <IconCalendarDown className="min-w-fit" stroke={2} />
                            Exportar a .ics
                        </button>
                    </div>
    );
}