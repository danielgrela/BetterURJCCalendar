import Header from "./Header";
import HeroPageMain from "./HeroPageMain";
import Features from "./Features";
import Footer from "./Footer";
import ToggleThemeButton from "./ToggleThemeButton.jsx";
import PageMeta from "./PageMeta.jsx";
export default function HeroPage() {
  return (
    <>
      <PageMeta ruta="/" descripcion="Convierte el Excel oficial de exámenes de la URJC en tu calendario personal: próximos exámenes, filtros y exportación a Excel e iCal. Gratis y en tu navegador." />
      <main className="min-h-screen flex flex-col w-full">
        <Header/>
        <HeroPageMain />
        <Features />
        <Footer />
      </main>
      <ToggleThemeButton className="fixed block lg:hidden bottom-8 right-8" />
    </>
  );
};