import { esExamen } from './copiaSeguridad';
import type { Examen } from '../types/examen';

// Calendario compartido por enlace, sin servidor: los exámenes van comprimidos tras el # de
// /dashboard/importar. Lo que va tras el # no se envía al servidor al abrir el enlace, así que
// los datos solo viajan dentro del propio enlace (mensaje, QR…)

const VERSION = 1;
const PREFIJO = '#c=';
// Cada examen va como array en este orden: sin repetir los nombres de los campos, el enlace es
// mucho más corto (y cabe en un QR con más exámenes)
const CAMPOS = ['Curso', 'Plan', 'Asignatura', 'CodigoPlan', 'CodigoAsignatura', 'CodigoGrupo', 'Convocatoria', 'Fecha', 'Hora', 'Aula'] as const;

const ERROR_ENLACE = 'El enlace compartido está incompleto o dañado. Pide a quien te lo pasó que lo vuelva a copiar entero.';

async function pasarPor(bytes: Uint8Array, transformacion: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const flujo = new Blob([bytes as BlobPart]).stream().pipeThrough(transformacion);
  return new Uint8Array(await new Response(flujo).arrayBuffer());
}

function aBase64Url(bytes: Uint8Array): string {
  let binario = '';
  for (const byte of bytes) binario += String.fromCharCode(byte);
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function desdeBase64Url(texto: string): Uint8Array {
  const base64 = texto.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export async function codificarCalendario(examenes: Examen[]): Promise<string> {
  const json = JSON.stringify({ v: VERSION, e: examenes.map((ev) => CAMPOS.map((campo) => ev[campo])) });
  return aBase64Url(await pasarPor(new TextEncoder().encode(json), new CompressionStream('deflate-raw')));
}

// Lanza un Error legible si el código no es un calendario válido
export async function decodificarCalendario(codigo: string): Promise<Examen[]> {
  let datos: unknown;
  try {
    const bytes = await pasarPor(desdeBase64Url(codigo), new DecompressionStream('deflate-raw'));
    datos = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error(ERROR_ENLACE);
  }
  const { v, e } = (datos ?? {}) as { v?: unknown; e?: unknown };
  if (v !== VERSION || !Array.isArray(e)) throw new Error(ERROR_ENLACE);
  const examenes = e.map((fila) => (Array.isArray(fila) ? Object.fromEntries(CAMPOS.map((campo, i) => [campo, fila[i]])) : null));
  if (examenes.length === 0 || !examenes.every(esExamen)) throw new Error(ERROR_ENLACE);
  return examenes;
}

export const enlaceCompartido = (origen: string, codigo: string): string => `${origen}/dashboard/importar${PREFIJO}${codigo}`;

// "#c=abc" → "abc"; null si el hash no es un calendario compartido
export const codigoDeHash = (hash: string): string | null => (hash.startsWith(PREFIJO) && hash.length > PREFIJO.length ? hash.slice(PREFIJO.length) : null);
