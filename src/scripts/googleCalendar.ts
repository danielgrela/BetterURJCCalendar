import { AULA_SIN_ASIGNAR, CAMPOS_DESCRIPCION } from './formatoICS';
import { instanteExamen } from './horaMadrid';
import type { Examen } from '../types/examen';

// Plantilla pública de «Crear evento» de Google Calendar: no usa ninguna API ni cuenta. Los datos
// del examen solo salen del navegador si el alumno abre el enlace
const PLANTILLA = 'https://calendar.google.com/calendar/render';

// 20260511T150000Z: el formato que espera el parámetro dates (instante en UTC)
const utcCompacto = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function enlaceGoogleCalendar(examen: Examen): string {
  const [horaInicio, horaFin] = examen.Hora.split(' - ');
  const parametros = new URLSearchParams({
    action: 'TEMPLATE',
    text: examen.Asignatura,
    dates: `${utcCompacto(instanteExamen(examen.Fecha, horaInicio))}/${utcCompacto(instanteExamen(examen.Fecha, horaFin))}`,
    // Misma descripción que el .ics, para que se lea igual en cualquier calendario
    details: CAMPOS_DESCRIPCION.map(({ etiqueta, campo }) => `${etiqueta}: ${examen[campo]}`).join('\n'),
    location: examen.Aula !== '-' ? examen.Aula : AULA_SIN_ASIGNAR,
    ctz: 'Europe/Madrid',
  });
  return `${PLANTILLA}?${parametros}`;
}
