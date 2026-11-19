import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizarAula } from '../scripts/handleExcel';
import type { Examen } from '../types/examen';

interface FileStore {
  jsonData: Examen[] | null;
  setJsonData: (data: Examen[]) => void;
  clearJsonData: () => void;
}

const useFileStore = create<FileStore>()(persist((set) => ({
  jsonData: null,
  setJsonData: (data) => set({ jsonData: data }),
  clearJsonData: () => set({ jsonData: null })}),
  {
    name: 'file-storage',
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
