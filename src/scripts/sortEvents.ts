import type { Examen } from '../types/examen';

export default function parseEventDate(fecha: string | null | undefined): Date {
        if (!fecha) {
            return new Date(0);
        }

        const [day, monthValue, yearValue] = fecha.split('-').map(Number);
        if (!day || !monthValue || !yearValue) {
            return new Date(0);
        }

        return new Date(yearValue, monthValue - 1, day);
    }
export const sortedEvents = (jsonData: Examen[] | null | undefined): Examen[] => Array.isArray(jsonData)
            ? [...jsonData]
                .filter((event) => event && event.Fecha)
                .sort((a, b) => {
                    const dateDiff = parseEventDate(a.Fecha).getTime() - parseEventDate(b.Fecha).getTime();
                    if (dateDiff !== 0) {
                        return dateDiff;
                    }
    
                    return (a.Hora || '').localeCompare(b.Hora || '');
                })
            : [];
// Primer día del mes del próximo examen (o del último, si ya pasaron todos); sin exámenes, el mes de hoy
export function mesDelProximoExamen(examenes: Examen[] | null | undefined, hoy: Date = new Date()): Date {
    const ordenados = sortedEvents(examenes);
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const examen = ordenados.find((ev) => parseEventDate(ev.Fecha) >= inicioHoy) ?? ordenados.at(-1);
    const fecha = examen ? parseEventDate(examen.Fecha) : hoy;
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

export const hayExamenesEnMes = (examenes: Examen[] | null | undefined, year: number, month: number): boolean => Array.isArray(examenes) && examenes.some((ev) => {
    const fecha = parseEventDate(ev?.Fecha);
    return fecha.getFullYear() === year && fecha.getMonth() === month;
});
