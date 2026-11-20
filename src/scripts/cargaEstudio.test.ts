import { describe, expect, it } from 'vitest';
import { cargaEstudio } from './cargaEstudio';
import { examen } from './examenDePrueba';

const hoy = new Date(2026, 4, 4); // lunes, 4 de mayo de 2026
const en = (fecha: string, codigo: number) => examen({ Fecha: fecha, CodigoAsignatura: codigo, Asignatura: `ASIGNATURA ${codigo} (${codigo})` });

describe('cargaEstudio', () => {
  it('cuenta los días desde hoy para el primero y desde el anterior para el resto', () => {
    const { preparacion } = cargaEstudio([en('14-05-2026', 2), en('11-05-2026', 1), en('14-05-2026', 3)], hoy);
    expect(preparacion.map(({ examen, dias, anterior }) => [examen.CodigoAsignatura, dias, anterior?.CodigoAsignatura])).toEqual([
      [1, 7, undefined],
      [2, 3, 1],
      [3, 0, 2],
    ]);
  });

  it('deja fuera los exámenes que ya han pasado', () => {
    const { preparacion } = cargaEstudio([en('01-05-2026', 1), en('04-05-2026', 2)], hoy);
    expect(preparacion.map(({ examen, dias }) => [examen.CodigoAsignatura, dias])).toEqual([[2, 0]]);
  });

  it('encuentra la semana con más exámenes (de lunes a domingo)', () => {
    const { semanaMasCargada } = cargaEstudio([en('11-05-2026', 1), en('18-05-2026', 2), en('20-05-2026', 3), en('24-05-2026', 4)], hoy);
    expect(semanaMasCargada?.lunes).toEqual(new Date(2026, 4, 18));
    expect(semanaMasCargada?.examenes).toHaveLength(3);
  });

  it('sin una semana con dos o más exámenes no destaca ninguna', () => {
    expect(cargaEstudio([en('11-05-2026', 1), en('18-05-2026', 2)], hoy).semanaMasCargada).toBeNull();
    expect(cargaEstudio([], hoy)).toEqual({ preparacion: [], semanaMasCargada: null });
  });
});
