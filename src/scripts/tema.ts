// La interfaz solo tiene dos temas. Mientras la persona no elige uno (preferencia null) se usa el del
// sistema operativo (prefers-color-scheme); en cuanto pulsa el botón, su elección se guarda y manda.
export type Tema = 'claro' | 'oscuro';
export type Preferencia = Tema | null;

export function temaEfectivo(preferencia: Preferencia, sistemaOscuro: boolean): Tema {
  return preferencia ?? (sistemaOscuro ? 'oscuro' : 'claro');
}

export function temaOpuesto(tema: Tema): Tema {
  return tema === 'oscuro' ? 'claro' : 'oscuro';
}

/**
 * Preferencia a partir del estado guardado en localStorage ('dark-mode' › state). Acepta los formatos
 * antiguos: `{ isDark }` (v0) y `{ tema: 'sistema' }` (v1, cuando «sistema» era una opción del botón,
 * que ahora equivale a no haber elegido). Cualquier otra cosa también es null.
 * SCRIPT_TEMA_INICIAL hace lo mismo en JS plano (lo comprueba tema.test.ts).
 */
export function preferenciaDeEstado(estado: unknown): Preferencia {
  if (typeof estado !== 'object' || estado === null) return null;
  if ('tema' in estado && (estado.tema === 'claro' || estado.tema === 'oscuro')) return estado.tema;
  if ('isDark' in estado && typeof estado.isDark === 'boolean') return estado.isDark ? 'oscuro' : 'claro';
  return null;
}
