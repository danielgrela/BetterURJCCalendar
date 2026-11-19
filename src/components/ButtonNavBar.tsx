import { NavLink } from 'react-router'
import type { ReactNode } from 'react'

interface Props {
    to: string;
    children: ReactNode;
    end?: boolean;
}

export default function ButtonNavBar({to, children, end = false}: Props) {
    return (
        <NavLink to={to} end={end} className={({ isActive }) => `lg:rounded-sm w-1/3 lg:w-full text-lg px-8 py-2 lg:py-3 h-full flex flex-col items-center justify-center lg:justify-start lg:gap-2 ${isActive ? 'bg-primary text-sobre-primary font-bold' : 'hover:bg-superficie-alta'}`}>
            {children}
        </NavLink>
    )
}
