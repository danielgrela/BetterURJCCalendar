import { describe, expect, it } from 'vitest';
import { codificarCalendario, codigoDeHash, decodificarCalendario, enlaceCompartido } from './compartir';
import { examen } from './examenDePrueba';

const calendario = [
  examen(),
  examen({ Asignatura: 'CÁLCULO (2034001)', CodigoAsignatura: 2034001, Fecha: '12-01-2026', Hora: '09:00 - 11:00', Aula: '-', Convocatoria: 'Enero' }),
  examen({ Asignatura: 'Parcial de redes', CodigoAsignatura: 'propio-parcial-de-redes', CodigoPlan: '' }),
];

describe('enlace compartido', () => {
  it('se decodifica igual que se codificó (ida y vuelta) y solo usa caracteres seguros en una URL', async () => {
    const codigo = await codificarCalendario(calendario);
    expect(codigo).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await decodificarCalendario(codigo)).toEqual(calendario);
  });

  it('comprime: 24 exámenes del mismo plan caben en un enlace corto', async () => {
    const muchos = Array.from({ length: 24 }, (_, i) => examen({ Fecha: `${String(i + 1).padStart(2, '0')}-05-2026`, CodigoAsignatura: 2034000 + i }));
    expect((await codificarCalendario(muchos)).length).toBeLessThan(1500);
  });

  it('arma el enlace a Importar y lee el código del hash', () => {
    expect(enlaceCompartido('https://ejemplo.com', 'abc')).toBe('https://ejemplo.com/dashboard/importar#c=abc');
    expect(codigoDeHash('#c=abc')).toBe('abc');
    expect(codigoDeHash('#c=')).toBeNull();
    expect(codigoDeHash('#asignaturas')).toBeNull();
  });

  it('rechaza un enlace roto o con datos que no son exámenes', async () => {
    await expect(decodificarCalendario('esto-no-vale')).rejects.toThrow('incompleto o dañado');
    const codigo = await codificarCalendario(calendario);
    await expect(decodificarCalendario(codigo.slice(0, 20))).rejects.toThrow('incompleto o dañado');
  });
});
