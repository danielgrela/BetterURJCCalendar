import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDarkMode = create(persist(
  (set) => ({
    isDark: false,
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
      if (state?.isDark) {
        document.documentElement.classList.add('dark');
      }
    },
  }
));

export default useDarkMode;
