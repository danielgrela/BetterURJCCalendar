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
    expect(filtrarExamenes(lista, { ...FILTROS_INICIALES, convocatoria: 'Junio' }, hoy)).toEqual([junio]);
  });

  it('«Pendientes» deja los de hoy (aunque ya sea tarde) y los futuros', () => {
    expect(filtrarExamenes(lista, { ...FILTROS_INICIALES, fecha: 'Pendientes' }, hoy)).toEqual([deHoy, junio]);
  });

  it('combina los dos filtros', () => {
    expect(filtrarExamenes(lista, { ...FILTROS_INICIALES, convocatoria: 'Mayo', fecha: 'Pendientes' }, hoy)).toEqual([deHoy]);
  });

  it('busca la asignatura sin distinguir tildes ni mayúsculas, también por código', () => {
    const calculo = examen({ Asignatura: 'CÁLCULO (2034001)' });
    const redes = examen({ Asignatura: 'Redes de Ordenadores (2034002)' });
    const conBusqueda = (texto: string) => filtrarExamenes([calculo, redes], { ...FILTROS_INICIALES, texto }, hoy);
    expect(conBusqueda('calculo')).toEqual([calculo]);
    expect(conBusqueda('  REDES ')).toEqual([redes]);
    expect(conBusqueda('2034002')).toEqual([redes]);
    expect(conBusqueda('química')).toEqual([]);
    expect(conBusqueda('')).toEqual([calculo, redes]);
  });
});
