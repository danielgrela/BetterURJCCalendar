import NextExams from "./NextExams";
import DashboardHeader from "./DashboardHeader";
import ButtonsExportDashboard from "./ButtonsExportDashboard";
export default function HomePage() {
    return (
        <main className="flex flex-col gap-8">
            <DashboardHeader />
            <NextExams />
            <ButtonsExportDashboard className="flex lg:hidden" />
        </main>
    )
}