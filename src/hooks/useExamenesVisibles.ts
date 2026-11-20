import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useExamenes from './useExamenes';
import usePreferencias from './usePreferencias';
import { examenesExportables, examenesVisibles, type PreferenciasCalendario } from '../scripts/preferencias';
import type { Examen } from '../types/examen';

function usePreferenciasCalendario(): PreferenciasCalendario {
  return usePreferencias(useShallow(({ ocultas, grupos, estados }) => ({ ocultas, grupos, estados })));
}

// Lo que se enseña en Inicio y en el calendario: sin asignaturas ocultas, otros grupos ni lo
// posterior a un aprobado. ocultos = cuántos se han quitado (para avisar de que faltan)
export function useExamenesVisibles(): { visibles: Examen[]; ocultos: number } {
  const examenes = useExamenes();
  const preferencias = usePreferenciasCalendario();
  return useMemo(() => {
    const visibles = examenesVisibles(examenes, preferencias);
    return { visibles, ocultos: examenes.length - visibles.length };
  }, [examenes, preferencias]);
}

// Lo que se exporta: lo visible menos lo marcado «No me presento»
export function useExamenesExportables(): Examen[] {
  const examenes = useExamenes();
  const preferencias = usePreferenciasCalendario();
  return useMemo(() => examenesExportables(examenes, preferencias), [examenes, preferencias]);
}
