
export default function Footer() {
    return (
        <footer className="w-full px-4 lg:px-10 py-8 bg-superficie-alta border-t-2 border-borde flex flex-col lg:flex-row items-center lg:justify-between gap-3">
           <p className="text-xl text-primary font-bold">Better URJC Calendar</p>
           <p className="text-sm lg:text-sm text-texto-suave font-medium text-center">Este es un proyecto open source para gestionar el calendario de exámenes de la URJC: se permite su uso y modificación libremente.</p>
            <section className="flex flex-row gap-8 items-center justify-between font-medium text-sm text-texto-suave mt-6 lg:mt-0">
                 <a href="https://github.com/danielgrela/BetterURJCCalendar" target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center px-1 whitespace-nowrap hover:underline">Repositorio</a>
                 <a href="https://www.danielgrela.com" target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center px-1 whitespace-nowrap hover:underline">Daniel Grela</a>
                 <a href="mailto:contacto@danielgrela.com" target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center px-1 whitespace-nowrap hover:underline">Soporte</a>
            </section>
        </footer>
    );
}