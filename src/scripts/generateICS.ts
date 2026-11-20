import * as ics from 'ics';
import { descargarBlob } from './descargarBlob';
import { desdeMadrid } from './horaMadrid';
import type { Examen } from '../types/examen';

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

const DOMINIO_UID = 'betterurjccalendar.danielgrela.com';

// UID sin fecha ni hora: si la URJC mueve un examen, volver a importar el .ics en Google,
// Apple u Outlook actualiza el evento en lugar de duplicarlo. Si una asignatura tiene dos
// exámenes en la misma convocatoria y grupo, el segundo lleva un sufijo para no pisar al primero
function uids(examenes: Examen[]): string[] {
  const vistos = new Map<string, number>();
  return examenes.map((examen) => {
    const base = [examen.CodigoAsignatura, examen.CodigoGrupo, examen.Convocatoria]
      .map((parte) => String(parte).normalize('NFD').replace(/[^A-Za-z0-9]+/g, ''))
      .join('-');
    const veces = (vistos.get(base) ?? 0) + 1;
    vistos.set(base, veces);
    return `${veces > 1 ? `${base}-${veces}` : base}@${DOMINIO_UID}`;
  });
}

function instante(fecha: string, hora: string): number {
  const [dia, mes, anio] = fecha.split('-').map(Number);
  const [h, minuto] = hora.split(':').map(Number);
  return desdeMadrid({ anio, mes, dia, hora: h, minuto }).getTime();
}

export const eventosICS = (examenes: Examen[]): ics.EventAttributes[] => {
  const ids = uids(examenes);
  return examenes.map((examen, i): ics.EventAttributes => {
    const [horaInicio, horaFin] = examen.Hora.split(' - ');
    return {
      uid: ids[i],
      title: examen.Asignatura,
      description: CAMPOS_DESCRIPCION.map(({ etiqueta, campo }) => `${etiqueta}: ${examen[campo]}`).join('\n'),
      location: examen.Aula !== '-' ? examen.Aula : AULA_SIN_ASIGNAR,
      start: instante(examen.Fecha, horaInicio),
      startInputType: 'utc',
      startOutputType: 'utc',
      end: instante(examen.Fecha, horaFin),
      endInputType: 'utc',
      endOutputType: 'utc',
      productId: 'Better URJC Calendar',
      calName: 'Exámenes URJC',
    };
  });
};

export const descargarCalendarioICS = (examenesJSON: Examen[] | null | undefined): void => {
  if (!examenesJSON || examenesJSON.length === 0) {
    console.warn("El JSON de exámenes está vacío o no es válido.");
    return;
  }
  ics.createEvents(eventosICS(examenesJSON), (error, value) => {
    if (error || !value) {
      console.error("Error al generar el archivo ICS:", error);
      return;
    }
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    descargarBlob(blob, 'horario_examenes.ics');
  });
};
