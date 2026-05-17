import { NavLink } from "react-router-dom";
import GatoImagen from "../assets/404img.jpg";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { IconLayoutDashboard, IconHome2, IconFileUpload } from "@tabler/icons-react";
import ToggleThemeButton from "./ToggleThemeButton.jsx";
export default function NotFound() {
    return (
        <div className="bg-white dark:bg-gray-950 flex flex-col min-h-screen">
            <ToggleThemeButton className="block lg:hidden bottom-8 right-8" />
            <Header />
            <main className="text-balance py-20 w-full px-2 lg:w-1/2 flex flex-col items-center justify-center gap-4 mx-auto text-center">
                <img src={GatoImagen} alt="404 Not Found" className="w-1/2 lg:w-full max-w-md shadow-lg" />
                <h1 className="text-3xl lg:text-5xl font-bold">¡Ups! Parece que te has perdido</h1>
                <p className="text-base lg:text-xl text-gray-700 dark:text-gray-300">La página que buscas no existe o ha sido movida a una nueva ubicación dentro del sitio web.</p>
                <div className="flex flex-col lg:flex-row items-center gap-8 mt-8">
                    <NavLink to="/dashboard" className="inline-block px-9 py-7 hover:brightness-80 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                        <IconLayoutDashboard className="inline-block mr-2" />
                        Volver al dashboard
                    </NavLink>
                    <div className="flex flex-row gap-4">
                        <NavLink to="/" className="flex flex-row gap-2 hover:brightness-80 text-primary">
                            <IconHome2 stroke={2} />
                            Inicio
                        </NavLink>
                        <p className="text-gray-400 dark:text-gray-600 text-lg cursor-default">|</p>
                        <NavLink to="/dashboard/importar" className="flex flex-row gap-2 hover:brightness-80 text-primary">
                            <IconFileUpload stroke={2} />
                            Importar
                        </NavLink>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}