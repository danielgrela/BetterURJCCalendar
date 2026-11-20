import { describe, expect, it } from 'vitest';
import { enlaceGoogleCalendar } from './googleCalendar';
import { examen } from './examenDePrueba';

const parametros = (enlace: string) => new URL(enlace).searchParams;

describe('enlaceGoogleCalendar', () => {
  it('abre la plantilla de evento con la hora de Madrid pasada a UTC', () => {
    const enlace = enlaceGoogleCalendar(examen());
    expect(enlace.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
    const p = parametros(enlace);
    expect(p.get('action')).toBe('TEMPLATE');
    expect(p.get('text')).toBe('BASES DE DATOS (2034011)');
    // 11 de mayo, 17:00–19:00 en Madrid (verano, +2)
    expect(p.get('dates')).toBe('20260511T150000Z/20260511T170000Z');
    expect(p.get('location')).toBe('Aulario III - Aula 002');
    expect(p.get('ctz')).toBe('Europe/Madrid');
  });

  it('lleva los datos del Excel en la descripción y un texto si no hay aula', () => {
    const p = parametros(enlaceGoogleCalendar(examen({ Aula: '-', Fecha: '12-01-2026', Hora: '09:00 - 11:00' })));
    expect(p.get('details')).toContain('Convocatoria: Mayo\nCurso/Grupo: 3/BT');
    expect(p.get('location')).toBe('Aula por determinar');
    // En invierno Madrid va a +1
    expect(p.get('dates')).toBe('20260112T080000Z/20260112T100000Z');
  });
});
