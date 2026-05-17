import { IconSpeakerphone, IconArrowRight, IconFileUpload  } from '@tabler/icons-react';
import { NavLink } from "react-router-dom";
import CalendarMainMockup from './CalendarMainMockup.jsx';
import jsonMockup from '../assets/jsonMockup.json'
export default function HeroPageMain() {
    return (
        <section className="w-full min-h-2/3 bg-gray-100 dark:bg-gray-900 px-6 py-15 lg:p-15 flex flex-row justify-between">
            <section className="w-full lg:w-2/5 gap-10 lg:gap-13 flex flex-col items-center lg:items-start justify-center">
                <span className='flex flex-row border cursor-default hover:bg-gray-300/70 dark:hover:bg-gray-700/70 bg-gray-200/70 dark:bg-gray-800/70 hover:border-gray-500 dark:hover:border-gray-500 border-gray-400 dark:border-gray-600 duration-300 transition-all w-fit px-3 py-1 gap-1 text-xs items-center justify-center rounded-xl'>
                    <IconSpeakerphone size={16}/>De Daniel para Daniel (y amigos)
                </span>
                <h1 className='text-3xl lg:text-5xl font-bold text-primary text-center lg:text-start'>Organiza tus examenes en segundos</h1>
                <p className='text-neutro font-medium text-center lg:text-start'>Sube tu  <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Excel de examenes de la Universidad Rey Juan Carlos </a> y nosotros creamos tu calendario de examenes personalizado. Olvidate de los líos de interfaz y centrate en estudiar.</p>
                <div className='flex flex-col lg:flex-row gap-3 lg:gap-6 w-full'>
                    <NavLink to="/dashboard" className='items-center bg-primary px-6 py-4 text-white hover:brightness-80 font-medium flex flex-row gap-3 justify-center w-full lg:w-fit'>Empezar ahora <IconArrowRight stroke={2} /></NavLink>
                    <NavLink to="/dashboard/importar" className=' items-center border border-primary bg-white dark:bg-gray-950 hover:brightness-80 px-6 py-4 text-primary font-medium flex flex-row gap-3 justify-center w-full lg:w-fit'>Importar directamente <IconFileUpload color='#E4002B' size={22} /></NavLink>
                </div>
            </section>
            <section className="w-1/2 hidden lg:flex items-center justify-center">
                <CalendarMainMockup jsonData={jsonMockup} year={new Date(2026, 0, 5).getFullYear()} month={new Date(2026,5,0).getMonth()} />
            </section>
        </section>
    );
}