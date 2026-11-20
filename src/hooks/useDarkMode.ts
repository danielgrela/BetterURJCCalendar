import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { preferenciaDeEstado, temaEfectivo, temaOpuesto, type Preferencia, type Tema } from '../scripts/tema';

interface TemaStore {
  // null hasta que la persona pulsa el botón por primera vez: mientras tanto manda el sistema
  tema: Preferencia;
  cambiarTema: () => void;
}

const CONSULTA_OSCURO = '(prefers-color-scheme: dark)';

export function sistemaOscuro(): boolean {
  return window.matchMedia(CONSULTA_OSCURO).matches;
}

// Pone o quita .dark en <html> (el script del <head> ya lo ha hecho al cargar)
function aplicarTema(tema: Tema) {
  const root = document.documentElement;
  root.classList.add('no-transitions');
  root.classList.toggle('dark', tema === 'oscuro');
  window.setTimeout(() => {
    root.classList.remove('no-transitions');
  }, 0);
}

const useDarkMode = create<TemaStore>()(persist(
  (set) => ({
    tema: null,
    // Cambia al contrario del que se ve ahora (sea elegido o del sistema) y lo deja guardado
    cambiarTema: () => set((state) => {
      const tema = temaOpuesto(temaEfectivo(state.tema, sistemaOscuro()));
      aplicarTema(tema);
      return { tema };
    }),
  }),
  {
    name: 'dark-mode',
    // v0 guardaba { isDark }; v1, { tema } con 'sistema' como opción; v2, { tema: 'claro' | 'oscuro' | null }
    version: 2,
    migrate: (estado) => ({ tema: preferenciaDeEstado(estado) }),
    partialize: (state) => ({ tema: state.tema }),
    onRehydrateStorage: () => (state) => {
      if (state) aplicarTema(temaEfectivo(state.tema, sistemaOscuro()));
    },
  }
));

// Sin preferencia guardada, seguir los cambios del sistema operativo sin recargar
if (typeof window !== 'undefined') {
  window.matchMedia(CONSULTA_OSCURO).addEventListener('change', (evento) => {
    if (useDarkMode.getState().tema === null) aplicarTema(evento.matches ? 'oscuro' : 'claro');
  });
}

// Para useSyncExternalStore: avisa tanto si cambia la preferencia como si cambia el tema del sistema
export function suscribirTema(aviso: () => void): () => void {
  const consulta = window.matchMedia(CONSULTA_OSCURO);
  const quitarStore = useDarkMode.subscribe(aviso);
  consulta.addEventListener('change', aviso);
  return () => {
    quitarStore();
    consulta.removeEventListener('change', aviso);
  };
}

export default useDarkMode;
