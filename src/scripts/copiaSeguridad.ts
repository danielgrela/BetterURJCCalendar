import { OPCIONES_AVISO, type Aviso } from './formatoICS';
import type { Estado, PreferenciasCalendario } from './preferencias';
import type { Examen } from '../types/examen';

// Copia de seguridad de todo lo que la app guarda en este navegador (lo importado, lo creado a mano
// y las preferencias) en un .json, para pasarlo a otro navegador o dispositivo. Importar la copia
// lo sustituye todo. El .ics no sirve para esto: no lleva estados, ocultas ni grupo elegido

const APP = 'better-urjc-calendar';
const VERSION = 1;

export interface CopiaSeguridad {
  app: typeof APP;
  version: typeof VERSION;
  /** Cuándo se hizo (ISO 8601) */
  fecha: string;
  importados: Examen[] | null;
  propios: Examen[];
  preferencias: PreferenciasCalendario & { aviso: Aviso };
}

export interface DatosCopia {
  importados: Examen[] | null;
  propios: Examen[];
  preferencias: PreferenciasCalendario & { aviso: Aviso };
}

export const crearCopia = ({ importados, propios, preferencias }: DatosCopia, ahora: Date = new Date()): CopiaSeguridad => ({
  app: APP,
  version: VERSION,
  fecha: ahora.toISOString(),
  importados,
  propios,
  preferencias: {
    ocultas: preferencias.ocultas,
    grupos: preferencias.grupos,
    estados: preferencias.estados,
    aviso: preferencias.aviso,
  },
});

export const nombreCopia = (ahora: Date = new Date()): string =>
  `better-urjc-calendar-copia-${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}.json`;

const ERROR_NO_ES_COPIA = 'Este archivo .json no es una copia de seguridad de Better URJC Calendar.';
const ERROR_DANADA = 'La copia de seguridad está incompleta o dañada.';

const CAMPOS_TEXTO = ['Curso', 'Plan', 'Asignatura', 'CodigoGrupo', 'Convocatoria', 'Fecha', 'Hora', 'Aula'] as const;
const ESTADOS: Estado[] = ['aprobado', 'no-presento'];

const esObjeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === 'object' && valor !== null && !Array.isArray(valor);
const esCodigo = (valor: unknown) => typeof valor === 'string' || typeof valor === 'number';

// También lo usa el enlace compartido (compartir.ts) para validar lo que llega por la URL
export function esExamen(valor: unknown): valor is Examen {
  return esObjeto(valor)
    && CAMPOS_TEXTO.every((campo) => typeof valor[campo] === 'string')
    && esCodigo(valor.CodigoPlan) && esCodigo(valor.CodigoAsignatura)
    && /^\d{2}-\d{2}-\d{4}$/.test(valor.Fecha as string)
    && /^\d{2}:\d{2} - \d{2}:\d{2}$/.test(valor.Hora as string);
}

const sonExamenes = (valor: unknown): valor is Examen[] => Array.isArray(valor) && valor.every(esExamen);

const esRegistroDe = <T,>(valor: unknown, valido: (v: unknown) => v is T): valor is Record<string, T> =>
  esObjeto(valor) && Object.values(valor).every(valido);

const esTexto = (v: unknown): v is string => typeof v === 'string';
const esEstado = (v: unknown): v is Estado => ESTADOS.includes(v as Estado);

// Lee y valida una copia; lanza un Error con un mensaje legible si no lo es o está dañada
export function leerCopia(texto: string): CopiaSeguridad {
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    throw new Error(ERROR_NO_ES_COPIA);
  }
  if (!esObjeto(datos) || datos.app !== APP) throw new Error(ERROR_NO_ES_COPIA);
  if (datos.version !== VERSION) throw new Error('Esta copia de seguridad es de otra versión de la app y no se puede leer.');

  const { importados, propios, preferencias, fecha } = datos;
  if (!(importados === null || sonExamenes(importados)) || !sonExamenes(propios) || !esObjeto(preferencias) || typeof fecha !== 'string') {
    throw new Error(ERROR_DANADA);
  }
  const { ocultas, grupos, estados, aviso } = preferencias;
  if (!Array.isArray(ocultas) || !ocultas.every(esTexto) || !esRegistroDe(grupos, esTexto) || !esRegistroDe(estados, esEstado)) {
    throw new Error(ERROR_DANADA);
  }
  if ((importados?.length ?? 0) + propios.length === 0) throw new Error('La copia de seguridad no tiene ningún examen.');

  return {
    app: APP,
    version: VERSION,
    fecha,
    importados: importados && importados.length > 0 ? importados : null,
    propios,
    preferencias: {
      ocultas,
      grupos,
      estados,
      // Un aviso desconocido no invalida la copia: se usa el de por defecto
      aviso: OPCIONES_AVISO.some(({ valor }) => valor === aviso) ? (aviso as Aviso) : '1d',
    },
  };
}
