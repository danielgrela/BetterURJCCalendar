import parseEventDate from './sortEvents';
import type { Examen, FiltrosCalendario } from '../types/examen';

export const FILTROS_INICIALES: FiltrosCalendario = { convocatoria: '', fecha: 'Todos', texto: '' };

// Sin tildes ni mayúsculas: «calculo» encuentra «CÁLCULO»
const normalizar = (texto: string): string => texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

// Orden del curso académico; las convocatorias desconocidas van al final
const ORDEN_CONVOCATORIAS = ['Septiembre', 'Enero', 'Mayo', 'Junio'];

export const convocatoriasDe = (examenes: Examen[] | null | undefined): string[] => {
    const unicas = [...new Set((examenes ?? []).map((ev) => ev?.Convocatoria).filter(Boolean))];
    const posicion = (c: string) => {
        const i = ORDEN_CONVOCATORIAS.indexOf(c);
        return i === -1 ? ORDEN_CONVOCATORIAS.length : i;
    };
    return unicas.sort((a, b) => posicion(a) - posicion(b) || a.localeCompare(b, 'es'));
};

export const filtrarExamenes = (examenes: Examen[] | null | undefined, { convocatoria, fecha, texto }: FiltrosCalendario, hoy: Date = new Date()): Examen[] => {
    let filtrados = examenes ?? [];

    if (convocatoria) {
        filtrados = filtrados.filter((ev) => ev.Convocatoria === convocatoria);
    }

    const buscado = normalizar(texto ?? '');
    if (buscado) {
        // Asignatura completa: incluye el código entre paréntesis, así que también se puede buscar por código
        filtrados = filtrados.filter((ev) => normalizar(ev.Asignatura).includes(buscado));
    }

    if (fecha === 'Pendientes') {
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        filtrados = filtrados.filter((ev) => parseEventDate(ev.Fecha) >= inicioHoy);
    }
    return filtrados;
};
