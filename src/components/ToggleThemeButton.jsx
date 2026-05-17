import useDarkMode from '../hooks/useDarkMode.js';
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function ToggleThemeButton({ className = '', ...props }) {
    const { isDark, toggle } = useDarkMode();
    return(
        <button
        onClick={toggle}
        aria-label="Cambiar modo oscuro"
        className={`cursor-pointer fixed z-50 bg-gray-950 dark:bg-white p-3 rounded-full text-white dark:text-black hover:brightness-80 ${className}`}>
      {!isDark ? <IconSun size={22} stroke={2} /> : <IconMoon size={22} stroke={2} />}
      </button>
    )
}