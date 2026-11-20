import { describe, expect, it } from 'vitest';
import { compararCalendarios, textoCambio } from './cambios';
import { examen } from './examenDePrueba';

const calculo = (cambios = {}) => examen({ Asignatura: 'CÁLCULO (2034001)', CodigoAsignatura: 2034001, Fecha: '12-01-2026', Hora: '09:00 - 11:00', Convocatoria: 'Enero', ...cambios });

describe('compararCalendarios', () => {
  it('no ve cambios si los dos calendarios son iguales (aunque cambie el orden)', () => {
    expect(compararCalendarios([examen(), calculo()], [calculo(), examen()])).toEqual([]);
  });

  it('detecta cambios de fecha, hora y aula del mismo examen', () => {
    const [cambio] = compararCalendarios([calculo()], [calculo({ Fecha: '14-01-2026', Aula: 'Aula 101' })]);
    expect(cambio).toMatchObject({ tipo: 'cambiado', campos: ['Fecha', 'Aula'] });
  });

  it('detecta exámenes nuevos y quitados', () => {
    const cambios = compararCalendarios([calculo()], [examen()]);
    expect(cambios.map((c) => c.tipo)).toEqual(['quitado', 'nuevo']);
  });

  it('separa grupos y convocatorias: otro grupo es otro examen', () => {
    const cambios = compararCalendarios([calculo({ CodigoGrupo: 'AT' })], [calculo({ CodigoGrupo: 'BT' })]);
    expect(cambios.map((c) => c.tipo).sort()).toEqual(['nuevo', 'quitado']);
  });

  it('empareja por orden de fecha dos exámenes de la misma asignatura y convocatoria', () => {
    const antes = [calculo(), calculo({ Fecha: '20-01-2026' })];
    const despues = [calculo(), calculo({ Fecha: '22-01-2026' })];
    const cambios = compararCalendarios(antes, despues);
    expect(cambios).toHaveLength(1);
    expect(cambios[0]).toMatchObject({ tipo: 'cambiado', campos: ['Fecha'] });
  });

  it('sin calendario anterior, todo es nuevo', () => {
    expect(compararCalendarios(null, [examen()])).toEqual([{ tipo: 'nuevo', examen: examen() }]);
  });
});

describe('textoCambio', () => {
  it('describe un cambio de fecha y aula', () => {
    const [cambio] = compararCalendarios([calculo()], [calculo({ Fecha: '14-01-2026', Aula: '-' })]);
    expect(textoCambio(cambio)).toBe('Cálculo (Enero): fecha: lun 12 ene → mié 14 ene; aula: Aulario III - Aula 002 → Aula sin asignar');
  });

  it('describe un examen nuevo y uno quitado', () => {
    const [quitado, nuevo] = compararCalendarios([calculo()], [examen()]);
    expect(textoCambio(nuevo)).toBe('Bases de datos (Mayo): nuevo, lun 11 may, 17:00–19:00');
    expect(textoCambio(quitado)).toBe('Cálculo (Enero): ya no aparece (era el lun 12 ene)');
  });
});
