import { useEffect, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import useAvisos from '../hooks/useAvisos';

const DURACION = 8000;

// Región fija de avisos breves. Está siempre en la página (vacía si no hay aviso) para que los
// lectores de pantalla anuncien lo que entra. El aviso se cierra solo, salvo mientras el foco o
// el puntero están dentro (para que dé tiempo a pulsar «Deshacer»)
export default function Avisos() {
    const aviso = useAvisos((state) => state.aviso);
    const id = useAvisos((state) => state.id);
    const cerrarAviso = useAvisos((state) => state.cerrarAviso);
    const [pausado, setPausado] = useState(false);

    useEffect(() => {
        if (!aviso || pausado) return;
        const temporizador = window.setTimeout(cerrarAviso, DURACION);
        return () => window.clearTimeout(temporizador);
    }, [aviso, id, pausado, cerrarAviso]);

    const cerrar = () => {
        cerrarAviso();
        setPausado(false);
    };

    return (
        <div
            role="region"
            aria-label="Avisos"
            onFocus={() => setPausado(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPausado(false); }}
            onPointerEnter={() => setPausado(true)}
            onPointerLeave={() => setPausado(false)}
            className="fixed z-40 inset-x-4 bottom-24 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:bottom-8 lg:w-max lg:max-w-lg print:hidden"
        >
            <div aria-live="polite">
                {aviso && (
                    <div className="flex flex-row items-center gap-2 ps-4 pe-1 py-1 rounded-sm border border-borde bg-superficie text-sm text-texto shadow-md dark:shadow-none">
                        <p className="flex-1 py-2">{aviso.texto}</p>
                        {aviso.accion && (
                            <button type="button" onClick={() => { aviso.accion?.onClick(); cerrar(); }} className="min-h-11 px-3 font-semibold text-enlace cursor-pointer hover:underline">
                                {aviso.accion.texto}
                            </button>
                        )}
                        <button type="button" onClick={cerrar} aria-label="Cerrar aviso" className="size-11 shrink-0 flex items-center justify-center rounded-sm text-texto-suave cursor-pointer hover:bg-superficie-alta transition-colors">
                            <IconX size={18} stroke={2} aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
