import { describe, expect, it } from 'vitest';
import { claveExamen, diasHasta, nombreAsignatura } from './examen';
import { examen } from './examenDePrueba';

describe('nombreAsignatura', () => {
  it('quita el código entre paréntesis', () => {
    expect(nombreAsignatura(examen())).toBe('BASES DE DATOS');
  });

  it('corta en el primer paréntesis y tolera vacíos', () => {
    expect(nombreAsignatura({ Asignatura: 'FÍSICA (I) (2034002)' })).toBe('FÍSICA');
    expect(nombreAsignatura(null)).toBe('');
  });
});

describe('diasHasta', () => {
  it('cuenta días naturales sin depender de la hora actual', () => {
    const hoy = new Date(2026, 4, 10, 23, 59);
    expect(diasHasta('10-05-2026', hoy)).toBe(0);
    expect(diasHasta('11-05-2026', hoy)).toBe(1);
    expect(diasHasta('09-05-2026', hoy)).toBe(-1);
  });

  it('no se desvía con el cambio de hora de octubre', () => {
    expect(diasHasta('01-11-2026', new Date(2026, 9, 20))).toBe(12);
  });
});

describe('claveExamen', () => {
  it('distingue grupos del mismo examen', () => {
    expect(claveExamen(examen({ CodigoGrupo: 'AT' }))).not.toBe(claveExamen(examen({ CodigoGrupo: 'BT' })));
  });
});
