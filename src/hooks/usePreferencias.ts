import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Aviso } from '../scripts/generateICS';

// Preferencias del alumno sobre su calendario, aparte de los datos (useFileStore): importar
// otro archivo o borrar el calendario no las pierde
interface PreferenciasStore {
  /** Recordatorio de los eventos del .ics exportado; se recuerda la última elección */
  aviso: Aviso;
  setAviso: (aviso: Aviso) => void;
}

const usePreferencias = create<PreferenciasStore>()(persist(
  (set) => ({
    aviso: '1d',
    setAviso: (aviso) => set({ aviso }),
  }),
  { name: 'preferencias' },
));

export default usePreferencias;
