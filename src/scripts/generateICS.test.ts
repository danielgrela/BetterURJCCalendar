import { createEvents } from 'ics';
import { describe, expect, it } from 'vitest';
import { eventosICS } from './generateICS';
import { icsAExamenes } from './handleICS';
import { desdeMadrid, enMadrid } from './horaMadrid';
import { examen } from './examenDePrueba';

describe('horaMadrid', () => {
  it('pasa la hora de Madrid a UTC en verano (+2) y en invierno (+1)', () => {
    expect(desdeMadrid({ anio: 2026, mes: 5, dia: 11, hora: 17, minuto: 0 }).toISOString()).toBe('2026-05-11T15:00:00.000Z');
    expect(desdeMadrid({ anio: 2026, mes: 1, dia: 12, hora: 9, minuto: 30 }).toISOString()).toBe('2026-01-12T08:30:00.000Z');
  });

  it('acierta junto al cambio de hora de octubre', () => {
    // El 25-10-2026 a las 3:00 (verano) vuelven a ser las 2:00 (invierno)
    expect(desdeMadrid({ anio: 2026, mes: 10, dia: 25, hora: 12, minuto: 0 }).toISOString()).toBe('2026-10-25T11:00:00.000Z');
    expect(desdeMadrid({ anio: 2026, mes: 10, dia: 24, hora: 23, minuto: 0 }).toISOString()).toBe('2026-10-24T21:00:00.000Z');
  });

  it('enMadrid deshace desdeMadrid', () => {
    const local = { anio: 2026, mes: 3, dia: 29, hora: 10, minuto: 15 };
    expect(enMadrid(desdeMadrid(local))).toEqual(local);
  });
});

describe('eventosICS', () => {
  it('crea un evento con la hora de Madrid en UTC', () => {
    const [evento] = eventosICS([examen()]);
    expect(evento).toMatchObject({
      start: Date.UTC(2026, 4, 11, 15, 0),
      end: Date.UTC(2026, 4, 11, 17, 0),
      title: 'BASES DE DATOS (2034011)',
      location: 'Aulario III - Aula 002',
    });
  });

  it('lleva en la descripción todas las columnas del Excel que no van en otro campo', () => {
    const [evento] = eventosICS([examen()]);
    expect(evento.description).toBe([
      'Convocatoria: Mayo',
      'Curso/Grupo: 3/BT',
      'Plan: GRADO EN INGENIERÍA INFORMÁTICA (2034) (MÓSTOLES)',
      'Código plan: 2034',
      'Código asignatura: 2034011',
      'Código grupo: BT',
    ].join('\n'));
  });

  it('usa un texto en lugar de "-" cuando no hay aula', () => {
    const [evento] = eventosICS([examen({ Aula: '-' })]);
    expect(evento.location).toBe('Aula por determinar');
  });

  it('da un UID estable que no depende de la fecha y no repite', () => {
    const [a, b, c] = eventosICS([examen(), examen({ Fecha: '02-06-2026' }), examen({ Convocatoria: 'Junio' })]);
    expect(eventosICS([examen({ Fecha: '20-05-2026' })])[0].uid).toBe(a.uid);
    expect(a.uid).toBe('2034011-BT-Mayo@betterurjccalendar.danielgrela.com');
    expect(b.uid).toBe('2034011-BT-Mayo-2@betterurjccalendar.danielgrela.com');
    expect(c.uid).toBe('2034011-BT-Junio@betterurjccalendar.danielgrela.com');
  });

  it('genera un .ics válido con un VEVENT por examen', () => {
    const { error, value } = createEvents(eventosICS([examen(), examen({ Fecha: '02-06-2026' })]));
    expect(error).toBeFalsy();
    expect(value).toContain('BEGIN:VCALENDAR');
    expect(value).toContain('X-WR-CALNAME:Exámenes URJC');
    expect(value).toContain('DTSTART:20260511T150000Z');
    expect(value?.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  });

  it('sin aviso no añade alarmas', () => {
    const [evento] = eventosICS([examen()]);
    expect(evento.alarms).toBeUndefined();
  });

  it('añade el aviso elegido antes del examen', () => {
    expect(eventosICS([examen()], '1d')[0].alarms).toEqual([{ action: 'display', description: 'Examen: BASES DE DATOS (2034011)', trigger: { hours: 24, before: true } }]);
    expect(eventosICS([examen()], '2h')[0].alarms?.[0].trigger).toEqual({ hours: 2, before: true });
    expect(eventosICS([examen()], 'ambos')[0].alarms).toHaveLength(2);
  });

  it('el .ics con avisos se vuelve a importar igual', () => {
    const original = [examen(), examen({ Fecha: '02-06-2026', Convocatoria: 'Junio' })];
    const { value } = createEvents(eventosICS(original, 'ambos'));
    expect(value?.match(/BEGIN:VALARM/g)).toHaveLength(4);
    expect(value).toContain('TRIGGER:-PT24H');
    expect(value).not.toMatch(/TRIGGER:-P\d+DT\r?\n/);
    expect(value).toContain('TRIGGER:-PT2H');
    expect(icsAExamenes(value ?? '')).toEqual(original);
  });
});
