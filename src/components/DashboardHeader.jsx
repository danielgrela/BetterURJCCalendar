import ButtonsExportDashboard from "./ButtonsExportDashboard";
export default function DashboardHeader() {
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl lg:text-5xl font-bold dark:text-gray-100">Dashboard</h1>
                <p className="text-sm lg:text-base text-neutral dark:text-gray-400">Aquí puedes ver los próximos exámenes y eventos relacionados con tu calendario académico.</p>
            </div>
            <ButtonsExportDashboard className="hidden lg:flex" />            
        </div>
    )
}