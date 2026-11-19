import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { esOscuro, siguienteTema, temaDeEstado, type Tema } from '../scripts/tema';

interface TemaStore {
  tema: Tema;
  cambiarTema: () => void;
}

const CONSULTA_OSCURO = '(prefers-color-scheme: dark)';

// Pone o quita .dark y data-tema en <html> (el script del <head> ya lo ha hecho al cargar)
function aplicarTema(tema: Tema) {
  const root = document.documentElement;
  root.classList.add('no-transitions');
  root.classList.toggle('dark', esOscuro(tema, window.matchMedia(CONSULTA_OSCURO).matches));
  root.dataset.tema = tema;
  window.setTimeout(() => {
    root.classList.remove('no-transitions');
  }, 0);
}

const useDarkMode = create<TemaStore>()(persist(
  (set) => ({
    tema: 'sistema',
    cambiarTema: () => set((state) => {
      const tema = siguienteTema(state.tema);
      aplicarTema(tema);
      return { tema };
    }),
  }),
  {
    name: 'dark-mode',
    // v0 guardaba { isDark }; v1 guarda { tema }
    version: 1,
    migrate: (estado) => ({ tema: temaDeEstado(estado) }),
    partialize: (state) => ({ tema: state.tema }),
    onRehydrateStorage: () => (state) => {
      if (state) aplicarTema(state.tema);
    },
  }
));

// En 'sistema', seguir los cambios del sistema operativo sin recargar
if (typeof window !== 'undefined') {
  window.matchMedia(CONSULTA_OSCURO).addEventListener('change', () => {
    if (useDarkMode.getState().tema === 'sistema') aplicarTema('sistema');
  });
}

export default useDarkMode;
