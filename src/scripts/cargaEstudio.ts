import { diasHasta } from './examen';
import parseEventDate, { sortedEvents } from './sortEvents';
import type { Examen } from '../types/examen';

export interface Preparacion {
  examen: Examen;
  /** Días para prepararlo: desde el examen pendiente anterior o, si es el primero, desde hoy */
  dias: number;
  /** El examen pendiente anterior; undefined si se cuenta desde hoy */
  anterior?: Examen;
}

export interface SemanaCargada {
  /** Lunes de esa semana */
  lunes: Date;
  examenes: Examen[];
}

export interface CargaEstudio {
  preparacion: Preparacion[];
  /** La semana con más exámenes pendientes (la primera si empatan); null si ninguna tiene dos o más */
  semanaMasCargada: SemanaCargada | null;
}

const UN_DIA = 24 * 60 * 60 * 1000;

function lunesDe(fecha: Date): Date {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
  return lunes;
}

// Cuánto margen hay entre exámenes pendientes, para repartir el estudio. Se pasan los que el
// alumno va a hacer (useExamenesExportables: sin ocultos, aprobados ni «No me presento»)
export function cargaEstudio(examenes: Examen[], hoy: Date = new Date()): CargaEstudio {
  const pendientes = sortedEvents(examenes).filter((ev) => diasHasta(ev.Fecha, hoy) >= 0);

  const preparacion = pendientes.map((examen, i): Preparacion => {
    const anterior = pendientes[i - 1];
    const dias = anterior
      ? Math.round((parseEventDate(examen.Fecha).getTime() - parseEventDate(anterior.Fecha).getTime()) / UN_DIA)
      : diasHasta(examen.Fecha, hoy);
    return { examen, dias, anterior };
  });

  const semanas = new Map<number, SemanaCargada>();
  for (const examen of pendientes) {
    const lunes = lunesDe(parseEventDate(examen.Fecha));
    const semana = semanas.get(lunes.getTime()) ?? { lunes, examenes: [] };
    semana.examenes.push(examen);
    semanas.set(lunes.getTime(), semana);
  }
  const semanaMasCargada = [...semanas.values()].reduce<SemanaCargada | null>(
    (max, semana) => (semana.examenes.length >= 2 && semana.examenes.length > (max?.examenes.length ?? 0) ? semana : max),
    null,
  );

  return { preparacion, semanaMasCargada };
}
