import { useEffect, useId, useRef, useState } from 'react';
import { IconCopy, IconLink, IconShare } from '@tabler/icons-react';
import { useExamenesVisibles } from '../hooks/useExamenesVisibles';
import { codificarCalendario, enlaceCompartido } from '../scripts/compartir';
import type { Examen } from '../types/examen';
import Desplegable from './Desplegable';

interface Enlace {
    url: string;
    /** Módulos del QR (true = oscuro); null si el enlace no cabe en un QR que se pueda escanear */
    qr: boolean[][] | null;
    /** Los exámenes con los que se creó: si cambian, el enlace ya no está al día */
    de: Examen[];
    puedeCompartir: boolean;
}

// Hasta la versión 25 (117×117 módulos) un móvil lo lee sin problemas desde una pantalla; más
// denso cuesta enfocarlo, así que con calendarios muy grandes se ofrece solo el enlace
const VERSION_MAXIMA_QR = 25;

async function crearQR(url: string): Promise<boolean[][] | null> {
    // uqr solo se descarga al crear un enlace
    const { encode } = await import('uqr');
    try {
        return encode(url, { ecc: 'L', border: 2, maxVersion: VERSION_MAXIMA_QR }).data;
    } catch {
        return null;
    }
}

// Un trazo por módulo oscuro: un solo <path> pesa mucho menos que miles de <rect>
const trazoQR = (modulos: boolean[][]) => modulos
    .flatMap((fila, y) => fila.map((oscuro, x) => (oscuro ? `M${x} ${y}h1v1h-1z` : '')))
    .join('');

// Desplegable de Inicio para pasar el calendario a un compañero: los exámenes van comprimidos
// dentro del enlace (tras el #), sin servidor
export default function PanelCompartir() {
    const { visibles } = useExamenesVisibles();
    const [enlace, setEnlace] = useState<Enlace | null>(null);
    const [creando, setCreando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const temporizador = useRef<number | undefined>(undefined);
    const id = useId();

    useEffect(() => () => clearTimeout(temporizador.current), []);

    if (visibles.length === 0) return null;
    const actual = enlace?.de === visibles ? enlace : null;

    const crear = async () => {
        setCreando(true);
        try {
            const url = enlaceCompartido(window.location.origin, await codificarCalendario(visibles));
            const qr = await crearQR(url);
            setEnlace({ url, qr, de: visibles, puedeCompartir: typeof navigator.share === 'function' });
        } finally {
            setCreando(false);
        }
    };

    const avisar = (texto: string) => {
        clearTimeout(temporizador.current);
        setMensaje(texto);
        temporizador.current = window.setTimeout(() => setMensaje(''), 3000);
    };

    const copiar = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            avisar('Enlace copiado.');
        } catch {
            avisar('No se ha podido copiar: selecciona el enlace y cópialo a mano.');
        }
    };

    const compartir = async (url: string) => {
        try {
            await navigator.share({ title: 'Mi calendario de exámenes', url });
        } catch (error) {
            // Cerrar la hoja de compartir sin elegir nada no es un error
            if (!(error instanceof DOMException && error.name === 'AbortError')) copiar(url);
        }
    };

    const n = visibles.length;
    return (
        <Desplegable id="compartir" titulo="Compartir calendario" resumen="Pásaselo a un compañero con un enlace o un QR">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-texto-suave">{n === 1 ? 'Se comparte el examen' : `Se comparten los ${n} exámenes`} que ves en tu calendario, sin las asignaturas ocultas ni tus estados (aprobado, no me presento). Los exámenes van dentro del propio enlace: no se suben a ningún servidor, pero cualquiera que tenga el enlace podrá verlos.</p>
                {!actual ? (
                    <button type="button" onClick={crear} disabled={creando} className="self-start min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors disabled:cursor-wait disabled:opacity-75">
                        <IconLink size={20} stroke={2} aria-hidden="true" />
                        {creando ? 'Creando enlace…' : 'Crear enlace'}
                    </button>
                ) : (
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                        {actual.qr && (
                            <svg viewBox={`0 0 ${actual.qr.length} ${actual.qr.length}`} role="img" aria-label="Código QR del enlace" shapeRendering="crispEdges" className="self-center lg:self-start w-full max-w-60 shrink-0 rounded-sm bg-qr-fondo fill-qr-modulo">
                                <path d={trazoQR(actual.qr)} />
                            </svg>
                        )}
                        <div className="flex flex-col gap-3 min-w-0 w-full">
                            <p className="text-sm text-texto">{actual.qr ? 'Escanéalo con la cámara del móvil o envía el enlace.' : 'Tu calendario es demasiado grande para un QR que se pueda escanear: envía el enlace.'} Al abrirlo, se le ofrecerá importarlo.</p>
                            <label htmlFor={`${id}-url`} className="text-sm font-semibold">Enlace</label>
                            <input id={`${id}-url`} type="url" readOnly value={actual.url} onFocus={(e) => e.currentTarget.select()} className="min-h-11 w-full px-3 rounded-sm border border-borde-fuerte bg-lienzo text-texto text-sm" />
                            <div className="flex flex-col gap-3 lg:flex-row">
                                {actual.puedeCompartir && (
                                    <button type="button" onClick={() => compartir(actual.url)} className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">
                                        <IconShare size={20} stroke={2} aria-hidden="true" />
                                        Compartir…
                                    </button>
                                )}
                                <button type="button" onClick={() => copiar(actual.url)} className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-borde-fuerte bg-superficie text-texto cursor-pointer hover:bg-superficie-alta transition-colors">
                                    <IconCopy size={20} stroke={2} aria-hidden="true" />
                                    Copiar enlace
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <p role="status" className="text-sm font-medium text-texto empty:hidden">{mensaje}</p>
            </div>
        </Desplegable>
    );
}
