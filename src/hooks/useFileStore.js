import { create } from 'zustand';

const useFileStore = create((set) => ({
  jsonData: null,
  setJsonData: (data) => set({ jsonData: data }),
  clearJsonData: () => set({ jsonData: null }),
}));

export default useFileStore;