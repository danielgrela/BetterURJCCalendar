
export default function Footer() {
    return (
        <footer className="w-full px-4 lg:px-10 py-8 bg-gray-200 border-t-2 border-gray-300 flex flex-col lg:flex-row items-center lg:justify-between gap-3">
           <h1 className="text-xl text-primary font-bold">Better URJC Calendar</h1>
           <p className="text-sm lg:text-sm text-neutro font-medium text-center">Este es un proyecto open source para gestionar el calendario de exámenes de la URJC, se permite su uso y modificación libremente.</p>
            <section className="flex flex-row gap-8 items-center justify-between font-medium text-sm text-neutro mt-6 lg:mt-0">
                 <a href="https://github.com/danielgrela/BetterURJCCalendar" target="_blank" rel="noopener noreferrer" className="text-center hover:underline">Repositorio</a>
                 <a href="https://www.danielgrela.com" target="_blank" rel="noopener noreferrer" className="text-center hover:underline">Daniel Grela</a>
                 <a href="mailto:contacto@danielgrela.com" target="_blank" rel="noopener noreferrer" className="text-center hover:underline">Soporte</a>
            </section>
        </footer>
    );
}