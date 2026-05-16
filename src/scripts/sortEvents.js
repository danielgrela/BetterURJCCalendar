export default function parseEventDate(fecha) {
        if (!fecha) {
            return new Date(0);
        }

        const [day, monthValue, yearValue] = fecha.split('-').map(Number);
        if (!day || !monthValue || !yearValue) {
            return new Date(0);
        }

        return new Date(yearValue, monthValue - 1, day);
    }
export const sortedEvents = (jsonData) => Array.isArray(jsonData)
            ? [...jsonData]
                .filter((event) => event && event.Fecha)
                .sort((a, b) => {
                    const dateDiff = parseEventDate(a.Fecha) - parseEventDate(b.Fecha);
                    if (dateDiff !== 0) {
                        return dateDiff;
                    }
    
                    return (a.Hora || '').localeCompare(b.Hora || '');
                })
            : [];