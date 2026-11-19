import { IconFileUpload, IconInfoCircle, IconExclamationCircle, IconHelpCircle, IconTrash } from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, MouseEvent, SyntheticEvent } from 'react';
import type { Examen } from '../types/examen';
import excelToJson from '../scripts/handleExcel';
import { NavLink, useNavigate } from 'react-router';
import PageMeta from './PageMeta.tsx';
export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [jsonAuxData, setJsonAuxData] = useState<Examen[] | null>(null);
    const [disabled, setDisabled] = useState(true);
    const [dragging, setDragging] = useState(false);
    const setJsonData = useFileStore((state) => state.setJsonData);
    const jsonDataState = useFileStore((state) => state.jsonData);
    const clearJsonData = useFileStore((state) => state.clearJsonData);
    const [borrado, setBorrado] = useState(false);
    const dialogBorrarRef = useRef<HTMLDialogElement>(null);
    // El diálogo devuelve el botón pulsado en returnValue; Esc o el gesto atrás lo dejan vacío
    const handleCerrarDialogo = (e: SyntheticEvent<HTMLDialogElement>) => {
        const dialog = e.currentTarget;
        if (dialog.returnValue === 'borrar') {
            clearJsonData();
            setFile(null);
            setJsonAuxData(null);
            setDisabled(true);
            setError(null);
            setBorrado(true);
        }
        dialog.returnValue = '';
    };
    const navigate = useNavigate();
    const processFile = async (file: File | null) => {
        if (file) {
            setFile(file);
            try{
                if (!file.name.toLowerCase().endsWith('.xlsx')) {
                    throw new Error("Solo se admiten archivos .xlsx. Descarga el Excel original desde la web de exámenes de la URJC.");
                }
                const data = await excelToJson(file);
                // excelToJson normaliza Fecha y Hora, descarta filas incompletas y lanza un error legible si no queda ninguna
                setJsonAuxData(data);
                setError(null);
                setDisabled(false);
            }
            catch(error) {
                console.error("Error al procesar el archivo:", error);
                setError("ERROR: " + (error instanceof Error ? error.message : String(error)));
                setDisabled(true);
            }
        }
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => processFile(e.target.files?.[0] ?? null);
    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setDragging(true);
    };
    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        // Al pasar por encima de un hijo también salta dragleave: solo cuenta si se sale de la zona
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setDragging(false);
    };
    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDragging(false);
        processFile(e.dataTransfer.files[0] ?? null);
    };
    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!file) {
            setError("ERROR: Por favor, selecciona un archivo antes de importar.");
            return;
        }
        // Sin datos válidos el botón está desactivado; se comprueba también para el tipo
        if (!jsonAuxData) return;
        try {
            setJsonData(jsonAuxData);
            navigate('/dashboard/calendario');
        } catch (error) {
            console.error("Error al importar el archivo:", error);
            setError("ERROR: " + (error instanceof Error ? error.message : String(error)));
        }
    };
    return (
        <div className='min-h-full flex flex-col'>
            <PageMeta titulo="Importar Excel" noindex />
            <h1 className="text-3xl font-bold">Importar Calendario de Exámenes</h1>
            <div className='flex flex-row gap-1 items-center text-center mt-3'>
                <IconHelpCircle size={16} className="inline-block text-texto-suave mr-1" />
                <p className="text-texto-suave text-sm">¿Tienes dudas? puedes ver esta <NavLink to="/dashboard/guia-de-uso" className="text-enlace hover:underline">guía de uso</NavLink></p>
            </div>
            <form className="relative mt-6 flex flex-col bg-superficie h-full py-10 px-10 lg:px-20 lg:h-4/5 rounded border border-borde shadow-sm dark:shadow-none gap-8 lg:gap-10">
            <div className='flex flex-col gap-4'>
                <input
                onChange={handleFileChange}
                    id="exam-file"
                    type="file"
                    accept=".xlsx"
                    className="sr-only"/>
                <label
                    htmlFor="exam-file"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed ${dragging ? 'border-primary bg-lienzo' : 'border-borde-fuerte'} rounded-lg px-6 py-14 text-center cursor-pointer hover:border-primary hover:bg-lienzo transition-colors`}>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-lienzo">
                        <IconFileUpload stroke={2} />
                    </div>
                    <p className="font-semibold">Arrastra tu archivo de examenes aqui o haz clic para buscar</p>
                    <p className="mt-1 text-sm text-texto-suave">Formatos soportados: el archivo .xlsx original de <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-enlace hover:underline">examenes</a> </p>
                </label>
                {file && <p className="text-start text-sm text-texto font-medium">Archivo seleccionado: {file.name}</p>}
                {error && <p className="text-start text-sm text-error font-medium">{error}</p>}
                </div>
                <div className='flex flex-col gap-6'>
                    {jsonDataState && jsonDataState.length > 0 && (
                        <div className="text-sm text-texto border border-borde bg-superficie rounded-sm p-4 gap-4 flex flex-row">
                            <IconExclamationCircle className="min-w-5 h-full" stroke={2} />
                            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full'>
                                <p>Ya tiene un calendario, importar otro lo sobreescribirá.</p>
                                <button type="button" onClick={() => { setBorrado(false); dialogBorrarRef.current?.showModal(); }} className="self-start lg:self-auto shrink-0 min-h-11 inline-flex items-center gap-2 px-4 rounded border border-primary text-primary font-semibold cursor-pointer hover:bg-lienzo transition-colors">
                                    <IconTrash size={18} stroke={2} />
                                    Borrar calendario
                                </button>
                            </div>
                        </div>
                    )}
                    {borrado && (
                        <p role="status" className="text-sm text-texto font-medium">Se ha borrado el calendario de este navegador.</p>
                    )}
                    <div className="text-sm text-texto border border-borde bg-superficie rounded-sm p-4 gap-4 flex flex-row">
                        <IconInfoCircle className="min-w-5 h-full" stroke={2} />
                        <div className='flex flex-col gap-2'>
                            <h2 className="font-semibold">Instrucciones de formato:</h2>
                            <p>Asegúrate de que el archivo cumpla el formato correcto que se específica en la <NavLink to="/dashboard/guia-de-uso" className="text-enlace hover:underline">guía de uso</NavLink>.</p>
                        </div>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} disabled={disabled} className="disabled:brightness-75 disabled:cursor-not-allowed hover:brightness-90 hidden lg:block cursor-pointer bg-primary self-end w-38 text-sobre-primary px-8 py-2 rounded">Importar</button>
                <button type="submit" onClick={handleSubmit} disabled={disabled} className="disabled:brightness-75 lg:hidden cursor-pointer bg-primary text-sobre-primary px-8 py-2 rounded">Importar</button>
            </form>
            <dialog ref={dialogBorrarRef} onClose={handleCerrarDialogo} aria-labelledby="borrar-titulo" aria-describedby="borrar-descripcion" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-md bg-superficie text-texto border border-borde p-6 shadow-lg dark:shadow-none overscroll-contain backdrop:bg-black/50 backdrop:overflow-hidden backdrop:overscroll-contain">
                <h2 id="borrar-titulo" className="text-lg font-bold">¿Borrar el calendario?</h2>
                <p id="borrar-descripcion" className="mt-2 text-sm text-texto-suave">Se eliminarán los exámenes guardados en este navegador. Para recuperarlos tendrás que volver a importar el Excel.</p>
                <form method="dialog" className="mt-6 flex flex-col-reverse gap-3 lg:flex-row lg:justify-end">
                    <button value="cancelar" autoFocus className="min-h-11 px-4 rounded border border-borde font-semibold cursor-pointer hover:bg-superficie-alta transition-colors">Cancelar</button>
                    <button value="borrar" className="min-h-11 px-4 rounded bg-primary text-sobre-primary font-semibold cursor-pointer hover:brightness-90">Borrar calendario</button>
                </form>
            </dialog>
        </div>
        )
    }
