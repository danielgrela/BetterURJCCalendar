import { describe, expect, it } from 'vitest';
import { preferenciaDeEstado, temaEfectivo, temaOpuesto, type Preferencia } from './tema';
import { SCRIPT_TEMA_INICIAL } from './temaInicial';

describe('temaEfectivo', () => {
  it('sin preferencia sigue al sistema operativo; con preferencia lo ignora', () => {
    expect(temaEfectivo(null, true)).toBe('oscuro');
    expect(temaEfectivo(null, false)).toBe('claro');
    expect(temaEfectivo('claro', true)).toBe('claro');
    expect(temaEfectivo('oscuro', false)).toBe('oscuro');
  });
});

describe('temaOpuesto', () => {
  it('alterna entre claro y oscuro', () => {
    expect(temaOpuesto('claro')).toBe('oscuro');
    expect(temaOpuesto('oscuro')).toBe('claro');
  });
});

// [estado guardado en 'dark-mode' › state, preferencia esperada]
const CASOS: [unknown, Preferencia][] = [
  [{ tema: 'oscuro' }, 'oscuro'],
  [{ tema: 'claro' }, 'claro'],
  [{ tema: null }, null],
  [{ tema: 'sistema' }, null],
  [{ isDark: true }, 'oscuro'],
  [{ isDark: false }, 'claro'],
  [{ tema: 'rosa' }, null],
  [{}, null],
  [null, null],
];

describe('preferenciaDeEstado', () => {
  it.each(CASOS)('%j → %s', (estado, esperado) => {
    expect(preferenciaDeEstado(estado)).toBe(esperado);
  });
});

// Ejecuta el script del <head> con un localStorage, un matchMedia y un <html> de mentira
function ejecutarScript(guardado: string | null, sistemaOscuro: boolean): boolean {
  const clases = new Set<string>();
  const documento = {
    documentElement: {
      classList: { toggle: (clase: string, activa: boolean) => { if (activa) clases.add(clase); else clases.delete(clase); } },
    },
  };
  const almacen = { getItem: () => guardado };
  const ventana = { matchMedia: () => ({ matches: sistemaOscuro }) };
  new Function('localStorage', 'window', 'document', SCRIPT_TEMA_INICIAL)(almacen, ventana, documento);
  return clases.has('dark');
}

describe('SCRIPT_TEMA_INICIAL', () => {
  it.each(CASOS)('coincide con preferenciaDeEstado para %j', (estado, esperado) => {
    const guardado = JSON.stringify({ state: estado, version: 1 });
    expect(ejecutarScript(guardado, false)).toBe(temaEfectivo(esperado, false) === 'oscuro');
    expect(ejecutarScript(guardado, true)).toBe(temaEfectivo(esperado, true) === 'oscuro');
  });

  it('sin nada guardado o con JSON roto sigue al sistema', () => {
    expect(ejecutarScript(null, true)).toBe(true);
    expect(ejecutarScript('{roto', false)).toBe(false);
  });
});
