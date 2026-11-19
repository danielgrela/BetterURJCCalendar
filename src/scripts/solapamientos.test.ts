import { describe, expect, it } from 'vitest';
import { detectarSolapamientos, franjaHoraria } from './solapamientos';
import { claveExamen } from './examen';
import { examen } from './examenDePrueba';

describe('franjaHoraria', () => {
  it('pasa la hora a minutos', () => {
    expect(franjaHoraria('09:30 - 11:00')).toEqual([570, 660]);
    expect(franjaHoraria('9:30-11:00')).toEqual([570, 660]);
  });

  it('devuelve null si no se puede leer', () => {
    expect(franjaHoraria('')).toBeNull();
    expect(franjaHoraria('Por determinar')).toBeNull();
  });
});

describe('detectarSolapamientos', () => {
  const a = examen({ CodigoAsignatura: 1, Asignatura: 'A (1)', Hora: '09:00 - 11:00' });
  const b = examen({ CodigoAsignatura: 2, Asignatura: 'B (2)', Hora: '10:00 - 12:00' });
  const c = examen({ CodigoAsignatura: 3, Asignatura: 'C (3)', Hora: '16:00 - 18:00' });

  it('marca como conflicto las horas que se cruzan', () => {
    const r = detectarSolapamientos([a, b]);
    expect(r.get(claveExamen(a))).toEqual({ tipo: 'conflicto', con: [b] });
    expect(r.get(claveExamen(b))).toEqual({ tipo: 'conflicto', con: [a] });
  });

  it('mismo día sin cruce es un aviso suave', () => {
    const r = detectarSolapamientos([a, c]);
    expect(r.get(claveExamen(a))).toEqual({ tipo: 'mismoDia', con: [c] });
  });

  it('un conflicto gana al aviso de mismo día y solo lista los que se cruzan', () => {
    const r = detectarSolapamientos([a, b, c]);
    expect(r.get(claveExamen(a))).toEqual({ tipo: 'conflicto', con: [b] });
    expect(r.get(claveExamen(c))).toEqual({ tipo: 'mismoDia', con: [a, b] });
  });

  it('terminar justo cuando empieza otro no es conflicto', () => {
    const d = examen({ CodigoAsignatura: 4, Hora: '11:00 - 13:00' });
    expect(detectarSolapamientos([a, d]).get(claveExamen(a))?.tipo).toBe('mismoDia');
  });

  it('no cuenta días distintos ni el mismo examen en otro grupo', () => {
    const otroDia = examen({ CodigoAsignatura: 2, Fecha: '12-05-2026', Hora: '10:00 - 12:00' });
    const otroGrupo = examen({ ...a, CodigoGrupo: 'XX' });
    expect(detectarSolapamientos([a, otroDia, otroGrupo]).size).toBe(0);
  });

  it('con una hora ilegible avisa de mismo día sin dar conflicto', () => {
    const sinHora = examen({ CodigoAsignatura: 5, Hora: '' });
    expect(detectarSolapamientos([a, sinHora]).get(claveExamen(a))?.tipo).toBe('mismoDia');
  });

  it('tolera datos vacíos', () => {
    expect(detectarSolapamientos(null).size).toBe(0);
  });
});
