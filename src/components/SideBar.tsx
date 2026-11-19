import NavButtons from './NavButtons.tsx'
import { NavLink } from 'react-router';
export default function SideBar() {
    return (
        <section className="w-full h-25 lg:w-70 min-h-25 lg:h-screen bg-superficie shadow-md dark:shadow-none border-t lg:border-t-0 lg:border-r border-borde lg:py-12 text-center items-center flex flex-row lg:flex-col">
            <div className='px-4 hidden lg:block'>
                <NavLink className="text-3xl font-extrabold text-primary" to="../">
                    <p className='text-start'>Better URJC Calendar</p>
                </NavLink>
                <p className="text-texto-suave text-start">Un proyecto de Daniel Grela.</p>
            </div>
            <div className='bg-borde w-full h-px mt-8 mb-4 hidden lg:block'/>
            <NavButtons />
        </section>)
}