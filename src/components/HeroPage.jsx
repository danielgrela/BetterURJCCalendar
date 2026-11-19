import Header from "./Header";
import HeroPageMain from "./HeroPageMain";
import Features from "./Features";
import Footer from "./Footer";
import ToggleThemeButton from "./ToggleThemeButton.jsx";
import PageMeta from "./PageMeta.jsx";

const DESCRIPCION = "Convierte el Excel oficial de exámenes de la URJC en tu calendario personal: próximos exámenes, filtros y exportación a Excel e iCal. Gratis y en tu navegador.";

// Datos estructurados para buscadores (schema.org)
const DATOS_ESTRUCTURADOS = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Better URJC Calendar",
  url: "https://betterurjccalendar.danielgrela.com/",
  description: DESCRIPCION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "es",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  author: { "@type": "Person", name: "Daniel Grela", url: "https://www.danielgrela.com" },
};

export default function HeroPage() {
  return (
    <>
      <PageMeta ruta="/" descripcion={DESCRIPCION} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(DATOS_ESTRUCTURADOS) }} />
      <div className="min-h-screen flex flex-col w-full">
        <Header/>
        <main className="flex flex-col w-full">
          <HeroPageMain />
          <Features />
        </main>
        <Footer />
      </div>
      <ToggleThemeButton className="fixed block lg:hidden bottom-8 right-8" />
    </>
  );
};