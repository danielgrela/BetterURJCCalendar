import NextExams from "./NextExams";
import DashboardHeader from "./DashboardHeader";
import PageMeta from "./PageMeta.jsx";
export default function HomePage() {
    return (
        <div className="flex flex-col gap-8">
            <PageMeta titulo="Inicio" noindex />
            <DashboardHeader />
            <NextExams />
        </div>
    )
}
