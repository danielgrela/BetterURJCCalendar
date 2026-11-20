import { claveEstable, aulaLegible, fechaCorta, horaLegible, nombreLegible } from './examen';
import { sortedEvents } from './sortEvents';
import type { Examen } from '../types/examen';

/** Campos que la URJC suele cambiar de una versión del Excel a otra */
export type CampoCambiado = 'Fecha' | 'Hora' | 'Aula';

export type Cambio =
  | { tipo: 'cambiado'; antes: Examen; despues: Examen; campos: CampoCambiado[] }
  | { tipo: 'nuevo'; examen: Examen }
  | { tipo: 'quitado'; examen: Examen };

const CAMPOS: CampoCambiado[] = ['Fecha', 'Hora', 'Aula'];

// Agrupa por claveEstable; si una asignatura tiene dos exámenes en la misma convocatoria y grupo,
// se emparejan por orden de fecha (el primero con el primero)
function porClave(examenes: Examen[]): Map<string, Examen[]> {
  const grupos = new Map<string, Examen[]>();
  for (const ev of sortedEvents(examenes)) {
    const clave = claveEstable(ev);
    grupos.set(clave, [...(grupos.get(clave) ?? []), ev]);
  }
  return grupos;
}

// Lo que cambia al sustituir un calendario por otro, en orden de fecha (la nueva para los
// cambiados y los nuevos; la antigua para los quitados)
export function compararCalendarios(antes: Examen[] | null | undefined, despues: Examen[] | null | undefined): Cambio[] {
  const viejos = porClave(antes ?? []);
  const nuevos = porClave(despues ?? []);
  const cambios: { fecha: Examen; cambio: Cambio }[] = [];
  for (const [clave, lista] of nuevos) {
    const previos = viejos.get(clave) ?? [];
    lista.forEach((ev, i) => {
      const previo = previos[i];
      if (!previo) {
        cambios.push({ fecha: ev, cambio: { tipo: 'nuevo', examen: ev } });
        return;
      }
      const campos = CAMPOS.filter((campo) => String(previo[campo]).trim() !== String(ev[campo]).trim());
      if (campos.length > 0) cambios.push({ fecha: ev, cambio: { tipo: 'cambiado', antes: previo, despues: ev, campos } });
    });
    previos.slice(lista.length).forEach((ev) => cambios.push({ fecha: ev, cambio: { tipo: 'quitado', examen: ev } }));
  }
  for (const [clave, lista] of viejos) {
    if (!nuevos.has(clave)) lista.forEach((ev) => cambios.push({ fecha: ev, cambio: { tipo: 'quitado', examen: ev } }));
  }
  const orden = sortedEvents(cambios.map(({ fecha }) => fecha));
  return cambios
    .sort((a, b) => orden.indexOf(a.fecha) - orden.indexOf(b.fecha))
    .map(({ cambio }) => cambio);
}

const legible: Record<CampoCambiado, (ev: Examen) => string> = {
  Fecha: (ev) => fechaCorta(ev.Fecha),
  Hora: (ev) => horaLegible(ev.Hora),
  Aula: (ev) => aulaLegible(ev.Aula),
};

// Una línea por cambio: «Bases de datos (Mayo): del lun 11 may al mié 13 may; aula: A → B»
export function textoCambio(cambio: Cambio): string {
  if (cambio.tipo === 'nuevo') {
    const { examen } = cambio;
    return `${nombreLegible(examen)} (${examen.Convocatoria}): nuevo, ${fechaCorta(examen.Fecha)}, ${horaLegible(examen.Hora)}`;
  }
  if (cambio.tipo === 'quitado') {
    const { examen } = cambio;
    return `${nombreLegible(examen)} (${examen.Convocatoria}): ya no aparece (era el ${fechaCorta(examen.Fecha)})`;
  }
  const { antes, despues, campos } = cambio;
  const partes = campos.map((campo) => {
    const nombre = campo === 'Fecha' ? 'fecha' : campo === 'Hora' ? 'hora' : 'aula';
    return `${nombre}: ${legible[campo](antes)} → ${legible[campo](despues)}`;
  });
  return `${nombreLegible(despues)} (${despues.Convocatoria}): ${partes.join('; ')}`;
}
