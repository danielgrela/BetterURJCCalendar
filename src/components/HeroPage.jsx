import { NavLink } from "react-router-dom";
import Header from "./Header";
import HeroPageMain from "./HeroPageMain";
import Features from "./Features";
import Footer from "./Footer";
export default function HeroPage() {
  return (
    <main className="min-h-screen flex flex-col w-full">
      <Header/>
      <HeroPageMain />
      <Features />
      <Footer />
    </main>
  );
};