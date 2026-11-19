import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DarkModeStore {
  isDark: boolean;
  toggle: () => void;
}

// El script del <head> (scripts/temaInicial.ts) ya ha puesto o quitado .dark antes de pintar:
// si no hay nada guardado, se parte de lo que decidió (prefers-color-scheme)
const oscuroAlCargar = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

const useDarkMode = create<DarkModeStore>()(persist(
  (set) => ({
    isDark: oscuroAlCargar,
    toggle: () => set((state) => {
      const next = !state.isDark;
      const root = document.documentElement;
      root.classList.add('no-transitions');
      document.documentElement.classList.toggle('dark', next);
      window.setTimeout(() => {
        root.classList.remove('no-transitions');
      }, 0);
      return { isDark: next };
    }),
  }),
  {
    name: 'dark-mode',
    onRehydrateStorage: () => (state) => {
      if (state) {
        document.documentElement.classList.toggle('dark', state.isDark);
      }
    },
  }
));

export default useDarkMode;
