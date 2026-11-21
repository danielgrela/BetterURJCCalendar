import { IconArrowRight, IconFileUpload } from '@tabler/icons-react';
import { NavLink } from 'react-router';
import Calendar from './Calendar.tsx';
import jsonMockup from '../assets/jsonMockup.json'
import { detectarSolapamientos } from '../scripts/solapamientos';

const SOLAPAMIENTOS_MOCKUP = detectarSolapamientos(jsonMockup);
export default function HeroPageMain() {
    return (
        <section className="w-full bg-lienzo px-6 py-16 lg:p-15 flex flex-row gap-12 justify-between items-center">
            <section className="w-full lg:w-2/5 gap-10 lg:gap-13 flex flex-col items-center lg:items-start justify-center">
                <p className='text-sm font-medium text-texto-suave'>De Daniel para Daniel (y amigos)</p>
                <h1 className='text-3xl lg:text-5xl font-bold text-primary text-center lg:text-start'>Organiza tus exámenes en segundos</h1>
                <p className='text-texto-suave font-medium text-center lg:text-start'>Sube tu <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-enlace underline underline-offset-2 hover:decoration-2">Excel de exámenes de la Universidad Rey Juan Carlos</a> y nosotros creamos tu calendario de exámenes personalizado. Olvídate de los líos de interfaz y céntrate en estudiar.</p>
                <div className='flex flex-col lg:flex-row gap-3 lg:gap-6 w-full'>
                    <NavLink to="/dashboard" className='min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90 py-4 w-full lg:w-fit'>Empezar ahora <IconArrowRight stroke={2} /></NavLink>
                    <NavLink to="/dashboard/importar" className='min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-primary bg-superficie text-primary cursor-pointer hover:bg-primary hover:text-sobre-primary transition-colors py-4 w-full lg:w-fit'>Importar directamente <IconFileUpload size={22} aria-hidden="true" /></NavLink>
                </div>
            </section>
            {/* Demostración para quien aún no ha importado nada: el calendario real con datos de ejemplo */}
            <figure className="w-1/2 hidden lg:flex flex-col gap-3">
                <Calendar jsonData={jsonMockup} year={2026} month={4} today={new Date(2026, 4, 18)} solapamientos={SOLAPAMIENTOS_MOCKUP} compact />
            </figure>
        </section>
    );
}