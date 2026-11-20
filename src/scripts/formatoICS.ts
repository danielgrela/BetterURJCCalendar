import type { Examen } from '../types/examen';

// Formato propio del .ics que comparten generateICS y handleICS (aparte para que importar no
// cargue la librería ics, que solo hace falta al exportar)

// Campos del Excel que van en la descripción, una línea «Etiqueta: valor» por campo, con los
// nombres de la cabecera del Excel de la URJC. Así se leen en cualquier calendario y handleICS
// puede recuperar el examen entero al importar. Asignatura, fecha, hora y aula ya van en
// SUMMARY, DTSTART/DTEND y LOCATION
export const CAMPOS_DESCRIPCION = [
  { etiqueta: 'Convocatoria', campo: 'Convocatoria' },
  { etiqueta: 'Curso/Grupo', campo: 'Curso' },
  { etiqueta: 'Plan', campo: 'Plan' },
  { etiqueta: 'Código plan', campo: 'CodigoPlan' },
  { etiqueta: 'Código asignatura', campo: 'CodigoAsignatura' },
  { etiqueta: 'Código grupo', campo: 'CodigoGrupo' },
] as const satisfies readonly { etiqueta: string; campo: keyof Examen }[];

export const AULA_SIN_ASIGNAR = 'Aula por determinar';
