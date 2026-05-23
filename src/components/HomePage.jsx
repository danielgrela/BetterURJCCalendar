import NextExams from "./NextExams";
import DashboardHeader from "./DashboardHeader";
export default function HomePage() {
    return (
        <main className="flex flex-col gap-8">
            <DashboardHeader />
            <NextExams />
        </main>
    )
}