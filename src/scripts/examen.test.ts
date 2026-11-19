import { describe, expect, it } from 'vitest';
import { aulaLegible, claveExamen, diasHasta, fechaCorta, fechaLarga, horaInicio, horaLegible, nombreAsignatura, nombreLegible, partesFecha } from './examen';
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

describe('formato legible', () => {
  it('pasa el nombre a tipo frase y respeta los números romanos', () => {
    expect(nombreLegible(examen())).toBe('Bases de datos');
    expect(nombreLegible({ Asignatura: 'ESTADISTICA EMPRESARIAL II (2097)' })).toBe('Estadistica empresarial II');
    expect(nombreLegible({ Asignatura: 'DISEÑO Y ANALISIS DE ALGORITMOS (1)' })).toBe('Diseño y analisis de algoritmos');
    expect(nombreLegible({ Asignatura: 'FISICA IV (1)' })).toBe('Fisica IV');
  });

  it('da la fecha como en una agenda', () => {
    expect(partesFecha('19-05-2026')).toEqual({ dia: 19, diaSemana: 'mar', mes: 'may' });
    expect(fechaCorta('12-01-2026')).toBe('lun 12 ene');
    expect(fechaLarga('19-05-2026')).toBe('martes, 19 de mayo');
  });

  it('da la hora con raya de intervalo y la de inicio', () => {
    expect(horaLegible('12:00 - 14:00')).toBe('12:00–14:00');
    expect(horaInicio('12:00 - 14:00')).toBe('12:00');
  });

  it('dice que el aula no está asignada cuando viene "-"', () => {
    expect(aulaLegible('-')).toBe('Aula sin asignar');
    expect(aulaLegible('Aulario I - Aula 005')).toBe('Aulario I - Aula 005');
  });
});
