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

// Los nombres llegan en mayúsculas desde el Excel de la URJC: se pasan a tipo frase para leerse mejor
// (los números romanos, como el «II» de «Estadística II», se quedan en mayúsculas)
export const nombreLegible = (ev: Pick<Examen, 'Asignatura'> | null | undefined): string => {
    const nombre = nombreAsignatura(ev).toLocaleLowerCase('es-ES');
    const frase = nombre.charAt(0).toLocaleUpperCase('es-ES') + nombre.slice(1);
    return frase.replace(/\b(i{1,3}|iv|vi{0,3}|ix|x)\b/g, (romano) => romano.toUpperCase());
};

const DIA_SEMANA = new Intl.DateTimeFormat('es-ES', { weekday: 'short' });
const MES_CORTO = new Intl.DateTimeFormat('es-ES', { month: 'short' });
const FECHA_LARGA = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const sinPunto = (texto: string) => texto.replace('.', '');

// "19-05-2026" → { dia: 19, diaSemana: 'mar', mes: 'may' } para el bloque de fecha de la tarjeta
export const partesFecha = (fecha: string) => {
    const d = parseEventDate(fecha);
    return { dia: d.getDate(), diaSemana: sinPunto(DIA_SEMANA.format(d)), mes: sinPunto(MES_CORTO.format(d)) };
};

// "19-05-2026" → "mar 19 may"
export const fechaCorta = (fecha: string): string => {
    const { dia, diaSemana, mes } = partesFecha(fecha);
    return `${diaSemana} ${dia} ${mes}`;
};

// "19-05-2026" → "martes, 19 de mayo"
export const fechaLarga = (fecha: string): string => FECHA_LARGA.format(parseEventDate(fecha));

// "12:00 - 14:00" → "12:00–14:00" (raya corta de intervalo); si no se puede leer, tal cual
export const horaLegible = (hora: string): string => (hora ?? '').trim().replace(/\s*-\s*/, '–');

// "12:00 - 14:00" → "12:00"
export const horaInicio = (hora: string): string => (hora ?? '').split('-')[0].trim();

// El Excel pone "-" cuando el aula aún no está asignada
export const aulaLegible = (aula: string): string => (!aula || aula.trim() === '-' ? 'Aula sin asignar' : aula);
