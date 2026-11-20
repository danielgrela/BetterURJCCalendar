import { useEffect, useRef } from 'react';
import { IconShare } from '@tabler/icons-react';
import type { Examen } from '../types/examen';
import { nombreLegible } from '../scripts/examen';

interface Props {
    examenes: Examen[];
    hayImportados: boolean;
    hayPropios: boolean;
    alImportar: () => void;
    alDescartar: () => void;
}

const ASIGNATURAS_VISIBLES = 4;

// Quien abre un enlace compartido llega a una página de subida de archivos: sin este aviso
// destacado arriba, el calendario recibido pasaba desapercibido y se salía sin importarlo
export default function AvisoCompartido({ examenes, hayImportados, hayPropios, alImportar, alDescartar }: Props) {
    const ref = useRef<HTMLElement>(null);
    // Se lleva el foco al aviso para que el lector de pantalla lo anuncie y, en móvil, quede a la vista
    useEffect(() => { ref.current?.focus(); }, []);
    const asignaturas = [...new Set(examenes.map(nombreLegible))];
    const resto = asignaturas.length - ASIGNATURAS_VISIBLES;
    return (
        <section ref={ref} tabIndex={-1} aria-labelledby="compartido-titulo" className="mt-6 rounded-sm border-2 border-primary bg-superficie p-5 lg:p-6 shadow-md dark:shadow-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <div className="flex flex-row gap-4 items-start">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-primary text-sobre-primary" aria-hidden="true">
                    <IconShare stroke={2} />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                    <h2 id="compartido-titulo" className="text-xl font-bold">Te han compartido un calendario</h2>
                    <p className="text-texto">
                        {examenes.length === 1 ? '1 examen' : `${examenes.length} exámenes`} de {asignaturas.length === 1 ? '1 asignatura' : `${asignaturas.length} asignaturas`}. Todavía no está guardado: pulsa «Importar calendario» para añadirlo a este navegador.
                    </p>
                    <ul className="flex flex-row flex-wrap gap-2 mt-1" aria-label="Asignaturas">
                        {asignaturas.slice(0, ASIGNATURAS_VISIBLES).map((nombre) => (
                            <li key={nombre} className="rounded-sm bg-superficie-alta px-2 py-1 text-sm font-medium max-w-full truncate">{nombre}</li>
                        ))}
                        {resto > 0 && <li className="px-2 py-1 text-sm text-texto-suave">y {resto} más</li>}
                    </ul>
                    {(hayImportados || hayPropios) && (
                        <p className="text-sm text-texto-suave">
                            {hayImportados ? 'Sustituirá lo que tienes importado' : 'Se añadirá a tu calendario'}{hayPropios ? '; los exámenes que has creado a mano se mantienen' : ''}.
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 lg:flex-row lg:justify-end">
                <button type="button" onClick={alDescartar} className="min-h-11 inline-flex items-center justify-center px-6 font-medium border border-borde-fuerte bg-superficie text-texto cursor-pointer hover:bg-superficie-alta transition-colors">Ahora no</button>
                <button type="button" onClick={alImportar} className="min-h-11 inline-flex items-center justify-center px-6 font-medium bg-primary text-sobre-primary cursor-pointer hover:brightness-90">Importar calendario</button>
            </div>
        </section>
    );
}
