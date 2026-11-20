import NextExams from "./NextExams";
import DashboardHeader from "./DashboardHeader";
import PageMeta from "./PageMeta.tsx";
import CambiosCalendario from "./CambiosCalendario";
import TusAsignaturas from "./TusAsignaturas";
import useFileStore from "../hooks/useFileStore";
export default function HomePage() {
    const cambios = useFileStore((state) => state.cambios);
    const descartarCambios = useFileStore((state) => state.descartarCambios);
    const nCambios = cambios.length;
    return (
        <div className="flex flex-col gap-8">
            <PageMeta titulo="Inicio" noindex />
            <DashboardHeader />
            {nCambios > 0 && (
                <CambiosCalendario cambios={cambios} titulo={nCambios === 1 ? 'Tu calendario tiene 1 cambio desde la última importación' : `Tu calendario tiene ${nCambios} cambios desde la última importación`}>
                    <button type="button" onClick={descartarCambios} className="min-h-11 inline-flex items-center justify-center gap-2 px-6 font-medium border border-borde-fuerte bg-superficie text-texto cursor-pointer hover:bg-superficie-alta transition-colors">Entendido</button>
                </CambiosCalendario>
            )}
            <NextExams />
            <TusAsignaturas />
        </div>
    )
}
