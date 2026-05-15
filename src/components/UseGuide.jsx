import { IconUserCircle, IconFileUpload } from '@tabler/icons-react';
import fotoguia01 from "../assets/fotoguia01.png";
import fotoguia02 from "../assets/fotoguia02.jpg";
import fotoguia03 from "../assets/fotoguia03.png";
import { NavLink } from 'react-router-dom';

export default function UseGuide() {
    return (
        <main className='px-8 lg:px-0 flex flex-col gap-8'>
            <article className="p-6 gap-10 w-full max-w-300 rounded-md shadow-md border-2 border-gray-400 bg-gray-200/60 h-fit flex flex-col lg:flex-row">
                <div className="min-w-full lg:min-w-1/2 gap-5 flex flex-col">
                    <div className='flex flex-col lg:flex-row items-center justify-center text-center lg:text-start lg:justify-start gap-3'>
                        <IconUserCircle stroke={2} className='bg-primary text-white p-1 size-8 rounded-md min-w-fit'/>
                        <h1 className="text-3xl font-bold">1. Acceso a Examenes</h1>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <h2 className="font-bold">01.</h2>
                        <div>
                            <h2 className="font-bold">Iniciar sesión</h2>
                            <p className='pl'><a href="https://servicios.urjc.es/examenes/alumno/login" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Accede a la plataforma con tus credenciales universitarias </a> para ver tu calendario de exámenes.</p>
                        </div>    
                    </div>
                    <div className='flex flex-row gap-4'>
                        <h2 className="font-bold">02.</h2>
                        <div>
                            <h2 className="font-bold">Descargar el archivo excel</h2>
                            <p className='pl'>Selecciona la opción "Descargar en Excel" para obtener tu calendario de exámenes, también puedes hacerlo tu mismo si cumple con las posiciones de columnas y filas del siguiente<a href="../../public/Examenes.xlsx" download="Examenes.xlsx" className="text-blue-700 hover:underline"> archivo de ejemplo</a>.</p>
                        </div>    
                    </div>
                </div>
                <div className="min-w-full lg:min-w-1/3 gap-8 flex flex-col justify-center">
                    <img src={fotoguia02} alt="Botón de descarga en Excel" className="rounded-md w-full h-auto object-contain" />
                    <img src={fotoguia01} alt="SSO URJC de inicio de sesión" className="rounded-md w-full h-auto object-contain" />
                </div>
            </article>
            <article className="p-6 gap-10 w-full max-w-300 h-fit flex flex-col-reverse lg:flex-row">
                <div className="min-w-full lg:min-w-1/2 gap-8 flex flex-col justify-center">
                    <img src={fotoguia03} alt="Proceso de importación de datos" className="rounded-md w-full h-auto object-contain" />                </div>
                <div className="min-w-full lg:min-w-1/2 gap-5 flex flex-col justify-center">
                    <div className='flex flex-col lg:flex-row items-center justify-center text-center lg:text-start lg:justify-start gap-3'>
                        <IconFileUpload stroke={2} className='bg-primary text-white p-1 size-8 rounded-md min-w-fit'/>
                        <h1 className="text-3xl font-bold">2. Importación de datos</h1>
                    </div>
                    <div className='flex flex-row gap-4'>
                        <h2 className="font-bold">01.</h2>
                        <div>
                            <h2 className="font-bold">Acceder al dashboard</h2>
                            <p className='pl'>Accede a la <NavLink to="/dashboard/importar" className="text-blue-700 hover:underline">página de importar</NavLink> y añade tu archivo de exámenes. Si el sistema no da ningún error, pulsa el botón de importar y se te guiará directamente a la sección "calendario".</p>
                        </div>    
                    </div>
                    <div className='flex flex-row gap-4'>
                        <h2 className="font-bold">02.</h2>
                        <div>
                            <h2 className="font-bold">Usar el calendario</h2>
                            <p className='pl'>En la fecha en la que escribo esta guía, las siguientes funciones están disponibles en el calendario de exámenes.</p>
                            <ul className='list-disc pl-6'>
                                <li>Visualización de exámenes por fecha</li>
                                <li>Filtro por convocatoria.</li>
                                <li>Filtro por examenes pendientes</li>
                            </ul>
                        </div>    
                    </div>
                </div>
            </article>
        </main>
    )
}