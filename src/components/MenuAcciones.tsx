import { useId, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, type ToggleEvent } from 'react';
import { IconDots } from '@tabler/icons-react';

export interface AccionMenu {
    id: string;
    texto: string;
    icono: ReactNode;
    /** Una orden; o bien href, un destino externo que se abre en otra pestaña */
    onSelect?: () => void;
    href?: string;
    /** Texto pequeño bajo la acción (p. ej. qué consecuencia tiene) */
    detalle?: string;
    /** En color de error (eliminar) */
    peligro?: boolean;
    /** Línea separadora antes de esta acción */
    separada?: boolean;
}

interface Props {
    /** Nombre accesible del botón, p. ej. «Acciones de Bases de datos» */
    etiqueta: string;
    acciones: AccionMenu[];
    className?: string;
}

// Sin anchor positioning (Firefox) el menú se coloca desde script; con él, lo hace el CSS de
// .menu-acciones en index.css. En el prerender (Node) no hay CSS: se decide en el navegador
const ANCLAJE_CSS = typeof CSS !== 'undefined' && CSS.supports('position-area: block-end');
const MARGEN = 8;

function colocarDesdeScript(menu: HTMLElement, boton: HTMLElement) {
    const b = boton.getBoundingClientRect();
    const { offsetWidth: ancho, offsetHeight: alto } = menu;
    const izquierda = Math.min(Math.max(b.right - ancho, MARGEN), window.innerWidth - ancho - MARGEN);
    const cabeDebajo = b.bottom + 4 + alto <= window.innerHeight - MARGEN;
    menu.style.inset = 'auto';
    menu.style.left = `${izquierda}px`;
    menu.style.top = `${cabeDebajo ? b.bottom + 4 : Math.max(b.top - 4 - alto, MARGEN)}px`;
}

const CLASES_ITEM = 'min-h-11 w-full flex items-center gap-3 px-3 py-2 text-start text-sm font-medium rounded-sm cursor-pointer outline-none hover:bg-superficie-alta focus:bg-superficie-alta focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary';

function ItemMenu({ accion, onClick }: { accion: AccionMenu; onClick: (e: MouseEvent<HTMLElement>) => void }) {
    const contenido = (
        <>
            <span className="shrink-0 text-current" aria-hidden="true">{accion.icono}</span>
            <span className="flex flex-col">
                {accion.texto}
                {accion.detalle && <span className="text-xs font-normal text-texto-suave">{accion.detalle}</span>}
            </span>
        </>
    );
    const props = {
        role: 'menuitem',
        tabIndex: -1,
        onClick,
        // El puntero y el foco van juntos: así las flechas siguen desde donde está el ratón
        onPointerMove: (e: PointerEvent<HTMLElement>) => { if (document.activeElement !== e.currentTarget) e.currentTarget.focus({ focusVisible: false }); },
        className: `${CLASES_ITEM} ${accion.peligro ? 'text-error' : 'text-texto'}`,
    };
    return accion.href
        ? <a href={accion.href} target="_blank" rel="noopener noreferrer" {...props}>{contenido}</a>
        : <button type="button" {...props}>{contenido}</button>;
}

// Menú de acciones «⋯» con el Popover API: se cierra al pulsar fuera o con Esc (y el foco vuelve
// al botón). Flechas, Inicio y Fin recorren las acciones; abrir con teclado entra en el menú
export default function MenuAcciones({ etiqueta, acciones, className = '' }: Props) {
    const id = useId();
    const botonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const entrarAlAbrir = useRef(false);
    const [abierto, setAbierto] = useState(false);

    const items = () => [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];

    const handleToggle = (e: ToggleEvent<HTMLDivElement>) => {
        const abre = e.newState === 'open';
        setAbierto(abre);
        if (!abre) return;
        if (!ANCLAJE_CSS && botonRef.current) colocarDesdeScript(e.currentTarget, botonRef.current);
        if (entrarAlAbrir.current) items()[0]?.focus();
        entrarAlAbrir.current = false;
    };

    // detail === 0: el clic viene de Intro o Espacio, no del puntero
    const handleClickBoton = (e: MouseEvent<HTMLButtonElement>) => {
        entrarAlAbrir.current = e.detail === 0;
    };

    const handleKeyDownBoton = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key !== 'ArrowDown') return;
        e.preventDefault();
        if (abierto) items()[0]?.focus();
        else {
            entrarAlAbrir.current = true;
            menuRef.current?.showPopover();
        }
    };

    const handleKeyDownMenu = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab') {
            menuRef.current?.hidePopover();
            return;
        }
        const lista = items();
        const actual = lista.indexOf(document.activeElement as HTMLElement);
        const siguiente = {
            ArrowDown: (actual + 1) % lista.length,
            ArrowUp: (actual - 1 + lista.length) % lista.length,
            Home: 0,
            End: lista.length - 1,
        }[e.key];
        if (siguiente === undefined) return;
        e.preventDefault();
        lista[siguiente]?.focus();
    };

    const elegir = (accion: AccionMenu, e: MouseEvent<HTMLElement>) => {
        // Primero se cierra y se devuelve el foco: la acción puede quitar la tarjeta (eliminar)
        botonRef.current?.focus({ focusVisible: e.detail === 0 });
        menuRef.current?.hidePopover();
        accion.onSelect?.();
    };

    return (
        <>
            <button
                ref={botonRef}
                type="button"
                popoverTarget={`${id}-menu`}
                aria-haspopup="menu"
                aria-expanded={abierto}
                aria-label={etiqueta}
                title="Más acciones"
                onClick={handleClickBoton}
                onKeyDown={handleKeyDownBoton}
                className={`size-11 flex items-center justify-center rounded-sm text-texto-suave cursor-pointer hover:bg-superficie-alta hover:text-texto aria-expanded:bg-superficie-alta aria-expanded:text-texto transition-colors ${className}`}
            >
                <IconDots size={20} stroke={2} aria-hidden="true" />
            </button>
            <div
                ref={menuRef}
                id={`${id}-menu`}
                popover="auto"
                onToggle={handleToggle}
                className="menu-acciones m-0 w-64 max-w-[calc(100vw-2rem)] p-1 rounded-md border border-borde bg-superficie text-texto shadow-lg dark:shadow-none"
            >
                <div role="menu" aria-label={etiqueta} onKeyDown={handleKeyDownMenu} className="flex flex-col">
                    {acciones.map((accion) => (
                        <div key={accion.id} role="none" className={accion.separada ? 'mt-1 pt-1 border-t border-borde' : ''}>
                            <ItemMenu accion={accion} onClick={(e) => elegir(accion, e)} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
