import { IconUserCircle, IconFileUpload } from '@tabler/icons-react';
import fotoguia01 from "../assets/fotoguia01.png";
import fotoguia02 from "../assets/fotoguia02.jpg";
import fotoguia03 from "../assets/fotoguia03.png";
import { NavLink } from 'react-router';
import PageMeta from './PageMeta.tsx';

export default function UseGuide() {
    return (
        <div className='px-8 lg:px-0 flex flex-col gap-8'>
            <h1 className="sr-only">Guía de uso</h1>
            <PageMeta titulo="Guía de uso" ruta="/dashboard/guia-de-uso" descripcion="Cómo descargar el Excel de exámenes desde la web de la URJC e importarlo en Better URJC Calendar para tener tu calendario de exámenes en segundos." />
            <article className="p-6 gap-10 w-full max-w-300 rounded-md shadow-sm dark:shadow-none border border-borde bg-superficie h-fit flex flex-col lg:flex-row">
                <div className="min-w-full lg:min-w-1/2 gap-5 flex flex-col">
                    <div className='flex flex-col lg:flex-row items-center justify-center text-center lg:text-start lg:justify-start gap-3'>
                        <IconUserCircle stroke={2} className='text-primary size-8 min-w-fit' aria-hidden='true'/>
                        <h2 className="text-3xl font-bold">1. Acceso a exámenes</h2>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">01.</p>
                        <div>
                            <h3 className="font-bold">Iniciar sesión</h3>
                            <p><a href="https://servicios.urjc.es/examenes/alumno/login" target="_blank" rel="noopener noreferrer" className="text-enlace underline underline-offset-2 hover:decoration-2">Accede a la plataforma con tus credenciales universitarias</a> para ver tu calendario de exámenes.</p>
                        </div>    
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">02.</p>
                        <div>
                            <h3 className="font-bold">Descargar el archivo Excel</h3>
                            <p>Selecciona la opción «Descargar en Excel» para obtener tu calendario de exámenes. También puedes hacerlo tú mismo si respetas las columnas y filas de este<a href="/Examenes.xlsx" download="Examenes.xlsx" className="text-enlace underline underline-offset-2 hover:decoration-2"> archivo de ejemplo</a>.</p>
                        </div>    
                    </div>
                </div>
                <div className="min-w-full lg:min-w-1/3 gap-8 flex flex-col justify-center">
                    <img src={fotoguia02} width={833} height={592} decoding="async" alt="Inicio de sesión único (SSO) de la URJC con la opción Credenciales marcada, junto a Sistema Cl@ve" className="rounded-md border border-borde w-full h-auto object-contain" />
                    <img src={fotoguia01} width={680} height={401} loading="lazy" decoding="async" alt="Apartado Exámenes de la web de la URJC con el botón Descargar en Excel marcado, junto a Descargar en PDF" className="rounded-md border border-borde w-full h-auto object-contain" />
                </div>
            </article>
            <article className="p-6 gap-10 w-full max-w-300 h-fit flex flex-col-reverse lg:flex-row">
                <div className="min-w-full lg:min-w-1/2 gap-8 flex flex-col justify-center">
                    <img src={fotoguia03} width={968} height={695} loading="lazy" decoding="async" alt="Página Importar de Better URJC Calendar con el archivo Examenes.xlsx seleccionado y el botón Importar" className="rounded-md border border-borde w-full h-auto object-contain" />                </div>
                <div className="min-w-full lg:min-w-1/2 gap-5 flex flex-col justify-center">
                    <div className='flex flex-col lg:flex-row items-center justify-center text-center lg:text-start lg:justify-start gap-3'>
                        <IconFileUpload stroke={2} className='text-primary size-8 min-w-fit' aria-hidden='true'/>
                        <h2 className="text-3xl font-bold">2. Importación de datos</h2>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">01.</p>
                        <div>
                            <h3 className="font-bold">Acceder al dashboard</h3>
                            <p>Accede a la <NavLink to="/dashboard/importar" className="text-enlace underline underline-offset-2 hover:decoration-2">página de importar</NavLink> y añade tu archivo de exámenes: el Excel de la URJC, un .ics que hayas exportado antes desde aquí o una copia de seguridad .json (las dos últimas sirven para pasar tus exámenes a otro dispositivo). Si ya tenías un calendario, antes de importar verás qué exámenes cambian de fecha, hora o aula. Si el sistema no da ningún error, pulsa el botón de importar y se te llevará directamente a la sección «Calendario».</p>
                        </div>    
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">02.</p>
                        <div>
                            <h3 className="font-bold">Usar el calendario</h3>
                            <p>En la fecha en la que escribo esta guía, las siguientes funciones están disponibles en el calendario de exámenes.</p>
                            <ul className='list-disc pl-6'>
                                <li>Visualización de exámenes por fecha</li>
                                <li>Filtro por convocatoria y por exámenes pendientes</li>
                                <li>Buscador de asignatura por nombre o código</li>
                                <li>En el ordenador, ← y → para cambiar de mes y T para volver al actual</li>
                                <li>Menú «⋯» en cada examen: editarlo, añadirlo a Google Calendar, marcarlo como aprobado o «No me presento», ocultar la asignatura o eliminarlo</li>
                            </ul>
                            <p className="mt-2">En Inicio tienes además tus asignaturas (para ocultarlas o elegir tu grupo), la carga de estudio, compartir el calendario con un enlace o un QR y la copia de seguridad.</p>
                        </div>    
                    </div>
                </div>
            </article>
        </div>
    )
}