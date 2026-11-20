import { useId, useRef, type SyntheticEvent } from 'react';
import { IconCalendarDown, IconFileTypeXls } from '@tabler/icons-react';
import { descargarCalendarioExcel } from "../scripts/generateExcel";
import { descargarCalendarioICS, OPCIONES_AVISO, type Aviso } from "../scripts/generateICS";
import useExamenes from "../hooks/useExamenes";
import usePreferencias from '../hooks/usePreferencias';

export default function ButtonsExportDashboard({ className = '' }: { className?: string }) {
    const jsonData = useExamenes();
    const aviso = usePreferencias((state) => state.aviso);
    const setAviso = usePreferencias((state) => state.setAviso);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const id = useId();
    // El formulario del diálogo devuelve el botón pulsado; Esc o el gesto atrás lo dejan vacío
    const handleCerrar = (e: SyntheticEvent<HTMLDialogElement>) => {
        const dialog = e.currentTarget;
        if (dialog.returnValue === 'descargar') descargarCalendarioICS(jsonData, usePreferencias.getState().aviso);
        dialog.returnValue = '';
    };
    // Sin datos no hay nada que exportar: el estado vacío de NextExams lleva a Importar
    if (!jsonData || jsonData.length === 0) return null;
    return (
                    <div className={`flex flex-col lg:flex-row lg:items-start gap-3 ${className}`}>
                        <button type="button" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors py-3 whitespace-nowrap" onClick={() => descargarCalendarioExcel(jsonData)}>
                            <IconFileTypeXls size={20} className="min-w-fit" stroke={2} aria-hidden="true" />
                            Exportar a Excel
                        </button>
                        <button type="button" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90 py-3 whitespace-nowrap" onClick={() => dialogRef.current?.showModal()}>
                            <IconCalendarDown size={20} className="min-w-fit" stroke={2} aria-hidden="true" />
                            Exportar a .ics
                        </button>
                        <dialog ref={dialogRef} onClose={handleCerrar} aria-labelledby={`${id}-titulo`} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-md bg-superficie text-texto border border-borde p-6 shadow-lg dark:shadow-none overscroll-contain backdrop:bg-black/50 backdrop:overflow-hidden backdrop:overscroll-contain">
                            <h2 id={`${id}-titulo`} className="text-lg font-bold">Exportar a .ics</h2>
                            <form method="dialog" className="mt-4 flex flex-col gap-6">
                                <fieldset className="flex flex-col gap-1">
                                    <legend className="font-semibold">Avisarme antes de cada examen</legend>
                                    <p className="mb-2 text-sm text-texto-suave">Tu app de calendario (Google, Apple, Outlook…) te avisará sola al importar el archivo.</p>
                                    {OPCIONES_AVISO.map(({ valor, texto }) => (
                                        <label key={valor} className="min-h-11 flex items-center gap-3 cursor-pointer">
                                            <input type="radio" name="aviso" value={valor} checked={aviso === valor} onChange={(e) => setAviso(e.target.value as Aviso)} className="size-5" />
                                            {texto}
                                        </label>
                                    ))}
                                </fieldset>
                                <div className="flex flex-col-reverse gap-3 lg:flex-row lg:justify-end">
                                    <button value="cancelar" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-borde-fuerte bg-superficie text-texto cursor-pointer hover:bg-superficie-alta transition-colors">Cancelar</button>
                                    <button value="descargar" autoFocus className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">Descargar .ics</button>
                                </div>
                            </form>
                        </dialog>
                    </div>
    );
}
