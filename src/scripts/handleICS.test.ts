import { readFile } from 'node:fs/promises';
import { createEvents } from 'ics';
import { describe, expect, it } from 'vitest';
import { eventosICS } from './generateICS';
import excelTojson from './handleExcel';
import icsTojson, { icsAExamenes } from './handleICS';
import { examen } from './examenDePrueba';
import type { Examen } from '../types/examen';

const exportar = (examenes: Examen[]) => {
  const { error, value } = createEvents(eventosICS(examenes));
  if (error || !value) throw error ?? new Error('Sin .ics');
  return value;
};

// Calendario mínimo con los VEVENT que se le pasen, como lo daría otra aplicación
const calendario = (...eventos: string[]) => ['BEGIN:VCALENDAR', 'VERSION:2.0', ...eventos, 'END:VCALENDAR'].join('\r\n');

describe('icsAExamenes con un .ics exportado por la app', () => {
  it('recupera el examen tal cual', () => {
    expect(icsAExamenes(exportar([examen()]))).toEqual([examen()]);
  });

  it('respeta aula sin asignar, varias aulas y códigos en texto', () => {
    const examenes = [
      examen({ Aula: '-' }),
      examen({ Aula: 'Aulario I - Aula 005, Aulario I - Aula 006', Fecha: '12-01-2026', Hora: '09:30 - 11:00', Convocatoria: 'Enero' }),
      examen({ CodigoPlan: 'P-1', CodigoAsignatura: 'A1' }),
    ];
    expect(icsAExamenes(exportar(examenes))).toEqual(examenes);
  });

  it('exportar public/Examenes.xlsx a .ics y volver a importarlo da los mismos exámenes', async () => {
    const datos = await readFile(new URL('../../public/Examenes.xlsx', import.meta.url));
    const examenes = await excelTojson(new File([datos], 'Examenes.xlsx'));
    const ics = exportar(examenes);
    expect(await icsTojson(new File([ics], 'horario_examenes.ics'))).toEqual(examenes);
  });

  it('lee el formato de descripción anterior (Curso con el grupo entre paréntesis)', () => {
    const [leido] = icsAExamenes(calendario(
      'BEGIN:VEVENT',
      'SUMMARY:BASES DE DATOS (2034011)',
      'DTSTART:20260511T150000Z',
      'DTEND:20260511T170000Z',
      'DESCRIPTION:Convocatoria: Mayo\\nCurso: 3/BT (Grupo BT)\\nPlan: GRADO EN INGE',
      '\tNIERÍA INFORMÁTICA (2034) (MÓSTOLES)',
      'LOCATION:Aulario III - Aula 002',
      'END:VEVENT',
    ));
    expect(leido).toEqual(examen());
  });
});

describe('icsAExamenes con un .ics de otro calendario', () => {
  it('convierte TZID y hora flotante a hora de Madrid y deduce lo que falta', () => {
    const [conZona, flotante] = icsAExamenes(calendario(
      'BEGIN:VEVENT',
      'SUMMARY:Física (2034002)',
      'DTSTART;TZID=America/New_York:20260115T040000',
      'DTEND;TZID=America/New_York:20260115T060000',
      'LOCATION:Aulario II - Aula 102\\, planta 1',
      'BEGIN:VALARM',
      'DESCRIPTION:Recordatorio',
      'END:VALARM',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'SUMMARY:Repaso',
      'DTSTART:20260601T100000',
      'DURATION:PT1H30M',
      'END:VEVENT',
    ));
    expect(conZona).toEqual({
      Curso: '', Plan: '', Asignatura: 'Física (2034002)', CodigoPlan: '', CodigoAsignatura: 2034002, CodigoGrupo: '',
      Convocatoria: 'Enero', Fecha: '15-01-2026', Hora: '10:00 - 12:00', Aula: 'Aulario II - Aula 102, planta 1',
    });
    expect(flotante).toMatchObject({ Asignatura: 'Repaso', Fecha: '01-06-2026', Hora: '10:00 - 11:30', Convocatoria: 'Junio', Aula: '-' });
  });

  it('descarta eventos de día entero o sin título', () => {
    const examenes = icsAExamenes(calendario(
      'BEGIN:VEVENT', 'SUMMARY:Festivo', 'DTSTART;VALUE=DATE:20260501', 'END:VEVENT',
      'BEGIN:VEVENT', 'DTSTART:20260511T150000Z', 'DTEND:20260511T170000Z', 'END:VEVENT',
      'BEGIN:VEVENT', 'SUMMARY:Álgebra', 'DTSTART:20260511T150000Z', 'DTEND:20260511T170000Z', 'END:VEVENT',
    ));
    expect(examenes.map((ev) => ev.Asignatura)).toEqual(['Álgebra']);
  });

  it('acepta un TZID de Windows tomando la hora tal cual', () => {
    const [leido] = icsAExamenes(calendario(
      'BEGIN:VEVENT', 'SUMMARY:Álgebra', 'DTSTART;TZID="Romance Standard Time":20260511T170000',
      'DTEND;TZID="Romance Standard Time":20260511T190000', 'END:VEVENT',
    ));
    expect(leido.Hora).toBe('17:00 - 19:00');
  });
});

describe('icsAExamenes con archivos que no valen', () => {
  it('da un error legible si no es un calendario', () => {
    expect(() => icsAExamenes('hola')).toThrow('No se ha podido leer el archivo');
  });

  it('da un error legible si no hay ningún examen con hora', () => {
    expect(() => icsAExamenes(calendario())).toThrow('No se ha encontrado ningún examen');
  });
});
