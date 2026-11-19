import { IconHome2 } from '@tabler/icons-react';
import { IconCalendarWeek } from '@tabler/icons-react';
import { IconFileUpload } from '@tabler/icons-react';
import ButtonNavBar from './ButtonNavBar.jsx';

export default function NavButtons() {
    return (
        <div className={`flex lg:gap-2 lg:px-2 flex-row lg:flex-col w-full h-full lg:h-auto items-center justify-center`}>
            <ButtonNavBar to="/dashboard" end><IconHome2 stroke={2} />Inicio</ButtonNavBar>
            <ButtonNavBar to="/dashboard/calendario"><IconCalendarWeek stroke={2} />Calendario</ButtonNavBar>
            <ButtonNavBar to="/dashboard/importar"><IconFileUpload stroke={2} />Importar</ButtonNavBar>
        </div>
    )
}
