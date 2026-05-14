import { IconFileUpload, IconInfoCircle } from '@tabler/icons-react';
import useFileStore from '../hooks/useFileStore';
import { useState} from 'react';
import excelToJson from '../scripts/handleExcel';
import { useNavigate } from 'react-router-dom';
export function ImportPage() {
    const [file, setFile] = useState(null);
    const setJsonData = useFileStore((state) => state.setJsonData);
    const navigate = useNavigate();
    const handleFileChange = (e) => {
    console.log(e.target.files);
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
        setFile(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Por favor, selecciona un archivo antes de importar.");
            return;
        }
        try {
            const jsonData = await excelToJson(file);
            setJsonData(jsonData);
            navigate('/dashboard/calendario');
        } catch (error) {
            console.error("Error al importar el archivo:", error);
            alert("Hubo un error al importar el archivo. Por favor, verifica que el formato sea correcto.");
        }
    };
    return (
        <div className='px-4 lg:px-0 h-full flex flex-col'>
            <h1 className="text-3xl font-bold">Importar Calendario de Exámenes</h1>
            <p className="mt-4 text-neutro">Carga tu archivo de calendario de <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">examenes</a> para importarlo directamente.</p>
            <form className="relative mt-6 flex flex-col bg-white py-10 px-10 lg:px-20 h-full lg:h-4/5 rounded shadow-sm gap-8 lg:gap-12">
            <div className='flex flex-col gap-4'>
                <input
                onChange={handleFileChange}
                    id="exam-file"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="sr-only"/>
                <label
                    htmlFor="exam-file"
                    className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-14 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        <IconFileUpload stroke={2} />
                    </div>
                    <p className="font-semibold">Arrastra tu archivo de examenes aqui o haz clic para buscar</p>
                    <p className="mt-1 text-sm text-gray-500">Formatos soportados: el .xlsx original de <a href="https://servicios.urjc.es/examenes/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">examenes</a> </p>
                </label>
                {file && <p className="text-start text-sm text-secundario font-medium">Archivo seleccionado: {file.name}</p>}
                </div>
                <div className="text-sm text-secundario border border-gray-400 bg-gray-100 rounded-sm p-4 gap-4 flex flex-row">
                    <IconInfoCircle stroke={2} />
                    <div className='flex flex-col gap-2'>
                        <h4 className="font-semibold">Instrucciones de formato:</h4>
                        <p>Asegúrate de que el archivo tenga el formato correcto para evitar errores.</p>
                    </div>
                </div>
                <button type="submit" onClick={handleSubmit} className=" cursor-pointer absolute bottom-15 right-15 bg-primary text-white px-8 py-2 rounded hover:bg-primary-dark">Importar</button>
            </form>
        </div>
        )
    }
