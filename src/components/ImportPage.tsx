import { IconFileUpload, IconInfoCircle, IconExclamationCircle, IconHelpCircle, IconTrash } from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, MouseEvent, SyntheticEvent } from 'react';
import type { Examen } from '../types/examen';
import excelToJson from '../scripts/handleExcel';
import icsToJson from '../scripts/handleICS';
import { NavLink, useNavigate } from 'react-router';
import PageMeta from './PageMeta.tsx';
import CambiosCalendario from './CambiosCalendario';
import { compararCalendarios } from '../scripts/cambios';
import { leerCopia, type CopiaSeguridad } from '../scripts/copiaSeguridad';
import usePreferencias from '../hooks/usePreferencias';
export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [jsonAuxData, setJsonAuxData] = useState<Examen[] | null>(null);
    // Una copia de seguridad (.json) no se importa como un calendario: lo sustituye todo, ajustes incluidos
    const [copia, setCopia] = useState<CopiaSeguridad | null>(null);
    const restaurarCopia = useFileStore((state) => state.restaurarCopia);
    const [disabled, setDisabled] = useState(true);
    const [dragging, setDragging] = useState(false);
    const setJsonData = useFileStore((state) => state.setJsonData);
    const jsonDataState = useFileStore((state) => state.jsonData);
    const propios = useFileStore((state) => state.propios);
    const borrarCalendario = useFileStore((state) => state.borrarCalendario);
    const hayImportados = !!jsonDataState && jsonDataState.length > 0;
    const [borrado, setBorrado] = useState(false);
    // Solo si ya hay algo importado: la primera importación no «cambia» nada
    const cambiosPrevistos = useMemo(() => (hayImportados && jsonAuxData ? compararCalendarios(jsonDataState, jsonAuxData) : null), [hayImportados, jsonDataState, jsonAuxData]);
    const dialogBorrarRef = useRef<HTMLDialogElement>(null);
    // El diálogo devuelve el botón pulsado en returnValue; Esc o el gesto atrás lo dejan vacío
    const handleCerrarDialogo = (e: SyntheticEvent<HTMLDialogElement>) => {
        const dialog = e.currentTarget;
        if (dialog.returnValue === 'borrar') {
            borrarCalendario();
            setFile(null);
            setJsonAuxData(null);
            setCopia(null);
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
                const nombre = file.name.toLowerCase();
                if (nombre.endsWith('.json')) {
                    setCopia(leerCopia(await file.text()));
                    setJsonAuxData(null);
                    setError(null);
                    setDisabled(false);
                    return;
                }
                setCopia(null);
                const leer = nombre.endsWith('.xlsx') ? excelToJson : nombre.endsWith('.ics') ? icsToJson : null;
                if (!leer) {
                    throw new Error("Solo se admiten archivos .xlsx, .ics o una copia de seguridad .json. Descarga el Excel original desde la web de exámenes de la URJC o usa un archivo exportado desde aquí.");
                }
                const data = await leer(file);
                // Los dos lectores normalizan Fecha y Hora, descartan lo incompleto y lanzan un error legible si no queda ningún examen
                setJsonAuxData(data);
                setError(null);
                setDisabled(false);
            }
            catch(error) {
                console.error("Error al procesar el archivo:", error);
                setError(error instanceof Error ? error.message : String(error));
                setCopia(null);
                setJsonAuxData(null);
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
            setError("Selecciona un archivo antes de importar.");
            return;
        }
        if (copia) {
            restaurarCopia(copia.importados, copia.propios);
            const { aviso, ...preferencias } = copia.preferencias;
            usePreferencias.getState().setPreferenciasCalendario(preferencias);
            usePreferencias.getState().setAviso(aviso);
            navigate('/dashboard');
            return;
        }
        // Sin datos válidos el botón está desactivado; se comprueba también para el tipo
        if (!jsonAuxData) return;
        try {
            setJsonData(jsonAuxData);
            // Con cambios se va a Inicio, donde se quedan apuntados hasta que se descartan
            navigate(cambiosPrevistos && cambiosPrevistos.length > 0 ? '/dashboard' : '/dashboard/calendario');
        } catch (error) {
            console.error("Error al importar el archivo:", error);
            setError(error instanceof Error ? error.message : String(error));
        }
    };
    return (
        <div className='min-h-full flex flex-col'>
            <PageMeta titulo="Importar calendario" noindex />
            <h1 className="text-3xl font-bold">Importar calendario de exámenes</h1>
            <div className='flex flex-row gap-1 items-center text-center mt-3'>
                <IconHelpCircle size={16} className="inline-block text-texto-suave mr-1" />
                <p className="text-texto-suave text-sm">¿Tienes dudas? Puedes ver esta <NavLink to="/dashboard/guia-de-uso" className="text-enlace underline underline-offset-2 hover:decoration-2">guía de uso</NavLink></p>
            </div>
            <form className="relative mt-6 flex flex-col bg-superficie h-full py-10 px-10 lg:px-20 lg:h-4/5 rounded border border-borde shadow-sm dark:shadow-none gap-8 lg:gap-10">
            <div className='flex flex-col gap-4'>
                <input
                onChange={handleFileChange}
                    id="exam-file"
                    type="file"
                    accept=".xlsx,.ics,text/calendar,.json,application/json"
                    className="peer sr-only"/>
                <label
                    htmlFor="exam-file"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed ${dragging ? 'border-primary bg-lienzo' : 'border-borde-fuerte'} rounded-lg px-6 py-14 text-center cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary hover:border-primary hover:bg-lienzo transition-colors`}>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-lienzo">
                        <IconFileUpload stroke={2} />
                    </div>
                    <p className="font-semibold">Arrastra tu archivo de exámenes aquí o haz clic para buscar</p>
                    <p className="mt-1 text-sm text-texto-suave">Formatos soportados: el archivo .xlsx original de <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-enlace underline underline-offset-2 hover:decoration-2">exámenes</a>, un calendario .ics como el que exportas desde aquí o una copia de seguridad .json</p>
                </label>
                {file && <p className="text-start text-sm text-texto font-medium">Archivo seleccionado: {file.name}</p>}
                {copia && (
                    <p role="status" className="text-start text-sm text-texto">
                        Copia de seguridad del {new Date(copia.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}: {copia.importados?.length ?? 0} exámenes importados y {copia.propios.length} creados a mano, con tus ajustes. <strong className="font-semibold">Al importarla se sustituye todo lo que hay en este navegador.</strong>
                    </p>
                )}
                {cambiosPrevistos && (cambiosPrevistos.length === 0
                    ? <p role="status" className="text-start text-sm text-texto">Es el mismo calendario que ya tienes: no cambia ningún examen.</p>
                    : <div role="status"><CambiosCalendario cambios={cambiosPrevistos} titulo={cambiosPrevistos.length === 1 ? 'Al importar cambiará 1 examen' : `Al importar cambiarán ${cambiosPrevistos.length} exámenes`} /></div>)}
                {error && (
                    <p role="alert" className="flex flex-row gap-2 items-start text-start text-sm text-error font-medium">
                        <IconExclamationCircle size={20} stroke={2} className="min-w-5" aria-hidden="true" />
                        <span>{error} Si no sabes de dónde sacarlo, mira la <NavLink to="/dashboard/guia-de-uso" className="underline underline-offset-2 hover:decoration-2">guía de uso</NavLink>.</span>
                    </p>
                )}
                </div>
                <div className='flex flex-col gap-6'>
                    {(hayImportados || propios.length > 0) && (
                        <div className="text-sm text-texto border-t border-borde pt-6 gap-4 flex flex-row">
                            <IconExclamationCircle className="min-w-5 text-texto-suave" stroke={2} aria-hidden="true" />
                            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full'>
                                <p>{hayImportados
                                    ? `Ya tienes un calendario: importar otro sustituirá lo importado${propios.length > 0 ? '; los exámenes que has creado a mano se mantienen' : ''}.`
                                    : 'Los exámenes que has creado a mano se mantendrán al importar.'}</p>
                                <button type="button" onClick={() => { setBorrado(false); dialogBorrarRef.current?.showModal(); }} className="self-start lg:self-auto shrink-0 min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors">
                                    <IconTrash size={18} stroke={2} />
                                    Borrar calendario
                                </button>
                            </div>
                        </div>
                    )}
                    {borrado && (
                        <p role="status" className="text-sm text-texto font-medium">Se ha borrado el calendario de este navegador.</p>
                    )}
                    <div className="text-sm text-texto border-t border-borde pt-6 gap-4 flex flex-row">
                        <IconInfoCircle className="min-w-5 text-texto-suave" stroke={2} aria-hidden="true" />
                        <div className='flex flex-col gap-2'>
                            <h2 className="font-semibold">Instrucciones de formato</h2>
                            <p>Asegúrate de que el archivo cumpla el formato que se explica en la <NavLink to="/dashboard/guia-de-uso" className="text-enlace underline underline-offset-2 hover:decoration-2">guía de uso</NavLink>.</p>
                        </div>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} disabled={disabled} className="lg:self-end lg:min-w-38 min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed">Importar</button>
            </form>
            <dialog ref={dialogBorrarRef} onClose={handleCerrarDialogo} aria-labelledby="borrar-titulo" aria-describedby="borrar-descripcion" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-md bg-superficie text-texto border border-borde p-6 shadow-lg dark:shadow-none overscroll-contain backdrop:bg-black/50 backdrop:overflow-hidden backdrop:overscroll-contain">
                <h2 id="borrar-titulo" className="text-lg font-bold">¿Borrar el calendario?</h2>
                <p id="borrar-descripcion" className="mt-2 text-sm text-texto-suave">Se eliminarán todos los exámenes guardados en este navegador, también los que has creado a mano. Para recuperarlos tendrás que volver a importar el Excel o el .ics.</p>
                <form method="dialog" className="mt-6 flex flex-col-reverse gap-3 lg:flex-row lg:justify-end">
                    <button value="cancelar" autoFocus className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-borde-fuerte bg-superficie text-texto cursor-pointer hover:bg-superficie-alta transition-colors">Cancelar</button>
                    <button value="borrar" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">Borrar calendario</button>
                </form>
            </dialog>
        </div>
        )
    }
