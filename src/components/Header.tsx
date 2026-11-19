import { GitHub } from "../SocialIcons/Github.tsx";
import portfolioicon from "../assets/portfolioicon.png";
import { NavLink } from 'react-router';
export default function Header() {
    return (
        <header className="flex flex-row bg-lienzo border-b border-borde p-4 lg:px-15 items-center justify-between lg:sticky top-0 z-10 shadow-sm dark:shadow-none">
            <NavLink to="/" className="text-xl lg:text-3xl font-bold text-primary">
                Better URJC Calendar
            </NavLink>
            <div className="flex flex-row items-center gap-2">
                <a className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-superficie-alta transition-colors" href="https://github.com/danielgrela/BetterURJCCalendar" aria-label="Repositorio en GitHub" target="_blank" rel="noopener noreferrer">
                    <GitHub className="size-8" />
                </a>
                <a className="inline-flex size-11 items-center justify-center rounded-sm hover:bg-superficie-alta transition-colors" href="https://www.danielgrela.com" aria-label="Portfolio de Daniel Grela" target="_blank" rel="noopener noreferrer">
                    <img src={portfolioicon} alt="" className="size-9" />
                </a>
            </div>
        </header>
    );
}