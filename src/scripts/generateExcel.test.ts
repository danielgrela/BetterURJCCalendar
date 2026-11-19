import { describe, expect, it, vi } from 'vitest';
import { descargarCalendarioExcel } from './generateExcel';
import excelTojson from './handleExcel';
import { descargarBlob } from './descargarBlob';
import { examen } from './examenDePrueba';

vi.mock('./descargarBlob', () => ({ descargarBlob: vi.fn() }));

describe('descargarCalendarioExcel', () => {
  it('genera un Excel que se vuelve a importar igual', async () => {
    const examenes = [examen(), examen({ Fecha: '02-06-2026', Convocatoria: 'Junio', Aula: '-' })];
    await descargarCalendarioExcel(examenes);

    expect(descargarBlob).toHaveBeenCalledOnce();
    const [blob, nombre] = vi.mocked(descargarBlob).mock.calls[0];
    expect(nombre).toBe('horario_examenes.xlsx');
    expect(await excelTojson(new File([blob], nombre))).toEqual(examenes);
  });
});
