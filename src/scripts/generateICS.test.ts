import { createEvents } from 'ics';
import { describe, expect, it } from 'vitest';
import { eventosICS } from './generateICS';
import { examen } from './examenDePrueba';

describe('eventosICS', () => {
  it('crea un evento con fecha, hora de inicio y de fin', () => {
    const [evento] = eventosICS([examen()]);
    expect(evento).toMatchObject({
      start: [2026, 5, 11, 17, 0],
      end: [2026, 5, 11, 19, 0],
      title: 'BASES DE DATOS (2034011)',
      location: 'Aulario III - Aula 002',
    });
    expect(evento.description).toContain('Convocatoria: Mayo');
  });

  it('usa un texto en lugar de "-" cuando no hay aula', () => {
    const [evento] = eventosICS([examen({ Aula: '-' })]);
    expect(evento.location).toBe('Aula por determinar');
  });

  it('genera un .ics válido con un VEVENT por examen', () => {
    const { error, value } = createEvents(eventosICS([examen(), examen({ Fecha: '02-06-2026' })]));
    expect(error).toBeFalsy();
    expect(value).toContain('BEGIN:VCALENDAR');
    expect(value?.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  });
});
