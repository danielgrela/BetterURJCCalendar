import type { Examen } from '../types/examen';

// Examen de ejemplo para los tests; se sobrescriben solo los campos que importan en cada caso
export const examen = (cambios: Partial<Examen> = {}): Examen => ({
  Curso: '3/BT',
  Plan: 'GRADO EN INGENIERÍA INFORMÁTICA (2034) (MÓSTOLES)',
  Asignatura: 'BASES DE DATOS (2034011)',
  CodigoPlan: 2034,
  CodigoAsignatura: 2034011,
  CodigoGrupo: 'BT',
  Convocatoria: 'Mayo',
  Fecha: '11-05-2026',
  Hora: '17:00 - 19:00',
  Aula: 'Aulario III - Aula 002',
  ...cambios,
});
