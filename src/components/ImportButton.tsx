import { NavLink } from 'react-router';
import { IconFileUpload } from '@tabler/icons-react';

// Siguiente paso de los estados vacíos sin datos importados
export default function ImportButton() {
    return (
        <NavLink to="/dashboard/importar" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">
            <IconFileUpload size={20} stroke={2} aria-hidden="true" />
            Importar Excel
        </NavLink>
    );
}
