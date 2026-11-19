import { describe, expect, it } from 'vitest';
import { esOscuro, siguienteTema, temaDeEstado, type Tema } from './tema';
import { SCRIPT_TEMA_INICIAL } from './temaInicial';

describe('siguienteTema', () => {
  it('rota sistema → claro → oscuro → sistema', () => {
    expect(siguienteTema('sistema')).toBe('claro');
    expect(siguienteTema('claro')).toBe('oscuro');
    expect(siguienteTema('oscuro')).toBe('sistema');
  });
});

describe('esOscuro', () => {
  it('en sistema sigue al sistema operativo; claro y oscuro lo ignoran', () => {
    expect(esOscuro('sistema', true)).toBe(true);
    expect(esOscuro('sistema', false)).toBe(false);
    expect(esOscuro('claro', true)).toBe(false);
    expect(esOscuro('oscuro', false)).toBe(true);
  });
});

// [estado guardado en 'dark-mode' › state, tema esperado]
const CASOS: [unknown, Tema][] = [
  [{ tema: 'oscuro' }, 'oscuro'],
  [{ tema: 'claro' }, 'claro'],
  [{ tema: 'sistema' }, 'sistema'],
  [{ isDark: true }, 'oscuro'],
  [{ isDark: false }, 'claro'],
  [{ tema: 'rosa' }, 'sistema'],
  [{}, 'sistema'],
  [null, 'sistema'],
];

describe('temaDeEstado', () => {
  it.each(CASOS)('%j → %s', (estado, esperado) => {
    expect(temaDeEstado(estado)).toBe(esperado);
  });
});

// Ejecuta el script del <head> con un localStorage, un matchMedia y un <html> de mentira
function ejecutarScript(guardado: string | null, sistemaOscuro: boolean) {
  const atributos: Record<string, string> = {};
  const clases = new Set<string>();
  const documento = {
    documentElement: {
      setAttribute: (nombre: string, valor: string) => { atributos[nombre] = valor; },
      classList: { toggle: (clase: string, activa: boolean) => { if (activa) clases.add(clase); else clases.delete(clase); } },
    },
  };
  const almacen = { getItem: () => guardado };
  const ventana = { matchMedia: () => ({ matches: sistemaOscuro }) };
  new Function('localStorage', 'window', 'document', SCRIPT_TEMA_INICIAL)(almacen, ventana, documento);
  return { tema: atributos['data-tema'], oscuro: clases.has('dark') };
}

describe('SCRIPT_TEMA_INICIAL', () => {
  it.each(CASOS)('coincide con temaDeEstado para %j', (estado, esperado) => {
    const guardado = JSON.stringify({ state: estado, version: 0 });
    expect(ejecutarScript(guardado, false)).toEqual({ tema: esperado, oscuro: esperado === 'oscuro' });
    expect(ejecutarScript(guardado, true)).toEqual({ tema: esperado, oscuro: esperado !== 'claro' });
  });

  it('sin nada guardado o con JSON roto sigue al sistema', () => {
    expect(ejecutarScript(null, true)).toEqual({ tema: 'sistema', oscuro: true });
    expect(ejecutarScript('{roto', false)).toEqual({ tema: 'sistema', oscuro: false });
  });
});
