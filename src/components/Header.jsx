import { GitHub } from "../SocialIcons/Github.jsx";
import portfolioicon from "../assets/portfolioicon.png";
import { NavLink } from "react-router-dom";
export default function Header() {
    return (
        <div className="flex flex-row bg-gray-100 dark:bg-gray-800 p-4 lg:px-15 items-center justify-between lg:sticky top-0 z-10 shadow-sm">
            <NavLink to="/" className="text-xl lg:text-3xl font-bold text-primary">
                Better URJC Calendar
            </NavLink>
            <div className="flex flex-row items-center gap-6 *:hover:scale-120 *:transition-all *:duration-200">
                <a href="https://github.com/danielgrela/BetterURJCCalendar" aria-label="Github Repo" target="_blank" rel="noopener noreferrer">
                    <GitHub className="size-8" />
                </a>
                <a href="https://www.danielgrela.com" aria-label="Portfolio" target="_blank" rel="noopener noreferrer">
                    <img src={portfolioicon} alt="Portfolio" className="size-10" />
                </a>
            </div>
        </div>
    );
}