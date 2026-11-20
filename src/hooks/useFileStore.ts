import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { normalizarAula } from '../scripts/handleExcel';
import { sinExamen } from '../scripts/examenPropio';
import { claveExamen } from '../scripts/examen';
import { compararCalendarios, type Cambio } from '../scripts/cambios';
import type { Examen } from '../types/examen';

/** Lo necesario para devolver un examen eliminado a su sitio («Deshacer») */
export interface ExamenEliminado {
  examen: Examen;
  origen: 'importado' | 'propio';
  indice: number;
}

// Para mostrar el calendario entero se usa useExamenes, que une los dos
interface FileStore {
  /** Lo último importado (Excel o .ics); importar otro archivo lo sustituye */
  jsonData: Examen[] | null;
  /** Creados a mano en «Crear examen»; se conservan al importar otro archivo */
  propios: Examen[];
  /** Lo que cambió en la última importación respecto a la anterior; se enseña en Inicio hasta que se descarta */
  cambios: Cambio[];
  /** Sustituye lo importado y apunta los cambios (solo si ya había algo importado) */
  setJsonData: (data: Examen[]) => void;
  descartarCambios: () => void;
  anadirPropio: (examen: Examen) => void;
  /** Quita el examen con esa claveExamen, sea importado o propio; devuelve lo que hace falta para deshacerlo */
  eliminarExamen: (clave: string) => ExamenEliminado | null;
  restaurarExamen: (eliminado: ExamenEliminado) => void;
  /** Sustituye el examen con esa claveExamen (importado o propio) en su misma posición */
  reemplazarExamen: (clave: string, nuevo: Examen) => void;
  /** Borra todo: lo importado y lo creado a mano */
  borrarCalendario: () => void;
}

const useFileStore = create<FileStore>()(persist((set, get) => ({
  jsonData: null,
  propios: [],
  cambios: [],
  setJsonData: (data) => set((estado) => ({ jsonData: data, cambios: estado.jsonData ? compararCalendarios(estado.jsonData, data) : [] })),
  descartarCambios: () => set({ cambios: [] }),
  anadirPropio: (examen) => set((estado) => ({ propios: [...estado.propios, examen] })),
  eliminarExamen: (clave) => {
    const { jsonData, propios } = get();
    const enImportados = (jsonData ?? []).findIndex((ev) => claveExamen(ev) === clave);
    const enPropios = propios.findIndex((ev) => claveExamen(ev) === clave);
    const eliminado: ExamenEliminado | null = enImportados >= 0
      ? { examen: jsonData![enImportados], origen: 'importado', indice: enImportados }
      : enPropios >= 0 ? { examen: propios[enPropios], origen: 'propio', indice: enPropios } : null;
    const importados = sinExamen(jsonData ?? [], clave);
    set({ jsonData: importados.length > 0 ? importados : null, propios: sinExamen(propios, clave) });
    return eliminado;
  },
  reemplazarExamen: (clave, nuevo) => set((estado) => {
    const cambiar = (lista: Examen[]) => lista.map((ev) => (claveExamen(ev) === clave ? nuevo : ev));
    return { jsonData: estado.jsonData ? cambiar(estado.jsonData) : null, propios: cambiar(estado.propios) };
  }),
  restaurarExamen: ({ examen, origen, indice }) => set((estado) => {
    const insertar = (lista: Examen[]) => [...lista.slice(0, indice), examen, ...lista.slice(indice)];
    return origen === 'importado'
      ? { jsonData: insertar(estado.jsonData ?? []) }
      : { propios: insertar(estado.propios) };
  }),
  borrarCalendario: () => set({ jsonData: null, propios: [], cambios: [] })}),
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
