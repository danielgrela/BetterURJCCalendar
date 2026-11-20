// Los exámenes de la URJC son en hora de Madrid. El .ics guarda instantes en UTC, así que la
// conversión se hace con la zona Europe/Madrid y no con la del navegador: un alumno de
// Erasmus o un test con otra TZ tienen que dar la misma hora.
const ZONA = 'Europe/Madrid';

export interface HoraLocal {
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
}

const formato = new Intl.DateTimeFormat('en-GB', {
  timeZone: ZONA,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

export function enMadrid(instante: Date): HoraLocal {
  const partes = Object.fromEntries(formato.formatToParts(instante).map(({ type, value }) => [type, Number(value)]));
  return { anio: partes.year, mes: partes.month, dia: partes.day, hora: partes.hour, minuto: partes.minute };
}

const comoUTC = ({ anio, mes, dia, hora, minuto }: HoraLocal) => Date.UTC(anio, mes - 1, dia, hora, minuto);

// Diferencia (ms) entre la hora de Madrid y UTC en ese instante: +1 h en invierno, +2 h en verano
const desfase = (ms: number) => comoUTC(enMadrid(new Date(ms))) - ms;

// Instante en que en Madrid son esa fecha y hora. Se recalcula el desfase una vez porque el
// primero se mide en un instante aproximado, que puede caer al otro lado del cambio de hora
export function desdeMadrid(local: HoraLocal): Date {
  const aproximado = comoUTC(local);
  const primero = aproximado - desfase(aproximado);
  return new Date(aproximado - desfase(primero));
}
