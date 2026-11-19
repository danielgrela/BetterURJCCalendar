import parseEventDate from './sortEvents';
import type { Examen } from '../types/examen';

// La asignatura llega con el código entre paréntesis: se muestra solo el nombre
export const nombreAsignatura = (ev: Pick<Examen, 'Asignatura'> | null | undefined): string => (ev?.Asignatura ?? '').split('(')[0].trim();

export const diasHasta = (fecha: string, hoy: Date = new Date()): number => {
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return Math.round((parseEventDate(fecha).getTime() - inicioHoy.getTime()) / (1000 * 60 * 60 * 24));
};

// Clave estable para listas de React (el grupo evita choques si se importan varios grupos)
export const claveExamen = (ev: Examen): string => [ev.CodigoAsignatura, ev.CodigoGrupo, ev.Fecha, ev.Hora].join('|');
