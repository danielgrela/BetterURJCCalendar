import { IconBrandGoogle, IconCircleCheck, IconCircleX, IconEyeOff, IconPencil, IconTrash } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router';
import useFileStore from './useFileStore';
import useAvisos from './useAvisos';
import usePreferencias from './usePreferencias';
import { claveAsignatura, type Estado } from '../scripts/preferencias';
import { claveEstable, claveExamen, nombreLegible } from '../scripts/examen';
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
    const setEstado = usePreferencias((state) => state.setEstado);
    const estado = usePreferencias((state) => state.estados[claveEstable(examen)]);
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

    // Marcar o quitar un estado; al marcar se avisa de la consecuencia (ocultar o no exportar)
    const cambiarEstado = (nuevo: Estado) => {
        const clave = claveEstable(examen);
        const anterior = estado ?? null;
        if (estado === nuevo) {
            setEstado(clave, null);
            return;
        }
        setEstado(clave, nuevo);
        alAvisar?.();
        const texto = nuevo === 'aprobado'
            ? `Has marcado ${nombre} (${examen.Convocatoria}) como aprobado: sus exámenes posteriores ya no se muestran ni se exportan.`
            : `No te presentas a ${nombre} (${examen.Convocatoria}): no se exportará al .ics ni al Excel.`;
        mostrarAviso({ texto, accion: { texto: 'Deshacer', onClick: () => setEstado(clave, anterior) } });
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
        estado === 'aprobado'
            ? { id: 'aprobado', texto: 'Quitar «Aprobado»', icono: <IconCircleCheck size={20} stroke={2} />, onSelect: () => cambiarEstado('aprobado'), separada: true }
            : { id: 'aprobado', texto: 'Marcar como aprobado', icono: <IconCircleCheck size={20} stroke={2} />, onSelect: () => cambiarEstado('aprobado'), detalle: 'Oculta sus exámenes posteriores', separada: true },
        estado === 'no-presento'
            ? { id: 'no-presento', texto: 'Quitar «No me presento»', icono: <IconCircleX size={20} stroke={2} />, onSelect: () => cambiarEstado('no-presento') }
            : { id: 'no-presento', texto: 'No me presento', icono: <IconCircleX size={20} stroke={2} />, onSelect: () => cambiarEstado('no-presento'), detalle: 'No se exportará al .ics ni al Excel' },
        { id: 'ocultar', texto: 'Ocultar asignatura', icono: <IconEyeOff size={20} stroke={2} />, onSelect: ocultar, detalle: 'No se verá ni se exportará' },
        { id: 'eliminar', texto: 'Eliminar', icono: <IconTrash size={20} stroke={2} />, onSelect: eliminar, peligro: true, separada: true },
    ];
}
