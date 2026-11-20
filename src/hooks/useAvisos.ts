import { create } from 'zustand';

export interface Aviso {
  texto: string;
  /** Atajo opcional («Deshacer»); lo que hace tiene que poder hacerse también fuera del aviso */
  accion?: { texto: string; onClick: () => void };
}

// Aviso breve tras una acción (p. ej. «Examen eliminado · Deshacer»). Uno cada vez: el nuevo
// sustituye al anterior. Sin persistir: no tiene sentido recuperarlo al recargar
interface AvisosStore {
  aviso: Aviso | null;
  /** Cambia con cada aviso para reiniciar el temporizador aunque el texto se repita */
  id: number;
  mostrarAviso: (aviso: Aviso) => void;
  cerrarAviso: () => void;
}

const useAvisos = create<AvisosStore>()((set) => ({
  aviso: null,
  id: 0,
  mostrarAviso: (aviso) => set((estado) => ({ aviso, id: estado.id + 1 })),
  cerrarAviso: () => set({ aviso: null }),
}));

export default useAvisos;
