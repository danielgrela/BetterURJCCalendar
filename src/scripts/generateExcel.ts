import { descargarBlob } from './descargarBlob';
import type { Row } from 'write-excel-file/browser';
import type { Examen } from '../types/examen';

const COLUMNAS_EXCEL: { header: string; key: keyof Examen; width: number }[] = [
  { header: 'Curso', key: 'Curso', width: 14 },
  { header: 'Plan', key: 'Plan', width: 18 },
  { header: 'Asignatura', key: 'Asignatura', width: 34 },
  { header: 'CodigoPlan', key: 'CodigoPlan', width: 16 },
  { header: 'CodigoAsignatura', key: 'CodigoAsignatura', width: 18 },
  { header: 'CodigoGrupo', key: 'CodigoGrupo', width: 14 },
  { header: 'Convocatoria', key: 'Convocatoria', width: 16 },
  { header: 'Fecha', key: 'Fecha', width: 14 },
  { header: 'Hora', key: 'Hora', width: 18 },
  { header: 'Aula', key: 'Aula', width: 16 },
];

export const descargarCalendarioExcel = async (examenesJSON: Examen[] | null | undefined): Promise<void> => {
  if (!examenesJSON || examenesJSON.length === 0) {
    console.warn('El JSON de exámenes está vacío o no es válido.');
    return;
  }

  // write-excel-file se carga solo al exportar, en un chunk aparte
  const { default: writeExcelFile } = await import('write-excel-file/browser');

  const titulo: Row = [
    { value: 'Examenes', columnSpan: COLUMNAS_EXCEL.length, fontWeight: 'bold', fontSize: 14, align: 'center', alignVertical: 'center', height: 22 },
  ];
  const cabecera: Row = COLUMNAS_EXCEL.map(({ header }) => ({ value: header, fontWeight: 'bold', align: 'center', alignVertical: 'center', wrap: true }));
  const filas: Row[] = examenesJSON.map((examen) => COLUMNAS_EXCEL.map(({ key }) => ({
    value: examen[key] ?? '',
    align: 'left',
    alignVertical: 'center',
    wrap: true,
  })));

  const blob = await writeExcelFile([titulo, cabecera, ...filas], {
    sheet: 'Examenes',
    columns: COLUMNAS_EXCEL.map(({ width }) => ({ width })),
  }).toBlob();
  descargarBlob(blob, 'horario_examenes.xlsx');
};
