import { IconFileTypeXls } from '@tabler/icons-react';
import { descargarCalendarioExcel } from "../scripts/generateExcel";
import { descargarCalendarioICS } from "../scripts/generateICS";
import { IconCalendarDown } from '@tabler/icons-react';
import useExamenes from "../hooks/useExamenes";

export default function ButtonsExportDashboard({ className = '' }: { className?: string }) {
    const jsonData = useExamenes();
    // Sin datos no hay nada que exportar: el estado vacío de NextExams lleva a Importar
    if (!jsonData || jsonData.length === 0) return null;
    return (
                    <div className={`flex flex-col lg:flex-row lg:items-start gap-3 ${className}`}>
                        <button type="button" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors py-3 whitespace-nowrap" onClick={() => descargarCalendarioExcel(jsonData)}>
                            <IconFileTypeXls size={20} className="min-w-fit" stroke={2} aria-hidden="true" />
                            Exportar a Excel
                        </button>
                        <button type="button" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90 py-3 whitespace-nowrap" onClick={() => descargarCalendarioICS(jsonData)}>
                            <IconCalendarDown size={20} className="min-w-fit" stroke={2} aria-hidden="true" />
                            Exportar a .ics
                        </button>
                    </div>
    );
}