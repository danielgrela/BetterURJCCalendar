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
            <article className="p-6 gap-10 w-full max-w-300 rounded-md shadow-md dark:shadow-none border-2 border-borde bg-superficie h-fit flex flex-col lg:flex-row">
                <div className="min-w-full lg:min-w-1/2 gap-5 flex flex-col">
                    <div className='flex flex-col lg:flex-row items-center justify-center text-center lg:text-start lg:justify-start gap-3'>
                        <IconUserCircle stroke={2} className='bg-primary text-sobre-primary p-1 size-8 rounded-md min-w-fit'/>
                        <h2 className="text-3xl font-bold">1. Acceso a exámenes</h2>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">01.</p>
                        <div>
                            <h3 className="font-bold">Iniciar sesión</h3>
                            <p className='pl'><a href="https://servicios.urjc.es/examenes/alumno/login" target="_blank" rel="noopener noreferrer" className="text-enlace underline underline-offset-2 hover:decoration-2">Accede a la plataforma con tus credenciales universitarias</a> para ver tu calendario de exámenes.</p>
                        </div>    
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">02.</p>
                        <div>
                            <h3 className="font-bold">Descargar el archivo Excel</h3>
                            <p className='pl'>Selecciona la opción «Descargar en Excel» para obtener tu calendario de exámenes. También puedes hacerlo tú mismo si respetas las columnas y filas de este<a href="/Examenes.xlsx" download="Examenes.xlsx" className="text-enlace underline underline-offset-2 hover:decoration-2"> archivo de ejemplo</a>.</p>
                        </div>    
                    </div>
                </div>
                <div className="min-w-full lg:min-w-1/3 gap-8 flex flex-col justify-center">
                    <img src={fotoguia02} alt="Inicio de sesión único (SSO) de la URJC con las opciones Credenciales y Sistema Cl@ve" className="rounded-md border border-borde w-full h-auto object-contain" />
                    <img src={fotoguia01} alt="Apartado Exámenes de la web de la URJC con los botones Descargar en PDF y Descargar en Excel" className="rounded-md border border-borde w-full h-auto object-contain" />
                </div>
            </article>
            <article className="p-6 gap-10 w-full max-w-300 h-fit flex flex-col-reverse lg:flex-row">
                <div className="min-w-full lg:min-w-1/2 gap-8 flex flex-col justify-center">
                    <img src={fotoguia03} alt="Página Importar de Better URJC Calendar con el archivo Examenes.xlsx seleccionado y el botón Importar" className="rounded-md border border-borde w-full h-auto object-contain" />                </div>
                <div className="min-w-full lg:min-w-1/2 gap-5 flex flex-col justify-center">
                    <div className='flex flex-col lg:flex-row items-center justify-center text-center lg:text-start lg:justify-start gap-3'>
                        <IconFileUpload stroke={2} className='bg-primary text-sobre-primary p-1 size-8 rounded-md min-w-fit'/>
                        <h2 className="text-3xl font-bold">2. Importación de datos</h2>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">01.</p>
                        <div>
                            <h3 className="font-bold">Acceder al dashboard</h3>
                            <p className='pl'>Accede a la <NavLink to="/dashboard/importar" className="text-enlace underline underline-offset-2 hover:decoration-2">página de importar</NavLink> y añade tu archivo de exámenes. Si el sistema no da ningún error, pulsa el botón de importar y se te llevará directamente a la sección «Calendario».</p>
                        </div>    
                    </div>
                    <div className='flex flex-row gap-4'>
                        <p className="font-bold">02.</p>
                        <div>
                            <h3 className="font-bold">Usar el calendario</h3>
                            <p className='pl'>En la fecha en la que escribo esta guía, las siguientes funciones están disponibles en el calendario de exámenes.</p>
                            <ul className='list-disc pl-6'>
                                <li>Visualización de exámenes por fecha</li>
                                <li>Filtro por convocatoria</li>
                                <li>Filtro por exámenes pendientes</li>
                            </ul>
                        </div>    
                    </div>
                </div>
            </article>
        </div>
    )
}