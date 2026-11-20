import { describe, expect, it } from 'vitest';
import { crearCopia, leerCopia, nombreCopia, type DatosCopia } from './copiaSeguridad';
import { examen } from './examenDePrueba';

const datos: DatosCopia = {
  importados: [examen()],
  propios: [examen({ Asignatura: 'Parcial', CodigoAsignatura: 'propio-parcial', Aula: '-' })],
  preferencias: { ocultas: ['2034001'], grupos: { '2034011': 'BT' }, estados: { '2034011|BT|Mayo': 'aprobado' }, aviso: 'ambos' },
};
const ahora = new Date(2026, 10, 20, 10, 30);

describe('copia de seguridad', () => {
  it('se vuelve a leer igual (ida y vuelta)', () => {
    const copia = crearCopia(datos, ahora);
    expect(leerCopia(JSON.stringify(copia))).toEqual(copia);
    expect(copia).toMatchObject({ app: 'better-urjc-calendar', version: 1, fecha: ahora.toISOString(), ...datos });
  });

  it('nombra el archivo con la fecha', () => {
    expect(nombreCopia(ahora)).toBe('better-urjc-calendar-copia-2026-11-20.json');
  });

  it('rechaza lo que no es una copia con un mensaje legible', () => {
    expect(() => leerCopia('no es json')).toThrow('no es una copia de seguridad');
    expect(() => leerCopia(JSON.stringify({ app: 'otra' }))).toThrow('no es una copia de seguridad');
    expect(() => leerCopia(JSON.stringify({ ...crearCopia(datos), version: 99 }))).toThrow('otra versión');
  });

  it('rechaza una copia dañada o vacía', () => {
    const copia = crearCopia(datos, ahora);
    expect(() => leerCopia(JSON.stringify({ ...copia, propios: [{ Asignatura: 'X' }] }))).toThrow('dañada');
    expect(() => leerCopia(JSON.stringify({ ...copia, preferencias: { ...copia.preferencias, estados: { a: 'suspenso' } } }))).toThrow('dañada');
    expect(() => leerCopia(JSON.stringify({ ...copia, importados: null, propios: [] }))).toThrow('ningún examen');
  });

  it('un aviso desconocido vuelve al de por defecto', () => {
    const copia = crearCopia(datos, ahora);
    expect(leerCopia(JSON.stringify({ ...copia, preferencias: { ...copia.preferencias, aviso: 'raro' } })).preferencias.aviso).toBe('1d');
  });
});
