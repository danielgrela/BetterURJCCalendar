import { useSyncExternalStore } from 'react';
import useDarkMode, { sistemaOscuro, suscribirTema } from '../hooks/useDarkMode';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { temaEfectivo, temaOpuesto, type Tema } from '../scripts/tema';

interface Props {
    className?: string;
}

const temaDelServidor = (): Tema => 'claro';
const temaDelNavegador = (): Tema => temaEfectivo(useDarkMode.getState().tema, sistemaOscuro());

export default function ToggleThemeButton({ className = '' }: Props) {
    const cambiarTema = useDarkMode((state) => state.cambiarTema);
    // En el prerender y al hidratar vale 'claro' (mismo HTML en Node y en el navegador); justo después, el real
    const tema = useSyncExternalStore(suscribirTema, temaDelNavegador, temaDelServidor);
    const etiqueta = `Tema: ${tema}. Cambiar a ${temaOpuesto(tema)}`;
    return(
        <button
        type="button"
        onClick={cambiarTema}
        aria-label={etiqueta}
        title={etiqueta}
        className={`cursor-pointer z-50 bg-texto p-3 rounded-full text-lienzo hover:brightness-80 ${className}`}>
      {/* El icono sale de .dark en <html> (lo pone el script del <head>) y no del store: no cambia al hidratar */}
      <IconSun size={22} stroke={2} aria-hidden="true" className="dark:hidden" />
      <IconMoon size={22} stroke={2} aria-hidden="true" className="hidden dark:block" />
      </button>
    )
}
