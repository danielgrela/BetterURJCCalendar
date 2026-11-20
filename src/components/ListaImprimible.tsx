import { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useExamenesVisibles } from '../hooks/useExamenesVisibles';
import usePreferencias from '../hooks/usePreferencias';
import { aulaLegible, claveEstable, claveExamen, fechaCorta, horaLegible, nombreLegible } from '../scripts/examen';
import { porMes, sortedEvents } from '../scripts/sortEvents';

// Hoja de impresión (o PDF) del calendario: la pinta App fuera de la interfaz, que se oculta con
// print:hidden. Lista lo que se ve en el calendario, por meses, con el estado de cada examen.
// Solo se monta entre beforeprint y afterprint (también con Ctrl+P): App se prerenderiza con la
// guía de uso y, si pintara datos guardados al hidratar, el HTML no cuadraría con el de Node
export default function ListaImprimible() {
    const [imprimiendo, setImprimiendo] = useState(false);
    const { visibles } = useExamenesVisibles();
    const estados = usePreferencias((state) => state.estados);
    const meses = useMemo(() => porMes(sortedEvents(visibles)), [visibles]);

    useEffect(() => {
        // flushSync: la hoja tiene que estar en el DOM antes de que el navegador maquete la impresión
        const antes = () => flushSync(() => setImprimiendo(true));
        const despues = () => setImprimiendo(false);
        window.addEventListener('beforeprint', antes);
        window.addEventListener('afterprint', despues);
        return () => {
            window.removeEventListener('beforeprint', antes);
            window.removeEventListener('afterprint', despues);
        };
    }, []);

    if (!imprimiendo || meses.length === 0) return null;

    return (
        <div className="hidden print:block p-4 text-texto">
            <h1 className="text-2xl font-bold">Mis exámenes</h1>
            <p className="text-sm text-texto-suave">Better URJC Calendar · impreso el {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            {meses.map(([mes, examenes]) => (
                <section key={mes} className="mt-6 break-inside-avoid-page">
                    <h2 className="text-lg font-bold first-letter:uppercase border-b-2 border-texto pb-1">{mes}</h2>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-start text-texto-suave">
                                <th scope="col" className="text-start font-semibold py-1 pe-3">Fecha</th>
                                <th scope="col" className="text-start font-semibold py-1 pe-3">Hora</th>
                                <th scope="col" className="text-start font-semibold py-1 pe-3">Asignatura</th>
                                <th scope="col" className="text-start font-semibold py-1 pe-3">Aula</th>
                                <th scope="col" className="text-start font-semibold py-1">Convocatoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {examenes.map((ev) => {
                                const estado = estados[claveEstable(ev)];
                                return (
                                    <tr key={claveExamen(ev)} className="border-t border-borde-fuerte break-inside-avoid">
                                        <td className="py-1.5 pe-3 whitespace-nowrap">{fechaCorta(ev.Fecha)}</td>
                                        <td className="py-1.5 pe-3 whitespace-nowrap tabular-nums">{horaLegible(ev.Hora)}</td>
                                        <td className="py-1.5 pe-3 font-medium">
                                            {nombreLegible(ev)}
                                            {estado && <span className="font-normal text-texto-suave"> · {estado === 'aprobado' ? 'Aprobado' : 'No me presento'}</span>}
                                        </td>
                                        <td className="py-1.5 pe-3">{aulaLegible(ev.Aula)}</td>
                                        <td className="py-1.5">{ev.Convocatoria}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            ))}
        </div>
    );
}
