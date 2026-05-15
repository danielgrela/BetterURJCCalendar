import {NavButtons} from './NavButtons.jsx'
import { NavLink } from 'react-router-dom';
export function SideBar() {
    return (
        <section className="w-full h-25 lg:w-70 min-h-25 lg:h-screen bg-white shadow-md lg:py-12 text-center items-center flex flex-row lg:flex-col">
            <div className='px-4 hidden lg:block'>
                <NavLink className="text-3xl font-extrabold text-primary" to="../">
                    <h1 className='text-start'>Better URJC Calendar</h1>
                </NavLink>
                <p className="text-gray-600 text-start">Un proyecto de Daniel Grela.</p>
            </div>
            <div className='bg-secundario w-full h-px mt-8 mb-4 hidden lg:block'/>
            <NavButtons />
        </section>)
}