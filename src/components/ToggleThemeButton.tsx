import { useSyncExternalStore } from 'react';
import useDarkMode from '../hooks/useDarkMode';
import { IconDeviceDesktop, IconSun, IconMoon } from '@tabler/icons-react';
import { NOMBRE_TEMA, siguienteTema, type Tema } from '../scripts/tema';

interface Props {
    className?: string;
}

const temaDelServidor = (): Tema => 'sistema';

export default function ToggleThemeButton({ className = '' }: Props) {
    const cambiarTema = useDarkMode((state) => state.cambiarTema);
    // En el prerender y al hidratar vale 'sistema' (mismo HTML en Node y en el navegador); justo después, el guardado
    const tema = useSyncExternalStore(useDarkMode.subscribe, () => useDarkMode.getState().tema, temaDelServidor);
    const etiqueta = `Tema: ${NOMBRE_TEMA[tema]}. Cambiar a ${NOMBRE_TEMA[siguienteTema(tema)]}`;
    return(
        <button
        type="button"
        onClick={cambiarTema}
        aria-label={etiqueta}
        title={etiqueta}
        className={`cursor-pointer z-50 bg-texto p-3 rounded-full text-lienzo hover:brightness-80 ${className}`}>
      {/* El icono sale de data-tema en <html> (lo pone el script del <head>) y no del store: no cambia al hidratar */}
      <IconDeviceDesktop size={22} stroke={2} aria-hidden="true" className="hidden [[data-tema=sistema]_&]:block" />
      <IconSun size={22} stroke={2} aria-hidden="true" className="hidden [[data-tema=claro]_&]:block" />
      <IconMoon size={22} stroke={2} aria-hidden="true" className="hidden [[data-tema=oscuro]_&]:block" />
      </button>
    )
}
