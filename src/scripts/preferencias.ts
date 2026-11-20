import { claveEstable, nombreLegible } from './examen';
import parseEventDate, { sortedEvents } from './sortEvents';
import type { Examen } from '../types/examen';

// Lo que el alumno decide sobre su calendario sin tocar los datos: asignaturas ocultas, el grupo
// que es el suyo y el estado de cada examen. Se guarda aparte (usePreferencias), con claves que
// sobreviven a volver a importar el Excel

/** aprobado: oculta los exámenes posteriores de esa asignatura · no-presento: no se exporta */
export type Estado = 'aprobado' | 'no-presento';

export interface PreferenciasCalendario {
  /** claveAsignatura de las asignaturas ocultas */
  ocultas: string[];
  /** claveAsignatura → CodigoGrupo elegido, si la asignatura viene en varios grupos */
  grupos: Record<string, string>;
  /** claveEstable del examen → estado */
  estados: Record<string, Estado>;
}

export const PREFERENCIAS_VACIAS: PreferenciasCalendario = { ocultas: [], grupos: {}, estados: {} };

export const claveAsignatura = (ev: Pick<Examen, 'CodigoAsignatura'>): string => String(ev.CodigoAsignatura);

export interface Asignatura {
  clave: string;
  nombre: string;
  /** Grupos en los que aparece, ordenados */
  grupos: string[];
  /** Sus exámenes, por fecha */
  examenes: Examen[];
}

// Una entrada por asignatura, por orden alfabético del nombre que se ve
export function asignaturasDe(examenes: Examen[]): Asignatura[] {
  const porClave = new Map<string, Asignatura>();
  for (const ev of sortedEvents(examenes)) {
    const clave = claveAsignatura(ev);
    const asignatura = porClave.get(clave) ?? { clave, nombre: nombreLegible(ev), grupos: [], examenes: [] };
    if (ev.CodigoGrupo && !asignatura.grupos.includes(ev.CodigoGrupo)) asignatura.grupos.push(ev.CodigoGrupo);
    asignatura.examenes.push(ev);
    porClave.set(clave, asignatura);
  }
  return [...porClave.values()]
    .map((a) => ({ ...a, grupos: a.grupos.sort((x, y) => x.localeCompare(y, 'es')) }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export const estadoDe = (ev: Examen, preferencias: PreferenciasCalendario): Estado | undefined =>
  preferencias.estados[claveEstable(ev)];

// Lo que se ve en el calendario: sin asignaturas ocultas, solo el grupo elegido (si ese grupo
// sigue existiendo tras reimportar; si no, todos) y sin los exámenes posteriores a uno aprobado
export function examenesVisibles(examenes: Examen[], preferencias: PreferenciasCalendario): Examen[] {
  const ocultas = new Set(preferencias.ocultas);
  const gruposExistentes = new Set(examenes.map((ev) => `${claveAsignatura(ev)}|${ev.CodigoGrupo}`));
  const aprobadoEl = new Map<string, number>();
  for (const ev of examenes) {
    if (estadoDe(ev, preferencias) !== 'aprobado') continue;
    const clave = claveAsignatura(ev);
    const fecha = parseEventDate(ev.Fecha).getTime();
    aprobadoEl.set(clave, Math.min(aprobadoEl.get(clave) ?? Infinity, fecha));
  }
  return examenes.filter((ev) => {
    const clave = claveAsignatura(ev);
    if (ocultas.has(clave)) return false;
    const grupo = preferencias.grupos[clave];
    if (grupo && gruposExistentes.has(`${clave}|${grupo}`) && ev.CodigoGrupo !== grupo) return false;
    const aprobado = aprobadoEl.get(clave);
    return aprobado === undefined || parseEventDate(ev.Fecha).getTime() <= aprobado;
  });
}

// Lo que se exporta (.ics y Excel): lo visible menos lo marcado «No me presento»
export const examenesExportables = (examenes: Examen[], preferencias: PreferenciasCalendario): Examen[] =>
  examenesVisibles(examenes, preferencias).filter((ev) => estadoDe(ev, preferencias) !== 'no-presento');
