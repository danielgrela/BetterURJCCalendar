import { useMemo } from 'react';
import useFileStore from './useFileStore';
import { unirExamenes } from '../scripts/examenPropio';
import type { Examen } from '../types/examen';

// Todo el calendario: lo importado más lo creado a mano. Memorizado para que los useMemo de
// quien lo usa (orden, solapamientos) no se recalculen en cada render
export default function useExamenes(): Examen[] {
  const importados = useFileStore((state) => state.jsonData);
  const propios = useFileStore((state) => state.propios);
  return useMemo(() => unirExamenes(importados, propios), [importados, propios]);
}
