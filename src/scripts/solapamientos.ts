import { claveExamen } from './examen';
import type { Examen } from '../types/examen';

export type TipoSolapamiento = 'conflicto' | 'mismoDia';

export interface Solapamiento {
    /** conflicto: las horas se cruzan · mismoDia: mismo día sin cruce (aviso suave) */
    tipo: TipoSolapamiento;
    /** Exámenes con los que se cruza (en un conflicto) o con los que comparte día */
    con: Examen[];
}

// "HH:MM - HH:MM" → minutos desde las 00:00 [inicio, fin]; null si no se puede leer
export function franjaHoraria(hora: string): [number, number] | null {
    const m = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(hora?.trim() ?? '');
    if (!m) return null;
    const [h1, m1, h2, m2] = m.slice(1).map(Number);
    return [h1 * 60 + m1, h2 * 60 + m2];
}

const seCruzan = (a: [number, number], b: [number, number]) => a[0] < b[1] && b[0] < a[1];

// Sin repetir asignatura: el mismo examen puede venir una vez por grupo
const unicos = (examenes: Examen[]) => [...new Map(examenes.map((ev) => [ev.CodigoAsignatura, ev])).values()];

// Exámenes que coinciden con otro el mismo día, por claveExamen. Si una hora no se puede leer
// no se da por conflicto, solo por mismo día. El mismo examen en otro grupo no cuenta
export function detectarSolapamientos(examenes: Examen[] | null | undefined): Map<string, Solapamiento> {
    const resultado = new Map<string, Solapamiento>();
    const porDia = new Map<string, Examen[]>();
    for (const ev of examenes ?? []) {
        if (!ev.Fecha) continue;
        porDia.set(ev.Fecha, [...(porDia.get(ev.Fecha) ?? []), ev]);
    }
    for (const delDia of porDia.values()) {
        for (const ev of delDia) {
            const otros = delDia.filter((o) => o.CodigoAsignatura !== ev.CodigoAsignatura);
            if (otros.length === 0) continue;
            const franja = franjaHoraria(ev.Hora);
            const cruzados = otros.filter((o) => {
                const otra = franjaHoraria(o.Hora);
                return franja !== null && otra !== null && seCruzan(franja, otra);
            });
            resultado.set(claveExamen(ev), cruzados.length > 0
                ? { tipo: 'conflicto', con: unicos(cruzados) }
                : { tipo: 'mismoDia', con: unicos(otros) });
        }
    }
    return resultado;
}
