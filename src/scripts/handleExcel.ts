import type { CellValue, Row } from 'exceljs';
import type { Examen } from '../types/examen';

const ERROR_FORMATO = "No se ha encontrado ningún examen en el archivo. Asegúrate de que es el Excel original de la web de exámenes de la URJC, con las columnas Asignatura, Plan, Convocatoria, Fecha, Hora y Aulas.";

const dosCifras = (n: number) => String(n).padStart(2, '0');

// Texto plano de una celda de ExcelJS: texto enriquecido, hipervínculos y fórmulas llegan como objetos
function textoCelda(valor: CellValue | undefined): string {
  if (valor === null || valor === undefined) return '';
  if (valor instanceof Date) return valor.toISOString();
  if (typeof valor === 'object') {
    if ('richText' in valor && Array.isArray(valor.richText)) return valor.richText.map((parte) => parte.text).join('').trim();
    if ('result' in valor) return textoCelda(valor.result as CellValue);
    if ('text' in valor) return textoCelda(valor.text as CellValue);
    return '';
  }
  return String(valor).trim();
}

// Las fechas de ExcelJS vienen en UTC; se leen en UTC para no cambiar de día por la zona horaria
function fechaDesdeDate(fecha: Date): string {
  return `${dosCifras(fecha.getUTCDate())}-${dosCifras(fecha.getUTCMonth() + 1)}-${fecha.getUTCFullYear()}`;
}

// Devuelve "DD-MM-YYYY" o null
export function normalizarFecha(valor: CellValue | undefined): string | null {
  if (valor && typeof valor === 'object' && !(valor instanceof Date) && 'result' in valor) {
    return normalizarFecha(valor.result as CellValue);
  }
  if (valor instanceof Date) {
    return isNaN(valor.getTime()) ? null : fechaDesdeDate(valor);
  }
  if (typeof valor === 'number') {
    // Número de serie de Excel (días desde 1899-12-30)
    return fechaDesdeDate(new Date(Math.round((valor - 25569) * 86400000)));
  }
  const coincidencia = textoCelda(valor).match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!coincidencia) return null;
  const [, dia, mes, anio] = coincidencia.map(Number);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;
  return `${dosCifras(dia)}-${dosCifras(mes)}-${anio}`;
}

// Devuelve "HH:MM - HH:MM" o null
export function normalizarHora(valor: CellValue | undefined): string | null {
  const horas = [...textoCelda(valor).matchAll(/(\d{1,2})[:.](\d{2})/g)]
    .map(([, h, m]) => [Number(h), Number(m)])
    .filter(([h, m]) => h < 24 && m < 60);
  if (horas.length < 2) return null;
  const [[hi, mi], [hf, mf]] = horas;
  return `${dosCifras(hi)}:${dosCifras(mi)} - ${dosCifras(hf)}:${dosCifras(mf)}`;
}

const codigo = (valor: CellValue): number | string => (typeof valor === 'number' ? valor : textoCelda(valor));

// Convierte una fila de la hoja en examen; null si no tiene asignatura, fecha y hora válidas
function filaAExamen(row: Row): Examen | null {
  const asignatura = textoCelda(row.getCell(3).value);
  const fecha = normalizarFecha(row.getCell(8).value);
  const hora = normalizarHora(row.getCell(9).value);
  if (!asignatura || !fecha || !hora) return null;

  return {
    Curso: textoCelda(row.getCell(1).value),
    Plan: textoCelda(row.getCell(2).value),
    Asignatura: asignatura,
    CodigoPlan: codigo(row.getCell(4).value),
    CodigoAsignatura: codigo(row.getCell(5).value),
    CodigoGrupo: textoCelda(row.getCell(6).value),
    Convocatoria: textoCelda(row.getCell(7).value),
    Fecha: fecha,
    Hora: hora,
    Aula: textoCelda(row.getCell(10).value) || '-',
  };
}

export default async function excelTojson(excelFile: File): Promise<Examen[]> {
  // ExcelJS pesa ~900 kB: se carga solo al importar, en un chunk aparte
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(await excelFile.arrayBuffer());
  } catch {
    throw new Error("No se ha podido leer el archivo. Comprueba que es un Excel .xlsx y que no está dañado.");
  }

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error(ERROR_FORMATO);

  const examenes: Examen[] = [];
  // Las dos primeras filas son el título y la cabecera; las filas vacías o incompletas se descartan
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= 2) return;
    const examen = filaAExamen(row);
    if (examen) examenes.push(examen);
  });

  if (examenes.length === 0) throw new Error(ERROR_FORMATO);
  return examenes;
}
