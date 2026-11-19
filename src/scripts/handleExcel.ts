import type { CellValue, Row } from 'read-excel-file/browser';
import type { Examen } from '../types/examen';

const ERROR_FORMATO = "No se ha encontrado ningún examen en el archivo. Asegúrate de que es el Excel original de la web de exámenes de la URJC, con las columnas Asignatura, Plan, Convocatoria, Fecha, Hora y Aulas.";

// Valor de una celda tal y como lo da read-excel-file (texto enriquecido y fórmulas ya llegan como valor simple)
type Celda = CellValue | null | undefined;

const dosCifras = (n: number) => String(n).padStart(2, '0');

function textoCelda(valor: Celda): string {
  if (valor === null || valor === undefined) return '';
  if (valor instanceof Date) return valor.toISOString();
  return String(valor).trim();
}

// Las fechas del Excel vienen en UTC; se leen en UTC para no cambiar de día por la zona horaria
function fechaDesdeDate(fecha: Date): string {
  return `${dosCifras(fecha.getUTCDate())}-${dosCifras(fecha.getUTCMonth() + 1)}-${fecha.getUTCFullYear()}`;
}

// Devuelve "DD-MM-YYYY" o null
export function normalizarFecha(valor: Celda): string | null {
  if (valor instanceof Date) {
    return isNaN(valor.getTime()) ? null : fechaDesdeDate(valor);
  }
  if (typeof valor === 'number') {
    // Número de serie de Excel (días desde 1899-12-30), por si la celda no tiene formato de fecha
    return fechaDesdeDate(new Date(Math.round((valor - 25569) * 86400000)));
  }
  const coincidencia = textoCelda(valor).match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!coincidencia) return null;
  const [, dia, mes, anio] = coincidencia.map(Number);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  return `${dosCifras(dia)}-${dosCifras(mes)}-${anio}`;
}

// Devuelve "HH:MM - HH:MM" o null
export function normalizarHora(valor: Celda): string | null {
  const horas = [...textoCelda(valor).matchAll(/(\d{1,2})[:.](\d{2})/g)]
    .map(([, h, m]) => [Number(h), Number(m)])
    .filter(([h, m]) => h < 24 && m < 60);
  if (horas.length < 2) return null;
  const [[hi, mi], [hf, mf]] = horas;
  return `${dosCifras(hi)}:${dosCifras(mi)} - ${dosCifras(hf)}:${dosCifras(mf)}`;
}

// La URJC pega las aulas de un examen sin separador ("Aulario II - Aula 102Aulario II - Aula 103")
// y repite la misma si la comparten varios grupos. Se cortan donde empieza otra "Edificio - Sala"
// (minúscula o cifra seguida de mayúscula), se quitan las repetidas y se unen con ", ".
// Devuelve "-" si no hay aula. Idempotente: vale para lo que ya está normalizado
export function normalizarAula(valor: Celda): string {
  const aulas = textoCelda(valor).split(/\s*[,;\n]\s*/).flatMap((linea) => {
    const partes: string[] = [];
    for (const trozo of linea.split(/(?<=[\p{Ll}\d])(?=\p{Lu})/u)) {
      // Un trozo sin " - " no es un aula completa (p. ej. "Aula 1A"): se vuelve a pegar al anterior
      if (partes.length > 0 && !trozo.includes(' - ')) partes[partes.length - 1] += trozo;
      else partes.push(trozo);
    }
    return partes.map((aula) => aula.trim());
  }).filter((aula) => aula && aula !== '-');
  return aulas.length > 0 ? [...new Set(aulas)].join(', ') : '-';
}

const codigo = (valor: Celda): number | string => (typeof valor === 'number' ? valor : textoCelda(valor));

// Convierte una fila de la hoja (columnas 1–10) en examen; null si no tiene asignatura, fecha y hora válidas
function filaAExamen(fila: Row): Examen | null {
  const celda = (columna: number): Celda => fila[columna - 1];
  const asignatura = textoCelda(celda(3));
  const fecha = normalizarFecha(celda(8));
  const hora = normalizarHora(celda(9));
  if (!asignatura || !fecha || !hora) return null;

  return {
    Curso: textoCelda(celda(1)),
    Plan: textoCelda(celda(2)),
    Asignatura: asignatura,
    CodigoPlan: codigo(celda(4)),
    CodigoAsignatura: codigo(celda(5)),
    CodigoGrupo: textoCelda(celda(6)),
    Convocatoria: textoCelda(celda(7)),
    Fecha: fecha,
    Hora: hora,
    Aula: normalizarAula(celda(10)),
  };
}

export default async function excelTojson(excelFile: File): Promise<Examen[]> {
  // read-excel-file se carga solo al importar, en un chunk aparte
  const { readSheet } = await import('read-excel-file/browser');
  let filas: Row[];
  try {
    filas = await readSheet(excelFile);
  } catch {
    throw new Error("No se ha podido leer el archivo. Comprueba que es un Excel .xlsx y que no está dañado.");
  }

  // Las dos primeras filas son el título y la cabecera; las filas vacías o incompletas se descartan
  const examenes = filas.slice(2).map(filaAExamen).filter((ev): ev is Examen => ev !== null);
  if (examenes.length === 0) throw new Error(ERROR_FORMATO);
  return examenes;
}
