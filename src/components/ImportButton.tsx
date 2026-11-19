import { NavLink } from 'react-router';
import { IconFileUpload } from '@tabler/icons-react';

// Siguiente paso de los estados vacíos sin datos importados
export default function ImportButton() {
    return (
        <NavLink to="/dashboard/importar" className="min-h-11 inline-flex items-center gap-2 px-6 py-3 bg-primary text-sobre-primary font-medium hover:brightness-80">
            <IconFileUpload size={20} stroke={2} aria-hidden="true" />
            Importar Excel
        </NavLink>
    );
}
