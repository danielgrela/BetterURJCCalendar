import * as ics from 'ics';
import { descargarBlob } from './descargarBlob';
import type { Examen } from '../types/examen';
export const descargarCalendarioICS = (examenesJSON: Examen[] | null | undefined): void => {
  if (!examenesJSON || examenesJSON.length === 0) {
    console.warn("El JSON de exámenes está vacío o no es válido.");
    return;
  }
  const eventosParaICS = examenesJSON.map((examen): ics.EventAttributes => {
    const [dia, mes, anio] = examen.Fecha.split('-').map(Number);
    const [horaInicioStr, horaFinStr] = examen.Hora.split(' - ');
    const [horaInicio, minInicio] = horaInicioStr.split(':').map(Number);
    const [horaFin, minFin] = horaFinStr.split(':').map(Number);

    return {
      title: examen.Asignatura,
      description: `Convocatoria: ${examen.Convocatoria}\nCurso: ${examen.Curso} (Grupo ${examen.CodigoGrupo})\nPlan: ${examen.Plan}`,
      location: examen.Aula !== "-" ? examen.Aula : "Aula por determinar",
      start: [anio, mes, dia, horaInicio, minInicio],
      end: [anio, mes, dia, horaFin, minFin],
    };
  });
  ics.createEvents(eventosParaICS, (error, value) => {
    if (error || !value) {
      console.error("Error al generar el archivo ICS:", error);
      return;
    }
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    descargarBlob(blob, 'horario_examenes.ics');
  });
};