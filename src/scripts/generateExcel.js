import ExcelJS from 'exceljs';

const COLUMNAS_EXCEL = [
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

export const descargarCalendarioExcel = async (examenesJSON) => {
  if (!examenesJSON || examenesJSON.length === 0) {
    console.warn('El JSON de exámenes está vacío o no es válido.');
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Examenes');

  worksheet.columns = COLUMNAS_EXCEL;

  worksheet.insertRow(1, ['Examenes']);
  worksheet.mergeCells(1, 1, 1, COLUMNAS_EXCEL.length);
  worksheet.getRow(1).font = { bold: true, size: 14 };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 22;

  const headerRow = worksheet.getRow(2);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

  examenesJSON.forEach((examen) => {
    worksheet.addRow({
      Curso: examen.Curso ?? '',
      Plan: examen.Plan ?? '',
      Asignatura: examen.Asignatura ?? '',
      CodigoPlan: examen.CodigoPlan ?? '',
      CodigoAsignatura: examen.CodigoAsignatura ?? '',
      CodigoGrupo: examen.CodigoGrupo ?? '',
      Convocatoria: examen.Convocatoria ?? '',
      Fecha: examen.Fecha ?? '',
      Hora: examen.Hora ?? '',
      Aula: examen.Aula ?? '',
    });
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 2) {
      row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const enlaceOculto = document.createElement('a');

  enlaceOculto.href = url;
  enlaceOculto.download = 'horario_examenes.xlsx';

  document.body.appendChild(enlaceOculto);
  enlaceOculto.click();
  document.body.removeChild(enlaceOculto);
  URL.revokeObjectURL(url);
};