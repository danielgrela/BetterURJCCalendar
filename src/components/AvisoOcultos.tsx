import { NavLink } from 'react-router';
import { IconEyeOff } from '@tabler/icons-react';

// Cuando las preferencias de asignaturas quitan exámenes de la vista: que no parezca que faltan
export default function AvisoOcultos({ ocultos, className = '' }: { ocultos: number; className?: string }) {
    if (ocultos === 0) return null;
    return (
        <p className={`flex flex-row flex-wrap items-center gap-x-2 text-sm text-texto-suave ${className}`}>
            <IconEyeOff size={16} stroke={2} className="min-w-fit" aria-hidden="true" />
            {ocultos === 1 ? '1 examen no se muestra' : `${ocultos} exámenes no se muestran`} por tus ajustes de asignaturas.
            <NavLink to="/dashboard#asignaturas" className="min-h-11 inline-flex items-center font-semibold text-enlace hover:underline">Cambiar</NavLink>
        </p>
    );
}
