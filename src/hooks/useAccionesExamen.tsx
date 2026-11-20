import { IconBrandGoogle, IconEyeOff, IconPencil, IconTrash } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router';
import useFileStore from './useFileStore';
import useAvisos from './useAvisos';
import usePreferencias from './usePreferencias';
import { claveAsignatura } from '../scripts/preferencias';
import { claveExamen, nombreLegible } from '../scripts/examen';
import { enlaceGoogleCalendar } from '../scripts/googleCalendar';
import type { AccionMenu } from '../components/MenuAcciones';
import type { Examen } from '../types/examen';

interface Opciones {
    /** Se llama tras una acción que muestra un aviso con «Deshacer» (eliminar, ocultar…), justo antes del aviso:
     *  un diálogo modal abierto (detalle del día) se cierra, porque dejaría inerte el aviso */
    alAvisar?: () => void;
}

// Acciones del menú «⋯» de un examen. Eliminar no pide confirmación: se puede deshacer desde el aviso
export default function useAccionesExamen(examen: Examen, { alAvisar }: Opciones = {}): AccionMenu[] {
    const eliminarExamen = useFileStore((state) => state.eliminarExamen);
    const restaurarExamen = useFileStore((state) => state.restaurarExamen);
    const mostrarAviso = useAvisos((state) => state.mostrarAviso);
    const setOculta = usePreferencias((state) => state.setOculta);
    const nombre = nombreLegible(examen);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // El formulario de Crear en modo edición; al guardar vuelve a la página desde la que se abrió
    const editar = () => navigate(`/dashboard/crear?editar=${encodeURIComponent(claveExamen(examen))}`, { state: { volver: pathname } });

    const ocultar = () => {
        const asignatura = claveAsignatura(examen);
        setOculta(asignatura, true);
        alAvisar?.();
        mostrarAviso({ texto: `Has ocultado ${nombre}. Puedes volver a mostrarla en «Tus asignaturas», en Inicio.`, accion: { texto: 'Deshacer', onClick: () => setOculta(asignatura, false) } });
    };

    const eliminar = () => {
        const eliminado = eliminarExamen(claveExamen(examen));
        alAvisar?.();
        if (!eliminado) return;
        mostrarAviso({ texto: `Has eliminado ${nombre}.`, accion: { texto: 'Deshacer', onClick: () => restaurarExamen(eliminado) } });
    };

    return [
        { id: 'editar', texto: 'Editar', icono: <IconPencil size={20} stroke={2} />, onSelect: editar },
        { id: 'google', texto: 'Añadir a Google Calendar', icono: <IconBrandGoogle size={20} stroke={2} />, href: enlaceGoogleCalendar(examen), detalle: 'Se abre en otra pestaña' },
        { id: 'ocultar', texto: 'Ocultar asignatura', icono: <IconEyeOff size={20} stroke={2} />, onSelect: ocultar, detalle: 'No se verá ni se exportará', separada: true },
        { id: 'eliminar', texto: 'Eliminar', icono: <IconTrash size={20} stroke={2} />, onSelect: eliminar, peligro: true, separada: true },
    ];
}
