import NavButtons from './NavButtons.tsx'
import { NavLink } from 'react-router';
export default function SideBar() {
    return (
        <section className="w-full h-25 lg:w-70 min-h-25 lg:h-screen bg-white dark:bg-gray-950 shadow-md dark:shadow-gray-900 lg:py-12 text-center items-center flex flex-row lg:flex-col">
            <div className='px-4 hidden lg:block'>
                <NavLink className="text-3xl font-extrabold text-primary" to="../">
                    <p className='text-start'>Better URJC Calendar</p>
                </NavLink>
                <p className="text-gray-600 dark:text-gray-400 text-start">Un proyecto de Daniel Grela.</p>
            </div>
            <div className='bg-gray-300 dark:bg-gray-800 w-full h-px mt-8 mb-4 hidden lg:block'/>
            <NavButtons />
        </section>)
}