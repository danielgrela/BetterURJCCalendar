import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Aviso } from '../scripts/generateICS';
import type { Estado, PreferenciasCalendario } from '../scripts/preferencias';

// Preferencias del alumno sobre su calendario, aparte de los datos (useFileStore): importar
// otro archivo o borrar el calendario no las pierde. Para saber qué se ve o se exporta, usar
// useExamenesVisibles / useExamenesExportables
interface PreferenciasStore extends PreferenciasCalendario {
  /** Recordatorio de los eventos del .ics exportado; se recuerda la última elección */
  aviso: Aviso;
  setAviso: (aviso: Aviso) => void;
  /** Oculta o vuelve a mostrar una asignatura (por claveAsignatura) */
  setOculta: (asignatura: string, oculta: boolean) => void;
  /** null = todos los grupos */
  setGrupo: (asignatura: string, grupo: string | null) => void;
  /** Por claveEstable del examen; null lo deja pendiente */
  setEstado: (examen: string, estado: Estado | null) => void;
  /** Sustituye ocultas, grupos y estados de una vez (copia de seguridad) */
  setPreferenciasCalendario: (preferencias: PreferenciasCalendario) => void;
}

const sin = <T,>(registro: Record<string, T>, clave: string): Record<string, T> =>
  Object.fromEntries(Object.entries(registro).filter(([k]) => k !== clave));

const usePreferencias = create<PreferenciasStore>()(persist(
  (set) => ({
    aviso: '1d',
    ocultas: [],
    grupos: {},
    estados: {},
    setAviso: (aviso) => set({ aviso }),
    setOculta: (asignatura, oculta) => set((estado) => ({
      ocultas: oculta ? [...new Set([...estado.ocultas, asignatura])] : estado.ocultas.filter((a) => a !== asignatura),
    })),
    setGrupo: (asignatura, grupo) => set((estado) => ({
      grupos: grupo ? { ...estado.grupos, [asignatura]: grupo } : sin(estado.grupos, asignatura),
    })),
    setEstado: (examen, nuevo) => set((estado) => ({
      estados: nuevo ? { ...estado.estados, [examen]: nuevo } : sin(estado.estados, examen),
    })),
    setPreferenciasCalendario: ({ ocultas, grupos, estados }) => set({ ocultas, grupos, estados }),
  }),
  { name: 'preferencias' },
));

export default usePreferencias;
