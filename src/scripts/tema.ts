// Tema de la interfaz: 'sistema' sigue a prefers-color-scheme; 'claro' y 'oscuro' lo fijan
export type Tema = 'sistema' | 'claro' | 'oscuro';

export const NOMBRE_TEMA: Record<Tema, string> = {
  sistema: 'sistema',
  claro: 'claro',
  oscuro: 'oscuro',
};

const ORDEN: Tema[] = ['sistema', 'claro', 'oscuro'];

/** Orden del botón: sistema → claro → oscuro → sistema */
export function siguienteTema(tema: Tema): Tema {
  return ORDEN[(ORDEN.indexOf(tema) + 1) % ORDEN.length];
}

export function esOscuro(tema: Tema, sistemaOscuro: boolean): boolean {
  return tema === 'oscuro' || (tema === 'sistema' && sistemaOscuro);
}

function esTema(valor: unknown): valor is Tema {
  return valor === 'sistema' || valor === 'claro' || valor === 'oscuro';
}

/**
 * Tema a partir del estado guardado en localStorage ('dark-mode' › state). Acepta el formato
 * antiguo `{ isDark }` (antes de F5.5 solo había claro/oscuro) y, si no hay nada válido, 'sistema'.
 * SCRIPT_TEMA_INICIAL hace lo mismo en JS plano (lo comprueba temaInicial.test.ts).
 */
export function temaDeEstado(estado: unknown): Tema {
  if (typeof estado !== 'object' || estado === null) return 'sistema';
  if ('tema' in estado && esTema(estado.tema)) return estado.tema;
  if ('isDark' in estado && typeof estado.isDark === 'boolean') return estado.isDark ? 'oscuro' : 'claro';
  return 'sistema';
}
