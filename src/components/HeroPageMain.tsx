import { IconSpeakerphone, IconArrowRight, IconFileUpload  } from '@tabler/icons-react';
import { NavLink } from 'react-router';
import Calendar from './Calendar.tsx';
import jsonMockup from '../assets/jsonMockup.json'
export default function HeroPageMain() {
    return (
        <section className="w-full min-h-2/3 bg-lienzo px-6 py-15 lg:p-15 flex flex-row justify-between">
            <section className="w-full lg:w-2/5 gap-10 lg:gap-13 flex flex-col items-center lg:items-start justify-center">
                <span className='flex flex-row border cursor-default bg-superficie-alta border-borde w-fit px-3 py-1 gap-1 text-xs items-center justify-center rounded-xl'>
                    <IconSpeakerphone size={16}/>De Daniel para Daniel (y amigos)
                </span>
                <h1 className='text-3xl lg:text-5xl font-bold text-primary text-center lg:text-start'>Organiza tus examenes en segundos</h1>
                <p className='text-texto-suave font-medium text-center lg:text-start'>Sube tu  <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-enlace hover:underline">Excel de examenes de la Universidad Rey Juan Carlos </a> y nosotros creamos tu calendario de examenes personalizado. Olvidate de los líos de interfaz y centrate en estudiar.</p>
                <div className='flex flex-col lg:flex-row gap-3 lg:gap-6 w-full'>
                    <NavLink to="/dashboard" className='items-center bg-primary px-6 py-4 text-sobre-primary hover:brightness-80 font-medium flex flex-row gap-3 justify-center w-full lg:w-fit'>Empezar ahora <IconArrowRight stroke={2} /></NavLink>
                    <NavLink to="/dashboard/importar" className=' items-center border border-primary bg-superficie hover:brightness-80 px-6 py-4 text-primary font-medium flex flex-row gap-3 justify-center w-full lg:w-fit'>Importar directamente <IconFileUpload size={22} className="text-primary" /></NavLink>
                </div>
            </section>
            <section className="w-1/2 hidden lg:flex items-center justify-center">
                <Calendar jsonData={jsonMockup} year={2026} month={4} today={new Date(2026, 4, 18)} compact />
            </section>
        </section>
    );
}