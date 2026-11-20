import { describe, expect, it } from 'vitest';
import { claveExamen } from './examen';
import { examen } from './examenDePrueba';
import { detectarSolapamientos } from './solapamientos';
import {
  asignaturasConocidas, convocatoriaPorFecha, crearExamen, datosDeExamen, editarExamen, errorEnDatos, franjasFrecuentes,
  masFrecuentes, sinExamen, sumarMinutos, unirExamenes, type DatosExamen,
} from './examenPropio';

const datos = (cambios: Partial<DatosExamen> = {}): DatosExamen => ({
  asignatura: 'Robótica',
  fecha: '2026-06-15',
  inicio: '10:00',
  fin: '12:00',
  aula: '',
  convocatoria: '',
  curso: '3/BT',
  plan: 'GRADO EN INGENIERÍA INFORMÁTICA (2034) (MÓSTOLES)',
  ...cambios,
});

describe('convocatoriaPorFecha', () => {
  it('lleva cada mes a su convocatoria de la URJC', () => {
    expect(convocatoriaPorFecha('2026-01-20')).toBe('Enero');
    expect(convocatoriaPorFecha('2025-12-18')).toBe('Enero');
    expect(convocatoriaPorFecha('2026-05-11')).toBe('Mayo');
    expect(convocatoriaPorFecha('2026-07-01')).toBe('Junio');
    expect(convocatoriaPorFecha('2026-09-03')).toBe('Septiembre');
    expect(convocatoriaPorFecha('')).toBe('');
  });
});

describe('sumarMinutos', () => {
  it('suma sin pasar de medianoche', () => {
    expect(sumarMinutos('09:30', 120)).toBe('11:30');
    expect(sumarMinutos('23:00', 120)).toBe('23:59');
    expect(sumarMinutos('', 120)).toBe('');
  });
});

describe('masFrecuentes y franjasFrecuentes', () => {
  it('ordena por uso e ignora vacíos y "-"', () => {
    expect(masFrecuentes(['3/AT', '3/BT', '3/BT', '', '-', '3/AT', '3/BT'], 5)).toEqual(['3/BT', '3/AT']);
    expect(masFrecuentes(['a', 'b', 'c'], 2)).toEqual(['a', 'b']);
  });

  it('da las franjas más usadas en orden de hora, o unas habituales sin datos', () => {
    const examenes = [examen({ Hora: '17:00 - 19:00' }), examen({ Hora: '09:00 - 11:00' }), examen({ Hora: '17:00 - 19:00' }), examen({ Hora: 'raro' })];
    expect(franjasFrecuentes(examenes)).toEqual(['09:00 - 11:00', '17:00 - 19:00']);
    expect(franjasFrecuentes([], 2)).toEqual(['09:00 - 11:00', '12:00 - 14:00']);
  });
});

describe('asignaturasConocidas', () => {
  it('indexa por el nombre que se ve, sin repetir grupos', () => {
    const mapa = asignaturasConocidas([examen(), examen({ CodigoGrupo: 'AT' })]);
    expect([...mapa.keys()]).toEqual(['bases de datos']);
  });
});

describe('errorEnDatos', () => {
  it('pide lo obligatorio y que la hora de fin sea posterior', () => {
    expect(errorEnDatos(datos())).toBeNull();
    expect(errorEnDatos(datos({ asignatura: '  ' }))).toMatch(/asignatura/);
    expect(errorEnDatos(datos({ fecha: '' }))).toMatch(/fecha/);
    expect(errorEnDatos(datos({ fin: '' }))).toMatch(/hora/);
    expect(errorEnDatos(datos({ fin: '10:00' }))).toMatch(/posterior/);
  });
});

describe('crearExamen', () => {
  it('da un examen con el formato del Excel', () => {
    expect(crearExamen(datos({ aula: 'Aulario I - Aula 101' }), [])).toEqual({
      Curso: '3/BT',
      Plan: 'GRADO EN INGENIERÍA INFORMÁTICA (2034) (MÓSTOLES)',
      Asignatura: 'Robótica',
      CodigoPlan: 2034,
      CodigoAsignatura: 'propio-robótica',
      CodigoGrupo: 'BT',
      Convocatoria: 'Junio',
      Fecha: '15-06-2026',
      Hora: '10:00 - 12:00',
      Aula: 'Aulario I - Aula 101',
    });
  });

  it('respeta la convocatoria elegida y deja el aula sin asignar si está vacía', () => {
    const creado = crearExamen(datos({ convocatoria: 'Mayo', curso: '', plan: '' }), []);
    expect(creado).toMatchObject({ Convocatoria: 'Mayo', Aula: '-', CodigoGrupo: '', CodigoPlan: '' });
  });

  it('reutiliza nombre y códigos de una asignatura que ya está en el calendario', () => {
    const creado = crearExamen(datos({ asignatura: 'bases de datos' }), [examen()]);
    expect(creado).toMatchObject({ Asignatura: 'BASES DE DATOS (2034011)', CodigoAsignatura: 2034011, CodigoPlan: 2034 });
  });

  it('dos asignaturas propias a la misma hora cuentan como conflicto', () => {
    const a = crearExamen(datos({ asignatura: 'Robótica' }), []);
    const b = crearExamen(datos({ asignatura: 'Visión artificial' }), []);
    expect(detectarSolapamientos([a, b]).get(claveExamen(a))?.tipo).toBe('conflicto');
  });
});

describe('unirExamenes y sinExamen', () => {
  it('suma importados y propios y quita uno por su clave', () => {
    const importado = examen();
    const propio = crearExamen(datos(), []);
    const todos = unirExamenes([importado], [propio]);
    expect(todos).toEqual([importado, propio]);
    expect(unirExamenes(null, [])).toEqual([]);
    expect(sinExamen(todos, claveExamen(importado))).toEqual([propio]);
  });
});

describe('datosDeExamen y editarExamen', () => {
  it('pasa un examen al formulario y, sin tocar nada, lo deja igual', () => {
    const original = examen();
    expect(datosDeExamen(original)).toEqual({
      asignatura: 'Bases de datos', fecha: '2026-05-11', inicio: '17:00', fin: '19:00',
      aula: 'Aulario III - Aula 002', convocatoria: 'Mayo', curso: '3/BT', plan: original.Plan,
    });
    expect(editarExamen(original, datosDeExamen(original), [])).toEqual(original);
  });

  it('cambia lo editado y conserva los códigos del Excel', () => {
    const original = examen({ Aula: '-' });
    expect(datosDeExamen(original).aula).toBe('');
    const editado = editarExamen(original, { ...datosDeExamen(original), fecha: '2026-05-13', aula: 'Aula 101' }, [original]);
    expect(editado).toEqual({ ...original, Fecha: '13-05-2026', Aula: 'Aula 101' });
  });
});
