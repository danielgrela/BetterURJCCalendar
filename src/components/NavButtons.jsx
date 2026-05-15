import { IconHome2 } from '@tabler/icons-react';
import { IconCalendarWeek } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import { useLocation } from "react-router-dom";
import ButtonNavBar from './ButtonNavBar.jsx';
function getSelectedFromPath(path) {
    const cleanPath = path.split('?')[0].replace(/\/+$/, '');
    const lastSegment = cleanPath.split('/').filter(Boolean).pop();
    return lastSegment === 'dashboard' ? '/' : lastSegment ?? '/';
}

export default function NavButtons() {
    const location = useLocation();
    const Selected = getSelectedFromPath(location.pathname);
    return (
        <div className={`flex lg:gap-2 lg:px-2 flex-row lg:flex-col w-full h-full lg:h-auto items-center justify-center`}>
            <ButtonNavBar to="./" children={<><IconHome2 stroke={2} />Inicio</>} Selected={Selected} path="/" />
            <ButtonNavBar to="./calendario" children={<><IconCalendarWeek stroke={2} />Calendario</>} Selected={Selected} path="calendario" />
            <ButtonNavBar to="./importar" children={<><IconFileUpload stroke={2} />Importar</>} Selected={Selected} path="importar" />
        </div>
    )
}