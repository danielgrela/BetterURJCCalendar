import { IconFileUpload, IconInfoCircle, IconExclamationCircle, IconHelpCircle } from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
import { useState} from 'react';
import excelToJson from '../scripts/handleExcel';
import { NavLink, useNavigate } from 'react-router-dom';
export default function ImportPage() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [jsonAuxData, setJsonAuxData] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const setJsonData = useFileStore((state) => state.setJsonData);
    const jsonDataState = useFileStore((state) => state.jsonData);
    const navigate = useNavigate();
    const handleFileChange = async (e) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFile(file);
            try{
                const data = await excelToJson(file);
                setJsonAuxData(data);
                if(data.length === 0) {
                    throw new Error("El archivo no contiene elementos. Por favor verifica el formato del archivo.");
                    return;
                }
                if(!data[0].Fecha || !data[0].Hora || !data[0].Asignatura || !data[0].Plan || !data[0].Aula || !data[0].Convocatoria) {
                    throw new Error("El formato del archivo es incorrecto. Asegúrate de que el archivo tenga las columnas: Fecha, Hora, Asignatura, Plan, Aula y Convocatoria.");
                    return;
                }
                setError(null);
                setDisabled(false);
            }
            catch(error) {
                console.error("Error al procesar el archivo:", error);
                setError("ERROR: " + error.message);
                setDisabled(true);
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Por favor, selecciona un archivo antes de importar.");
            return;
        }
        try {
            setJsonData(jsonAuxData);
            navigate('/dashboard/calendario');
        } catch (error) {
            console.error("Error al importar el archivo:", error);
            setError("ERROR: " + error.message );
        }
    };
    return (
        <div className='px-4 lg:px-0 min-h-full flex flex-col'>
            <h1 className="text-3xl font-bold dark:text-gray-100">Importar Calendario de Exámenes</h1>
            <div className='flex flex-row gap-1 items-center text-center mt-3'>
                <IconHelpCircle size={16} className="inline-block text-gray-500 dark:text-gray-500 mr-1" />
                <p className="text-neutro text-sm">¿Tienes dudas? puedes ver esta <NavLink to="/dashboard/guia-de-uso" className="text-blue-700 hover:underline">guía de uso</NavLink></p>
            </div>
            <form className="relative mt-6 flex flex-col bg-white dark:bg-gray-950 h-full py-10 px-10 lg:px-20 lg:h-4/5 rounded shadow-sm gap-8 lg:gap-10">
            <div className='flex flex-col gap-4'>
                <input
                onChange={handleFileChange}
                    id="exam-file"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="sr-only"/>
                <label
                    htmlFor="exam-file"
                    className="border-2 border-dashed border-gray-300  rounded-lg px-6 py-14 text-center cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-200">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900">
                        <IconFileUpload stroke={2} />
                    </div>
                    <p className="font-semibold">Arrastra tu archivo de examenes aqui o haz clic para buscar</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Formatos soportados: el archivo .xlsx original de <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">examenes</a> </p>
                </label>
                {file && <p className="text-start text-sm text-secundario font-medium">Archivo seleccionado: {file.name}</p>}
                {error && <p className="text-start text-sm text-red-500 font-medium">{error}</p>}
                </div>
                <div className='flex flex-col gap-6'>
                    {jsonDataState && jsonDataState.length > 0 && (
                        <div className="text-sm text-secundario dark:text-gray-300 border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 rounded-sm p-4 gap-4 flex flex-row items-center">
                            <IconExclamationCircle stroke={2} />
                            <p>Ya tiene un calendario, importar otro lo sobreescribirá.</p>
                        </div>
                    )}
                    <div className="text-sm text-secundario dark:text-gray-300 border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 rounded-sm p-4 gap-4 flex flex-row">
                        <IconInfoCircle stroke={2} />
                        <div className='flex flex-col gap-2'>
                            <h4 className="font-semibold">Instrucciones de formato:</h4>
                            <p>Asegúrate de que el archivo contenga <NavLink to="/dashboard/guia-de-uso" className="text-blue-700 hover:underline">guía de uso</NavLink> y que los datos estén en el formato correcto.</p>
                        </div>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} disabled={disabled} className="disabled:brightness-75 disabled:cursor-not-allowed hover:brightness-90 hidden lg:block cursor-pointer bg-primary self-end w-38 text-white px-8 py-2 rounded hover:bg-primary-dark">Importar</button>
                <button type="submit" onClick={handleSubmit} disabled={disabled} className="disabled:brightness-75 lg:hidden cursor-pointer bg-primary text-white dark:text-black px-8 py-2 rounded hover:bg-primary-dark">Importar</button>
            </form>
        </div>
        )
    }
