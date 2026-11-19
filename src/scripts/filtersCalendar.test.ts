import { describe, expect, it } from 'vitest';
import { FILTROS_INICIALES, convocatoriasDe, filtrarExamenes } from './filtersCalendar';
import { examen } from './examenDePrueba';

describe('convocatoriasDe', () => {
  it('devuelve cada convocatoria una vez, en orden de curso y las desconocidas al final', () => {
    const lista = ['Junio', 'Mayo', 'Extraordinaria', 'Enero', 'Mayo', 'Septiembre'].map((Convocatoria) => examen({ Convocatoria }));
    expect(convocatoriasDe(lista)).toEqual(['Septiembre', 'Enero', 'Mayo', 'Junio', 'Extraordinaria']);
  });

  it('ignora convocatorias vacías y tolera null', () => {
    expect(convocatoriasDe([examen({ Convocatoria: '' })])).toEqual([]);
    expect(convocatoriasDe(null)).toEqual([]);
  });
});

describe('filtrarExamenes', () => {
  const hoy = new Date(2026, 4, 15, 18, 30);
  const pasado = examen({ Fecha: '11-05-2026', Convocatoria: 'Mayo' });
  const deHoy = examen({ Fecha: '15-05-2026', Convocatoria: 'Mayo' });
  const junio = examen({ Fecha: '20-06-2026', Convocatoria: 'Junio' });
  const lista = [pasado, deHoy, junio];

  it('sin filtros devuelve todos', () => {
    expect(filtrarExamenes(lista, FILTROS_INICIALES, hoy)).toEqual(lista);
  });

  it('filtra por convocatoria', () => {
    expect(filtrarExamenes(lista, { convocatoria: 'Junio', fecha: 'Todos' }, hoy)).toEqual([junio]);
  });

  it('«Pendientes» deja los de hoy (aunque ya sea tarde) y los futuros', () => {
    expect(filtrarExamenes(lista, { convocatoria: '', fecha: 'Pendientes' }, hoy)).toEqual([deHoy, junio]);
  });

  it('combina los dos filtros', () => {
    expect(filtrarExamenes(lista, { convocatoria: 'Mayo', fecha: 'Pendientes' }, hoy)).toEqual([deHoy]);
  });
});
