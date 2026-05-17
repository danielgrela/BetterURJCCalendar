import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDarkMode = create(persist(
  (set) => ({
    isDark: false,
    toggle: () => set((state) => {
      const next = !state.isDark;
      document.documentElement.classList.toggle('dark', next);
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
