import { NavLink } from "react-router-dom"

export default function ButtonNavBar({to, children, Selected, path}) {
    return (
            <NavLink to={to} className={`lg:rounded-sm w-1/3 lg:w-full text-lg px-8 py-2 lg:py-3 h-full flex flex-col items-center justify-center lg:justify-start lg:gap-2 ${Selected === path ? 'bg-primary text-white font-bold' : 'hover:bg-gray-200'}`}>
                {children}
            </NavLink>
    )
}