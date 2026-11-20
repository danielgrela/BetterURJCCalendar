import { IconDeviceFloppy } from '@tabler/icons-react';
import { NavLink } from 'react-router';
import useFileStore from '../hooks/useFileStore';
import usePreferencias from '../hooks/usePreferencias';
import { crearCopia, nombreCopia } from '../scripts/copiaSeguridad';
import { descargarBlob } from '../scripts/descargarBlob';
import Desplegable from './Desplegable';

// Desplegable de Inicio para llevarse el calendario a otro navegador o dispositivo
export default function PanelCopia() {
    const hayDatos = useFileStore((state) => (state.jsonData?.length ?? 0) + state.propios.length > 0);
    if (!hayDatos) return null;

    // Se lee el estado en el momento de descargar, no al pintar: así no se repinta con cada cambio
    const descargar = () => {
        const { jsonData, propios } = useFileStore.getState();
        const { ocultas, grupos, estados, aviso } = usePreferencias.getState();
        const copia = crearCopia({ importados: jsonData, propios, preferencias: { ocultas, grupos, estados, aviso } });
        descargarBlob(new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' }), nombreCopia());
    };

    return (
        <Desplegable id="copia" titulo="Copia de seguridad" resumen="Lleva tu calendario a otro navegador o dispositivo">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-texto-suave">Descarga un archivo con todo lo que hay en este navegador: lo importado, lo que has creado a mano, las asignaturas ocultas, tus grupos y los estados. Para recuperarlo, súbelo en <NavLink to="/dashboard/importar" className="text-enlace underline underline-offset-2 hover:decoration-2">Importar</NavLink>: sustituye todo lo que haya allí.</p>
                <button type="button" onClick={descargar} className="self-start min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors">
                    <IconDeviceFloppy size={20} stroke={2} aria-hidden="true" />
                    Descargar copia de seguridad
                </button>
            </div>
        </Desplegable>
    );
}
