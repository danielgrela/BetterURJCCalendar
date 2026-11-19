import { GitHub } from "../SocialIcons/Github.tsx";
import portfolioicon from "../assets/portfolioicon.png";
import { NavLink } from 'react-router';
export default function Header() {
    return (
        <header className="flex flex-row bg-lienzo border-b border-borde p-4 lg:px-15 items-center justify-between lg:sticky top-0 z-10 shadow-sm dark:shadow-none">
            <NavLink to="/" className="text-xl lg:text-3xl font-bold text-primary">
                Better URJC Calendar
            </NavLink>
            <div className="flex flex-row items-center gap-6 *:hover:scale-120 *:transition-all *:duration-200">
                <a href="https://github.com/danielgrela/BetterURJCCalendar" aria-label="Repositorio en GitHub" target="_blank" rel="noopener noreferrer">
                    <GitHub className="size-8" />
                </a>
                <a href="https://www.danielgrela.com" aria-label="Portfolio de Daniel Grela" target="_blank" rel="noopener noreferrer">
                    <img src={portfolioicon} alt="" className="size-10" />
                </a>
            </div>
        </header>
    );
}