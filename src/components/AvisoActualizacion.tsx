import { useRegisterSW } from 'virtual:pwa-register/react';
import { IconInfoCircle } from '@tabler/icons-react';

const UNA_HORA = 60 * 60 * 1000;

// Registra el service worker (uso sin conexión) y avisa cuando hay una versión nueva desplegada.
// No recarga sola: la versión nueva se activa al pulsar «Actualizar» o al cerrar todas las pestañas.
export default function AvisoActualizacion() {
    const {
        needRefresh: [hayVersionNueva, setHayVersionNueva],
        updateServiceWorker,
    } = useRegisterSW({
        // Si la pestaña se queda abierta mucho tiempo, se comprueba cada hora si hay versión nueva
        onRegisteredSW(_url, registro) {
            if (registro) setInterval(() => registro.update(), UNA_HORA);
        },
    });

    if (!hayVersionNueva) return null;

    return (
        <div role="status" className="fixed z-50 inset-x-4 bottom-28 lg:inset-x-auto lg:left-8 lg:bottom-8 lg:max-w-sm flex flex-col gap-4 p-4 rounded-sm border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm text-secundario dark:text-gray-200 shadow-md">
            <p className="flex flex-row gap-3 items-center">
                <IconInfoCircle className="min-w-5" stroke={2} />
                Hay una versión nueva de la app.
            </p>
            <div className="flex flex-row gap-2 justify-end">
                <button type="button" onClick={() => setHayVersionNueva(false)} className="min-h-11 px-4 rounded border border-gray-300 dark:border-gray-600 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Ahora no
                </button>
                <button type="button" onClick={() => updateServiceWorker(true)} className="min-h-11 px-4 rounded bg-primary text-white font-semibold cursor-pointer hover:brightness-90">
                    Actualizar
                </button>
            </div>
        </div>
    );
}
