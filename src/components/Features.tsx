import { IconCalendar, IconDownload, IconFileUpload } from '@tabler/icons-react';
export default function Features() {
    return (
        <section className="bg-lienzo w-full border-t border-borde px-6 py-16 lg:p-15 lg:pb-30 flex flex-col">
            <p className='text-texto-suave text-lg font-semibold text-center mb-6'>Características</p>
            <h2 className='text-3xl font-bold text-center sr-only lg:not-sr-only lg:mb-14'>Ahórrate perder el tiempo</h2>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-6 w-full'>
                <article className="flex-1 border bg-superficie border-borde p-6 flex flex-col gap-4 rounded-md">
                    <IconFileUpload size={28} stroke={2} className="text-primary" aria-hidden="true" />
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-xl font-bold'>
                            Importación fácil
                        </h3>
                        <p className='text-texto-suave'>
                            Sube tu archivo Excel de horarios de la URJC directamente al sistema. Sin configuraciones complejas, detectamos tus asignaturas al instante.
                        </p>
                    </div>
                </article>
                <article className="flex-1 border bg-superficie border-borde p-6 flex flex-col gap-4 rounded-md">
                    <IconCalendar size={28} stroke={2} className="text-primary" aria-hidden="true" />
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-xl font-bold'>
                            Visualización clara
                        </h3>
                        <p className='text-texto-suave'>
                            Una interfaz limpia y estructurada para ver tus exámenes. Identifica rápidamente solapamientos y planifica tu tiempo de estudio eficazmente.
                        </p>
                    </div>
                </article>
                <article className="flex-1 border bg-superficie border-borde p-6 flex flex-col gap-4 rounded-md">
                    <IconDownload size={28} stroke={2} className="text-primary" aria-hidden="true" />
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-xl font-bold'>
                            Descarga multiformato
                        </h3>
                        <p className='text-texto-suave'>
                            Exporta tu calendario finalizado a Excel, o a formato iCal (.ics) para sincronizarlo con Google Calendar, Apple o Outlook.
                        </p>
                    </div>
                </article>
            </div>
        </section>
    );
}