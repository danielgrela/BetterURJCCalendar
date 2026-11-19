import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  {name: 'file-storage'})
);

export default useFileStore;
