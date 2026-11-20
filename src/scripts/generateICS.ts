import * as ics from 'ics';
import { descargarBlob } from './descargarBlob';
import { AULA_SIN_ASIGNAR, CAMPOS_DESCRIPCION, type Aviso } from './formatoICS';
import { instanteExamen } from './horaMadrid';
import type { Examen } from '../types/examen';

const DOMINIO_UID = 'betterurjccalendar.danielgrela.com';

// VALARM de tipo display: Google, Apple y Outlook lo convierten en su notificación habitual.
// El día va como 24 horas: con { days: 1 } la librería escribe «-P1DT», que no es una duración
// válida (tras la T tiene que haber horas, minutos o segundos) y algún calendario la rechaza
function alarmas(aviso: Aviso, asignatura: string): ics.Alarm[] {
  const avisoDe = (trigger: ics.DurationObject): ics.Alarm => ({ action: 'display', description: `Examen: ${asignatura}`, trigger: { ...trigger, before: true } });
  if (aviso === '1d') return [avisoDe({ hours: 24 })];
  if (aviso === '2h') return [avisoDe({ hours: 2 })];
  if (aviso === 'ambos') return [avisoDe({ hours: 24 }), avisoDe({ hours: 2 })];
  return [];
}

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

export const eventosICS = (examenes: Examen[], aviso: Aviso = 'ninguno'): ics.EventAttributes[] => {
  const ids = uids(examenes);
  return examenes.map((examen, i): ics.EventAttributes => {
    const [horaInicio, horaFin] = examen.Hora.split(' - ');
    const avisos = alarmas(aviso, examen.Asignatura);
    return {
      uid: ids[i],
      title: examen.Asignatura,
      description: CAMPOS_DESCRIPCION.map(({ etiqueta, campo }) => `${etiqueta}: ${examen[campo]}`).join('\n'),
      location: examen.Aula !== '-' ? examen.Aula : AULA_SIN_ASIGNAR,
      start: instanteExamen(examen.Fecha, horaInicio),
      startInputType: 'utc',
      startOutputType: 'utc',
      end: instanteExamen(examen.Fecha, horaFin),
      endInputType: 'utc',
      endOutputType: 'utc',
      productId: 'Better URJC Calendar',
      calName: 'Exámenes URJC',
      ...(avisos.length > 0 ? { alarms: avisos } : {}),
    };
  });
};

export const descargarCalendarioICS = (examenesJSON: Examen[] | null | undefined, aviso: Aviso = 'ninguno'): void => {
  if (!examenesJSON || examenesJSON.length === 0) {
    console.warn("El JSON de exámenes está vacío o no es válido.");
    return;
  }
  ics.createEvents(eventosICS(examenesJSON, aviso), (error, value) => {
    if (error || !value) {
      console.error("Error al generar el archivo ICS:", error);
      return;
    }
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    descargarBlob(blob, 'horario_examenes.ics');
  });
};
