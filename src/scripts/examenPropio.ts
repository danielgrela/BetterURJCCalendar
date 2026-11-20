import { claveExamen, nombreLegible } from './examen';
import { normalizarAula } from './handleExcel';
import type { Examen } from '../types/examen';

// Exámenes creados a mano desde «Crear examen». Se guardan con el mismo formato que los del
// Excel para que el calendario, los solapamientos y la exportación no tengan que distinguirlos.

/** Lo que da el formulario: fecha de <input type="date"> ("YYYY-MM-DD") y horas de <input type="time"> ("HH:MM") */
export interface DatosExamen {
  asignatura: string;
  fecha: string;
  inicio: string;
  fin: string;
  aula: string;
  convocatoria: string;
  curso: string;
  plan: string;
}

export const CONVOCATORIAS_URJC = ['Septiembre', 'Enero', 'Mayo', 'Junio'];

// Franjas que se ofrecen como atajo si aún no hay exámenes de los que sacarlas
const FRANJAS_HABITUALES = ['09:00 - 11:00', '12:00 - 14:00', '15:00 - 17:00', '17:00 - 19:00'];

const dosCifras = (n: number) => String(n).padStart(2, '0');
const normalizar = (texto: string) => texto.trim().toLocaleLowerCase('es-ES');

// Convocatoria de la URJC a la que pertenece una fecha "YYYY-MM-DD" (diciembre–febrero: Enero;
// marzo–mayo: Mayo; junio–julio: Junio; el resto: Septiembre). '' si la fecha no se puede leer
export function convocatoriaPorFecha(fecha: string): string {
  const mes = Number(/^\d{4}-(\d{2})-\d{2}$/.exec(fecha)?.[1]);
  if (!mes) return '';
  if (mes === 12 || mes <= 2) return 'Enero';
  if (mes <= 5) return 'Mayo';
  if (mes <= 7) return 'Junio';
  return 'Septiembre';
}

// "09:00" + 120 → "11:00"; sin pasar de las 23:59 para no saltar al día siguiente
export function sumarMinutos(hora: string, minutos: number): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hora);
  if (!m) return '';
  const total = Math.min(Number(m[1]) * 60 + Number(m[2]) + minutos, 23 * 60 + 59);
  return `${dosCifras(Math.floor(total / 60))}:${dosCifras(total % 60)}`;
}

// Valores distintos ordenados de más a menos usados (empate: el primero que apareció). Sin vacíos ni "-"
export function masFrecuentes(valores: string[], max: number): string[] {
  const cuentas = new Map<string, number>();
  for (const valor of valores.map((v) => v?.trim() ?? '')) {
    if (valor && valor !== '-') cuentas.set(valor, (cuentas.get(valor) ?? 0) + 1);
  }
  return [...cuentas].sort((a, b) => b[1] - a[1]).slice(0, max).map(([valor]) => valor);
}

// Franjas más repetidas de los exámenes, en orden de hora, para elegir la hora de un toque
export function franjasFrecuentes(examenes: Examen[], max = 4): string[] {
  const validas = examenes.map((ev) => ev.Hora).filter((h) => /^\d{2}:\d{2} - \d{2}:\d{2}$/.test(h));
  const franjas = validas.length > 0 ? masFrecuentes(validas, max) : FRANJAS_HABITUALES.slice(0, max);
  return franjas.sort();
}

// Una asignatura por nombre legible (el que se ve en las tarjetas), para sugerirla y reutilizar sus datos
export function asignaturasConocidas(examenes: Examen[]): Map<string, Examen> {
  const porNombre = new Map<string, Examen>();
  for (const ev of examenes) {
    const clave = normalizar(nombreLegible(ev));
    if (clave && !porNombre.has(clave)) porNombre.set(clave, ev);
  }
  return porNombre;
}

export const buscarAsignatura = (examenes: Examen[], nombre: string): Examen | undefined =>
  asignaturasConocidas(examenes).get(normalizar(nombre));

// null si se puede crear; si no, el mensaje que se enseña
export function errorEnDatos(datos: DatosExamen): string | null {
  if (!datos.asignatura.trim()) return 'Escribe el nombre de la asignatura.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) return 'Elige la fecha del examen.';
  if (!/^\d{2}:\d{2}$/.test(datos.inicio) || !/^\d{2}:\d{2}$/.test(datos.fin)) return 'Indica la hora de inicio y la de fin.';
  if (datos.fin <= datos.inicio) return 'La hora de fin tiene que ser posterior a la de inicio.';
  return null;
}

const codigo = (texto: string | undefined): number | string => (texto && /^\d+$/.test(texto) ? Number(texto) : texto ?? '');

// Si la asignatura ya está en el calendario se reutilizan su nombre completo y su código, para que
// cuente como la misma (solapamientos, UID del .ics). Si no, el código se inventa a partir del
// nombre: así dos asignaturas propias distintas no se toman por el mismo examen en otro grupo
export function crearExamen(datos: DatosExamen, conocidos: Examen[]): Examen {
  const conocida = buscarAsignatura(conocidos, datos.asignatura);
  const curso = datos.curso.trim();
  const plan = datos.plan.trim();
  const [anio, mes, dia] = datos.fecha.split('-');
  return {
    Curso: curso,
    Plan: plan,
    Asignatura: conocida?.Asignatura ?? datos.asignatura.trim(),
    CodigoPlan: conocida && conocida.Plan === plan ? conocida.CodigoPlan : codigo(plan.match(/\((\d+)\)/)?.[1]),
    CodigoAsignatura: conocida?.CodigoAsignatura ?? `propio-${normalizar(datos.asignatura).replace(/\s+/g, '-')}`,
    // En el Excel el curso es "3/BT": lo que va tras la barra es el grupo
    CodigoGrupo: curso.split('/')[1]?.trim() ?? '',
    Convocatoria: datos.convocatoria || convocatoriaPorFecha(datos.fecha),
    Fecha: `${dia}-${mes}-${anio}`,
    Hora: `${datos.inicio} - ${datos.fin}`,
    Aula: normalizarAula(datos.aula),
  };
}

export const unirExamenes = (importados: Examen[] | null | undefined, propios: Examen[] | null | undefined): Examen[] =>
  [...(importados ?? []), ...(propios ?? [])];

export const sinExamen = (examenes: Examen[], clave: string): Examen[] =>
  examenes.filter((ev) => claveExamen(ev) !== clave);
