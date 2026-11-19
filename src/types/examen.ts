// Un examen tal y como sale de handleExcel (y se guarda en localStorage)
export interface Examen {
  Curso: string;
  Plan: string;
  /** Nombre con el código entre paréntesis; para mostrar, nombreAsignatura(ev) */
  Asignatura: string;
  /** Número en el Excel de la URJC; texto si la celda era texto */
  CodigoPlan: number | string;
  CodigoAsignatura: number | string;
  CodigoGrupo: string;
  /** Septiembre, Enero, Mayo o Junio (puede llegar otra) */
  Convocatoria: string;
  /** "DD-MM-YYYY"; parsear con parseEventDate */
  Fecha: string;
  /** "HH:MM - HH:MM" */
  Hora: string;
  /** "-" si no hay aula asignada */
  Aula: string;
}

export interface FiltrosCalendario {
  /** '' = todas */
  convocatoria: string;
  fecha: 'Todos' | 'Pendientes';
}
