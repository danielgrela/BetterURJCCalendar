import { IconCalendar,IconDownload, IconFileUploadFilled  } from '@tabler/icons-react';
export default function Features() {
    return (
        <section className="w-full min-h-2/3 border-t-2 border-gray-300 px-6 py-15 lg:p-15 flex flex-col justify-between">
            <p className='text-neutro text-lg font-bold text-center mb-6'>Características</p>
            <h1 className='text-3xl font-bold text-center hidden lg:block mb-14'>Ahorrate perder el tiempo.</h1>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-6 w-full'>
                <article className="border-2 bg-gray-50 border-gray-300 border-l-4 border-l-red-500 px-4 py-4 flex-flex-col gap-4 rounded-md">
                    <div className='flex items-center justify-center w-12 h-12 bg-red-200 rounded-lg mb-4'>
                        <IconFileUploadFilled size={24} className="text-primary" />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-xl font-bold'>
                            Importación fácil
                        </h1>
                        <p className='text-neuto'>
                            Sube tu archivo Excel de horarios de la URJC directamente al sistema. Sin configuraciones complejas, detectamos tus asignaturas al instante.
                        </p>
                    </div>
                </article>
                <article className="border-2 bg-gray-50 border-gray-300 border-l-4 border-l-red-500 px-4 py-4 flex-flex-col gap-4 rounded-md">
                    <div className='flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4'>
                        <IconCalendar size={24} stroke={2.5} className="text-tertiary" />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-xl font-bold'>
                            Visualización clara
                        </h1>
                        <p className='text-neuto'>
                            Una interfaz limpia y estructurada para ver tus exámenes. Identifica rápidamente solapamientos y planifica tu tiempo de estudio eficazmente.
                        </p>
                    </div>
                </article>
                <article className="border-2 bg-gray-50 border-gray-300 border-l-4 border-l-red-500 px-4 py-4 flex-flex-col gap-4 rounded-md">
                    <div className='flex items-center justify-center w-12 h-12 bg-red-200 rounded-lg mb-4'>
                        <IconDownload size={24} stroke={2.5} className="text-primary" />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-xl font-bold'>
                            Descarga multiformato
                        </h1>
                        <p className='text-neuto'>
                            Exporta tu calendario finalizado a PDF para imprimir, o a formato iCal (.ics) para sincronizarlo con Google Calendar, Apple o Outlook.
                        </p>
                    </div>
                </article>
            </div>
        </section>
    );
}