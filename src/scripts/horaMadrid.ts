// Los exámenes de la URJC son en hora de Madrid. El .ics guarda instantes en UTC, así que la
// conversión se hace con la zona Europe/Madrid y no con la del navegador: un alumno de
// Erasmus o un test con otra TZ tienen que dar la misma hora.
const MADRID = 'Europe/Madrid';

export interface HoraLocal {
  anio: number;
  mes: number;
  dia: number;
  hora: number;
  minuto: number;
}

const formatos = new Map<string, Intl.DateTimeFormat>();

// Lanza RangeError si la zona no es IANA (p. ej. «Romance Standard Time» de Outlook)
function formatoDe(zona: string): Intl.DateTimeFormat {
  let formato = formatos.get(zona);
  if (!formato) {
    formato = new Intl.DateTimeFormat('en-GB', {
      timeZone: zona,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    });
    formatos.set(zona, formato);
  }
  return formato;
}

export function enZona(instante: Date, zona: string): HoraLocal {
  const partes = Object.fromEntries(formatoDe(zona).formatToParts(instante).map(({ type, value }) => [type, Number(value)]));
  return { anio: partes.year, mes: partes.month, dia: partes.day, hora: partes.hour, minuto: partes.minute };
}

const comoUTC = ({ anio, mes, dia, hora, minuto }: HoraLocal) => Date.UTC(anio, mes - 1, dia, hora, minuto);

// Instante en que en esa zona son esa fecha y hora. El desfase con UTC se mide dos veces porque
// la primera se hace en un instante aproximado, que puede caer al otro lado del cambio de hora
export function desdeZona(local: HoraLocal, zona: string): Date {
  const desfase = (ms: number) => comoUTC(enZona(new Date(ms), zona)) - ms;
  const aproximado = comoUTC(local);
  const primero = aproximado - desfase(aproximado);
  return new Date(aproximado - desfase(primero));
}

export const enMadrid = (instante: Date): HoraLocal => enZona(instante, MADRID);
export const desdeMadrid = (local: HoraLocal): Date => desdeZona(local, MADRID);

// Fecha "DD-MM-YYYY" y hora "HH:MM" del Excel (hora de Madrid) → instante en milisegundos UTC
export function instanteExamen(fecha: string, hora: string): number {
  const [dia, mes, anio] = fecha.split('-').map(Number);
  const [h, minuto] = hora.split(':').map(Number);
  return desdeMadrid({ anio, mes, dia, hora: h, minuto }).getTime();
}
