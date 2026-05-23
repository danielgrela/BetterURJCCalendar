import { IconArrowBarToLeft } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import ToggleThemeButton from './ToggleThemeButton.jsx';
export default function ReturnMobile() {
    return (
        <div className="px-4 flex flex-row lg:hidden w-full text-center py-7 bg-gray-100 dark:bg-gray-900 -mb-px border-b border-transparent relative z-10 items-center justify-between">
            <NavLink to="../" className="text-sm flex flex-row gap-2 items-center h-fit">
                <IconArrowBarToLeft stroke={2} />
                Volver al inicio
            </NavLink>
            <ToggleThemeButton className="block lg:hidden" />
        </div>
    )
}