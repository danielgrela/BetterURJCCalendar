import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizarAula } from '../scripts/handleExcel';
import { sinExamen } from '../scripts/examenPropio';
import type { Examen } from '../types/examen';

// Para mostrar el calendario entero se usa useExamenes, que une los dos
interface FileStore {
  /** Lo último importado (Excel o .ics); importar otro archivo lo sustituye */
  jsonData: Examen[] | null;
  /** Creados a mano en «Crear examen»; se conservan al importar otro archivo */
  propios: Examen[];
  setJsonData: (data: Examen[]) => void;
  anadirPropio: (examen: Examen) => void;
  /** Quita el examen con esa claveExamen, sea importado o propio */
  eliminarExamen: (clave: string) => void;
  /** Borra todo: lo importado y lo creado a mano */
  borrarCalendario: () => void;
}

const useFileStore = create<FileStore>()(persist((set) => ({
  jsonData: null,
  propios: [],
  setJsonData: (data) => set({ jsonData: data }),
  anadirPropio: (examen) => set((estado) => ({ propios: [...estado.propios, examen] })),
  eliminarExamen: (clave) => set((estado) => {
    const importados = sinExamen(estado.jsonData ?? [], clave);
    return { jsonData: importados.length > 0 ? importados : null, propios: sinExamen(estado.propios, clave) };
  }),
  borrarCalendario: () => set({ jsonData: null, propios: [] })}),
  {
    name: 'file-storage',
    // Lo guardado antes de existir «propios» no lo trae: persist lo completa con el estado inicial ([])
    // v1: las aulas pegadas o repetidas del Excel se separan (normalizarAula) también en lo ya importado
    version: 1,
    migrate: (guardado) => {
      const estado = guardado as Partial<FileStore> | null;
      const jsonData = Array.isArray(estado?.jsonData)
        ? estado.jsonData.map((ev) => ({ ...ev, Aula: normalizarAula(ev.Aula) }))
        : null;
      return { ...estado, jsonData } as FileStore;
    },
  })
);

export default useFileStore;
