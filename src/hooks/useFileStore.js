import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFileStore = create(persist((set) => ({
  jsonData: null,
  setJsonData: (data) => set({ jsonData: data }),
  clearJsonData: () => set({ jsonData: null })}), {name: 'file-storage'})
);

export default useFileStore;