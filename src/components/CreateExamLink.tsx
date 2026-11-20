import { NavLink } from 'react-router';

// Alternativa a importar en los estados vacíos: añadir exámenes a mano
export default function CreateExamLink() {
    return (
        <NavLink to="/dashboard/crear" className="min-h-11 inline-flex items-center px-1 font-semibold text-enlace hover:underline">
            Crear un examen
        </NavLink>
    );
}
