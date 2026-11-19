import * as ics from 'ics';
import { descargarBlob } from './descargarBlob';
export const descargarCalendarioICS = (examenesJSON) => {
  if (!examenesJSON || examenesJSON.length === 0) {
    console.warn("El JSON de exámenes está vacío o no es válido.");
    return;
  }
  const eventosParaICS = examenesJSON.map(examen => {
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
    if (error) {
      console.error("Error al generar el archivo ICS:", error);
      return;
    }
    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    descargarBlob(blob, 'horario_examenes.ics');
  });
};