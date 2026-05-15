import { useFileStoreJsonFilters } from '../hooks/useFileStore';

const handleChange = (e, parseEventDate, sortedEvents) => {
    const { setDataFiltered } = useFileStoreJsonFilters.getState();
    let filtered = [...sortedEvents];

    const convocatoriaValue = document.getElementById('convocatoria')?.value;
    const fechaValue = document.getElementById('fecha')?.value;

    if (convocatoriaValue && convocatoriaValue !== 'Convocatoria') {
        filtered = filtered.filter(ev => ev.Convocatoria === convocatoriaValue);
    }

    if (fechaValue && fechaValue === 'Pendientes') {
        filtered = filtered.filter(ev => {
            const eventDate = parseEventDate(ev.Fecha);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
        });
    }
    setDataFiltered(filtered);
};
export default handleChange;