import { NavLink, useLocation } from 'react-router';
import GatoImagen from "../assets/404img.jpg";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import { IconCalendarEvent, IconHome2 } from "@tabler/icons-react";
import ToggleThemeButton from "./ToggleThemeButton.tsx";
import PageMeta from "./PageMeta.tsx";
export default function NotFound() {
    const { pathname } = useLocation();
    return (
        <div className="bg-superficie flex flex-col min-h-screen">
            <PageMeta titulo="Página no encontrada" noindex />
            <ToggleThemeButton className="fixed block lg:hidden bottom-8 right-8" />
            <Header />
            {/* En escritorio, foto y texto en dos columnas para que el titular y los botones quepan sin hacer scroll */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-16 lg:py-20 flex flex-col items-center justify-center gap-6 text-center lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12 lg:text-left">
                <img src={GatoImagen} alt="" className="w-1/2 max-w-xs lg:w-full lg:max-w-none shadow-sm dark:shadow-none" />
                <div className="flex flex-col items-center lg:items-start gap-4 text-balance">
                    <p className="text-sm font-semibold text-primary">Error 404</p>
                    <h1 className="text-3xl lg:text-5xl font-bold">¡Ups! Parece que te has perdido</h1>
                    <p className="text-base lg:text-lg text-texto-suave">
                        No hay ninguna página en <code className="px-1 rounded-sm bg-superficie-alta text-texto break-all">{pathname}</code>. Puede que el enlace esté mal escrito o sea antiguo.
                    </p>
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mt-4">
                        <NavLink to="/dashboard" className="min-h-11 inline-flex items-center justify-center gap-2 px-6 py-2 whitespace-nowrap font-medium bg-primary text-sobre-primary hover:brightness-90">
                            <IconCalendarEvent stroke={2} aria-hidden="true" />
                            Ir al calendario
                        </NavLink>
                        <NavLink to="/" className="min-h-11 px-2 inline-flex gap-2 items-center font-medium text-enlace hover:underline">
                            <IconHome2 stroke={2} aria-hidden="true" />
                            Inicio
                        </NavLink>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
