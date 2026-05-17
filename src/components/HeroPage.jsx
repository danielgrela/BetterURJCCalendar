import { NavLink } from "react-router-dom";
import Header from "./Header";
import HeroPageMain from "./HeroPageMain";
import Features from "./Features";
import Footer from "./Footer";
import ToggleThemeButton from "./ToggleThemeButton.jsx";
export default function HeroPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col w-full">
        <Header/>
        <HeroPageMain />
        <Features />
        <Footer />
      </main>
      <ToggleThemeButton className="block lg:hidden bottom-8 right-8" />
    </>
  );
};