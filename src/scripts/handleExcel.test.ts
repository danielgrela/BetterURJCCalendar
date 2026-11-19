import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import excelTojson, { normalizarFecha, normalizarHora } from './handleExcel';

describe('normalizarFecha', () => {
  it('acepta texto con -, / o . y rellena con ceros', () => {
    expect(normalizarFecha('11-05-2026')).toBe('11-05-2026');
    expect(normalizarFecha('1/5/2026')).toBe('01-05-2026');
    expect(normalizarFecha(' 01.05.2026 ')).toBe('01-05-2026');
  });

  it('acepta celdas de tipo fecha (UTC) y números de serie de Excel', () => {
    expect(normalizarFecha(new Date(Date.UTC(2026, 4, 11)))).toBe('11-05-2026');
    expect(normalizarFecha(46153)).toBe('11-05-2026');
  });

  it('acepta texto enriquecido y resultados de fórmula', () => {
    expect(normalizarFecha({ richText: [{ text: '11-05-' }, { text: '2026' }] })).toBe('11-05-2026');
    expect(normalizarFecha({ formula: 'A1', result: '11-05-2026' })).toBe('11-05-2026');
  });

  it('devuelve null si no es una fecha válida', () => {
    expect(normalizarFecha('2026-05-11')).toBeNull();
    expect(normalizarFecha('32-05-2026')).toBeNull();
    expect(normalizarFecha('11-13-2026')).toBeNull();
    expect(normalizarFecha(null)).toBeNull();
    expect(normalizarFecha(new Date('no'))).toBeNull();
  });
});

describe('normalizarHora', () => {
  it('deja el formato HH:MM - HH:MM', () => {
    expect(normalizarHora('17:00 - 19:00')).toBe('17:00 - 19:00');
    expect(normalizarHora('9:00-11:30')).toBe('09:00 - 11:30');
    expect(normalizarHora('9.00 a 11.30')).toBe('09:00 - 11:30');
  });

  it('devuelve null si no hay dos horas válidas', () => {
    expect(normalizarHora('17:00')).toBeNull();
    expect(normalizarHora('25:00 - 26:00')).toBeNull();
    expect(normalizarHora(undefined)).toBeNull();
  });
});

describe('excelTojson con public/Examenes.xlsx', () => {
  it('lee el Excel de ejemplo con fechas y horas normalizadas', async () => {
    const datos = await readFile(new URL('../../public/Examenes.xlsx', import.meta.url));
    const examenes = await excelTojson(new File([datos], 'Examenes.xlsx'));
    expect(examenes.length).toBeGreaterThan(0);
    for (const ev of examenes) {
      expect(ev.Fecha).toMatch(/^\d{2}-\d{2}-\d{4}$/);
      expect(ev.Hora).toMatch(/^\d{2}:\d{2} - \d{2}:\d{2}$/);
      expect(ev.Asignatura).not.toBe('');
      expect(ev.Aula).not.toBe('');
    }
  });

  it('da un error legible si el archivo no es un Excel', async () => {
    await expect(excelTojson(new File(['hola'], 'notas.xlsx'))).rejects.toThrow('No se ha podido leer el archivo');
  });
});
