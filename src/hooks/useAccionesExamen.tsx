import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router';
import useFileStore from './useFileStore';
import useAvisos from './useAvisos';
import { claveExamen, nombreLegible } from '../scripts/examen';
import type { AccionMenu } from '../components/MenuAcciones';
import type { Examen } from '../types/examen';

interface Opciones {
    /** Se llama después de eliminar (p. ej. para cerrar un diálogo modal, que dejaría inerte el aviso con «Deshacer») */
    alEliminar?: () => void;
}

// Acciones del menú «⋯» de un examen. Eliminar no pide confirmación: se puede deshacer desde el aviso
export default function useAccionesExamen(examen: Examen, { alEliminar }: Opciones = {}): AccionMenu[] {
    const eliminarExamen = useFileStore((state) => state.eliminarExamen);
    const restaurarExamen = useFileStore((state) => state.restaurarExamen);
    const mostrarAviso = useAvisos((state) => state.mostrarAviso);
    const nombre = nombreLegible(examen);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // El formulario de Crear en modo edición; al guardar vuelve a la página desde la que se abrió
    const editar = () => navigate(`/dashboard/crear?editar=${encodeURIComponent(claveExamen(examen))}`, { state: { volver: pathname } });

    const eliminar = () => {
        const eliminado = eliminarExamen(claveExamen(examen));
        alEliminar?.();
        if (!eliminado) return;
        mostrarAviso({ texto: `Has eliminado ${nombre}.`, accion: { texto: 'Deshacer', onClick: () => restaurarExamen(eliminado) } });
    };

    return [
        { id: 'editar', texto: 'Editar', icono: <IconPencil size={20} stroke={2} />, onSelect: editar },
        { id: 'eliminar', texto: 'Eliminar', icono: <IconTrash size={20} stroke={2} />, onSelect: eliminar, peligro: true, separada: true },
    ];
}
