import { IconHome2 } from '@tabler/icons-react';
import { IconCalendarWeek } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import { NavLink, useLocation } from "react-router-dom";

function getSelectedFromPath(path) {
    const cleanPath = path.split('?')[0].replace(/\/+$/, '');
    const lastSegment = cleanPath.split('/').filter(Boolean).pop();
    return lastSegment === 'dashboard' ? '/' : lastSegment ?? '/';
}

export function NavButtons() {
    const location = useLocation();
    const Selected = getSelectedFromPath(location.pathname);
    return (
        <div className='flex flex-col gap-2 px-2'>
            <NavLink to="./" className={`rounded-sm w-full text-lg px-8 py-3 inline-flex items-center justify-start gap-2 ${Selected === '/' ? 'bg-primary text-white font-bold' : 'hover:bg-gray-200'}`}>
                <IconHome2 stroke={2} />Inicio
            </NavLink>
            <NavLink to="./calendario" className={`rounded-sm w-full text-lg px-8 py-3 inline-flex items-center justify-start gap-2 ${Selected === 'calendario' ? 'bg-primary text-white font-bold' : 'hover:bg-gray-200'}`}>
                <IconCalendarWeek stroke={2} />Calendario
            </NavLink>
            <NavLink to="./importar" className={`rounded-sm w-full text-lg px-8 py-3 inline-flex items-center justify-start gap-2 ${Selected === 'importar' ? 'bg-primary text-white font-bold' : 'hover:bg-gray-200'}`}>
                <IconFileUpload stroke={2} />Importar Excel
            </NavLink>
        </div>
    )
}