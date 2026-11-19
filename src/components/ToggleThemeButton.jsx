import useDarkMode from '../hooks/useDarkMode';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function ToggleThemeButton({ className = '' }) {
    const toggle = useDarkMode((state) => state.toggle);
    return(
        <button
        onClick={toggle}
        aria-label="Cambiar modo oscuro"
        className={`cursor-pointer z-50 bg-gray-950 dark:bg-white p-3 rounded-full text-white dark:text-black hover:brightness-80 ${className}`}>
      {/* El icono sale de la clase .dark y no del store: mismo HTML en el prerender y al hidratar */}
      <IconSun size={22} stroke={2} className="dark:hidden" />
      <IconMoon size={22} stroke={2} className="hidden dark:block" />
      </button>
    )
}