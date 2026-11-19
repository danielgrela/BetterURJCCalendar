import { describe, expect, it } from 'vitest';
import parseEventDate, { sortedEvents, mesDelProximoExamen, hayExamenesEnMes } from './sortEvents';
import { examen } from './examenDePrueba';

describe('parseEventDate', () => {
  it('lee DD-MM-YYYY como fecha local a medianoche', () => {
    expect(parseEventDate('11-05-2026')).toEqual(new Date(2026, 4, 11));
  });

  it('devuelve la época si falta la fecha o está mal formada', () => {
    expect(parseEventDate(undefined)).toEqual(new Date(0));
    expect(parseEventDate('')).toEqual(new Date(0));
    expect(parseEventDate('2026/05/11')).toEqual(new Date(0));
  });
});

describe('sortedEvents', () => {
  it('ordena por fecha y, dentro del día, por hora', () => {
    const a = examen({ Fecha: '12-05-2026', Hora: '09:00 - 11:00' });
    const b = examen({ Fecha: '11-05-2026', Hora: '17:00 - 19:00' });
    const c = examen({ Fecha: '11-05-2026', Hora: '09:00 - 11:00' });
    expect(sortedEvents([a, b, c])).toEqual([c, b, a]);
  });

  it('compara fechas reales, no texto (01-06 va después de 30-05)', () => {
    const junio = examen({ Fecha: '01-06-2026' });
    const mayo = examen({ Fecha: '30-05-2026' });
    expect(sortedEvents([junio, mayo])).toEqual([mayo, junio]);
  });

  it('no modifica el array original y tolera null', () => {
    const lista = [examen({ Fecha: '12-05-2026' }), examen({ Fecha: '11-05-2026' })];
    const copia = [...lista];
    sortedEvents(lista);
    expect(lista).toEqual(copia);
    expect(sortedEvents(null)).toEqual([]);
  });
});

describe('mesDelProximoExamen', () => {
  const hoy = new Date(2026, 4, 15);

  it('abre en el mes del próximo examen', () => {
    const lista = [examen({ Fecha: '11-05-2026' }), examen({ Fecha: '02-06-2026' })];
    expect(mesDelProximoExamen(lista, hoy)).toEqual(new Date(2026, 5, 1));
  });

  it('cuenta como próximo un examen de hoy', () => {
    expect(mesDelProximoExamen([examen({ Fecha: '15-05-2026' })], hoy)).toEqual(new Date(2026, 4, 1));
  });

  it('si ya pasaron todos, abre en el mes del último', () => {
    const lista = [examen({ Fecha: '20-01-2026' }), examen({ Fecha: '11-05-2026' })];
    expect(mesDelProximoExamen(lista, hoy)).toEqual(new Date(2026, 4, 1));
  });

  it('sin exámenes, abre en el mes de hoy', () => {
    expect(mesDelProximoExamen([], hoy)).toEqual(new Date(2026, 4, 1));
  });
});

describe('hayExamenesEnMes', () => {
  it('detecta exámenes del mes indicado (mes 0 = enero)', () => {
    const lista = [examen({ Fecha: '11-05-2026' })];
    expect(hayExamenesEnMes(lista, 2026, 4)).toBe(true);
    expect(hayExamenesEnMes(lista, 2026, 5)).toBe(false);
    expect(hayExamenesEnMes(null, 2026, 4)).toBe(false);
  });
});
