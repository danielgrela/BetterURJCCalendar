import { describe, expect, it } from 'vitest';
import { claveEstable } from './examen';
import { examen } from './examenDePrueba';
import { PREFERENCIAS_VACIAS, asignaturasDe, examenesExportables, examenesVisibles, type PreferenciasCalendario } from './preferencias';

const calculo = (cambios = {}) => examen({ Asignatura: 'CÁLCULO (2034001)', CodigoAsignatura: 2034001, ...cambios });
const mayo = calculo({ Convocatoria: 'Mayo', Fecha: '14-05-2026' });
const junio = calculo({ Convocatoria: 'Junio', Fecha: '29-06-2026' });
const bd = examen();
const prefs = (cambios: Partial<PreferenciasCalendario>): PreferenciasCalendario => ({ ...PREFERENCIAS_VACIAS, ...cambios });

describe('asignaturasDe', () => {
  it('agrupa por asignatura con sus grupos y exámenes, en orden alfabético', () => {
    const [a, b] = asignaturasDe([bd, junio, mayo, calculo({ CodigoGrupo: 'AT', Fecha: '15-05-2026' })]);
    expect(a.nombre).toBe('Bases de datos');
    expect(b).toMatchObject({ clave: '2034001', nombre: 'Cálculo', grupos: ['AT', 'BT'] });
    expect(b.examenes.map((ev) => ev.Fecha)).toEqual(['14-05-2026', '15-05-2026', '29-06-2026']);
  });
});

describe('examenesVisibles', () => {
  it('sin preferencias se ve todo', () => {
    expect(examenesVisibles([bd, mayo, junio], PREFERENCIAS_VACIAS)).toEqual([bd, mayo, junio]);
  });

  it('quita las asignaturas ocultas', () => {
    expect(examenesVisibles([bd, mayo, junio], prefs({ ocultas: ['2034001'] }))).toEqual([bd]);
  });

  it('deja solo el grupo elegido, salvo que ese grupo ya no exista', () => {
    const otroGrupo = calculo({ CodigoGrupo: 'AT', Convocatoria: 'Mayo', Fecha: '15-05-2026' });
    expect(examenesVisibles([mayo, otroGrupo], prefs({ grupos: { '2034001': 'AT' } }))).toEqual([otroGrupo]);
    expect(examenesVisibles([mayo], prefs({ grupos: { '2034001': 'AT' } }))).toEqual([mayo]);
  });

  it('al aprobar, oculta los exámenes posteriores de esa asignatura y deja el aprobado', () => {
    const p = prefs({ estados: { [claveEstable(mayo)]: 'aprobado' } });
    expect(examenesVisibles([bd, mayo, junio], p)).toEqual([bd, mayo]);
  });
});

describe('examenesExportables', () => {
  it('quita además los marcados «No me presento»', () => {
    const p = prefs({ estados: { [claveEstable(mayo)]: 'no-presento' } });
    expect(examenesVisibles([mayo, junio], p)).toEqual([mayo, junio]);
    expect(examenesExportables([mayo, junio], p)).toEqual([junio]);
  });
});
