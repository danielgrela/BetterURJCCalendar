import ButtonsExportDashboard from "./ButtonsExportDashboard";
// En móvil la cabecera usa display: contents para que los botones bajen al final del dashboard
export default function DashboardHeader() {
    return (
        <div className="contents lg:flex lg:flex-row gap-4 justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl lg:text-5xl font-bold">Dashboard</h1>
                <p className="text-sm lg:text-base text-texto-suave">Aquí puedes ver los próximos exámenes y eventos relacionados con tu calendario académico.</p>
            </div>
            <ButtonsExportDashboard className="flex order-last lg:order-none" />            
        </div>
    )
}
