import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Los filtros calculados pertenecen al archivo actual: al cambiar o borrar
// los datos se descartan para no mostrar exámenes del archivo anterior.
const useFileStore = create(persist((set) => ({
  jsonData: null,
  setJsonData: (data) => {
    useFileStoreJsonFilters.getState().clearFilteredData();
    set({ jsonData: data });
  },
  clearJsonData: () => {
    useFileStoreJsonFilters.getState().clearFilteredData();
    set({ jsonData: null });
  }}),
  {name: 'file-storage'})
);
export const useFileStoreJsonFilters = create((set) => ({
  dataFiltered: null,
  setDataFiltered: (data) => set({ dataFiltered: data }),
  clearFilteredData: () => set({ dataFiltered: null })}), 
);

export default useFileStore;
