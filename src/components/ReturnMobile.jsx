import { IconArrowBarToLeft } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
export default function ReturnMobile() {
    return (
        <div className="block lg:hidden w-full text-center py-7 bg-gray-100 dark:bg-gray-900 -mb-px border-b border-transparent relative z-10">
            <NavLink to="../" className="text-sm flex flex-row gap-2 px-4 items-center h-fit">
                <IconArrowBarToLeft stroke={2} />
                Volver al inicio
            </NavLink>
        </div>
    )
}