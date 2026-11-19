import parseEventDate from './sortEvents';

// La asignatura llega con el código entre paréntesis: se muestra solo el nombre
export const nombreAsignatura = (ev) => (ev?.Asignatura ?? '').split('(')[0].trim();

export const diasHasta = (fecha, hoy = new Date()) => {
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return Math.round((parseEventDate(fecha) - inicioHoy) / (1000 * 60 * 60 * 24));
};

// Clave estable para listas de React (el grupo evita choques si se importan varios grupos)
export const claveExamen = (ev) => [ev.CodigoAsignatura, ev.CodigoGrupo, ev.Fecha, ev.Hora].join('|');
