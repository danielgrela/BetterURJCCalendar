import { useState, useSyncExternalStore } from 'react';
import useDarkMode, { sistemaOscuro, suscribirTema } from '../hooks/useDarkMode';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { temaEfectivo, temaOpuesto, type Tema } from '../scripts/tema';

interface Props {
    className?: string;
}

const temaDelServidor = (): Tema => 'claro';
const temaDelNavegador = (): Tema => temaEfectivo(useDarkMode.getState().tema, sistemaOscuro());

// Keyframes en index.css. El nombre cambia con .dark, y eso es lo que relanza la animación.
// Clases escritas enteras: Tailwind no ve las que se montan con plantillas
const ANIMACION_SOL = 'animate-[icono-tema-entra_500ms_cubic-bezier(0.34,1.56,0.64,1)] dark:animate-[icono-tema-sale_500ms_cubic-bezier(0.4,0,1,1)]';
const ANIMACION_LUNA = 'animate-[icono-tema-sale_500ms_cubic-bezier(0.4,0,1,1)] dark:animate-[icono-tema-entra_500ms_cubic-bezier(0.34,1.56,0.64,1)]';

export default function ToggleThemeButton({ className = '' }: Props) {
    const cambiarTema = useDarkMode((state) => state.cambiarTema);
    // En el prerender y al hidratar vale 'claro' (mismo HTML en Node y en el navegador); justo después, el real
    const tema = useSyncExternalStore(suscribirTema, temaDelNavegador, temaDelServidor);
    // Solo se anima tras pulsar: ni al cargar la página ni cuando cambia el tema del sistema
    const [animar, setAnimar] = useState(false);
    const etiqueta = `Tema: ${tema}. Cambiar a ${temaOpuesto(tema)}`;
    const alPulsar = () => {
        cambiarTema();
        setAnimar(true);
    };
    return(
        <button
        type="button"
        onClick={alPulsar}
        aria-label={etiqueta}
        title={etiqueta}
        className={`cursor-pointer z-50 bg-texto p-3 rounded-full text-lienzo shadow-md ring-2 ring-lienzo hover:brightness-80 dark:shadow-none ${className}`}>
      {/* El icono visible sale de .dark en <html> (lo pone el script del <head>) y no del store: no cambia al hidratar */}
      <span className="relative block size-[22px]">
        <IconSun size={22} stroke={2} aria-hidden="true"
          className={`absolute inset-0 dark:rotate-90 dark:scale-0 dark:opacity-0 ${animar ? ANIMACION_SOL : ''}`} />
        <IconMoon size={22} stroke={2} aria-hidden="true"
          className={`absolute inset-0 -rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100 ${animar ? ANIMACION_LUNA : ''}`} />
      </span>
      </button>
    )
}
