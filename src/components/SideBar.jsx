import NavButtons from './NavButtons.jsx'
import { NavLink } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode.js';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function SideBar() {
    const { isDark, toggle } = useDarkMode();
    return (
        <section className="w-full h-25 lg:w-70 min-h-25 lg:h-screen bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900 lg:py-12 text-center items-center flex flex-row lg:flex-col">
            <div className='px-4 hidden lg:block'>
                <NavLink className="text-3xl font-extrabold text-primary" to="../">
                    <h1 className='text-start'>Better URJC Calendar</h1>
                </NavLink>
                <p className="text-gray-600 dark:text-gray-400 text-start">Un proyecto de Daniel Grela.</p>
            </div>
            <div className='bg-secundario w-full h-px mt-8 mb-4 hidden lg:block'/>
            <NavButtons />
            {/* Dark mode toggle — desktop: bottom of sidebar, mobile: inline with nav */}
            <button
                onClick={toggle}
                aria-label="Cambiar modo oscuro"
                className="ml-auto mr-2 lg:mr-0 lg:ml-0 lg:mt-auto lg:mb-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                {isDark ? <IconSun size={22} stroke={2} /> : <IconMoon size={22} stroke={2} />}
            </button>
        </section>)
}