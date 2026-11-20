// Script en línea del <head> (lo pone root.tsx): aplica .dark antes de pintar para que no haya destello
// blanco al abrir en oscuro. Lee lo que guarda useDarkMode en localStorage ('dark-mode', formato de
// zustand/persist; misma lógica que preferenciaDeEstado en tema.ts) y, si no hay preferencia, sigue a
// prefers-color-scheme. Va como texto porque se ejecuta antes que cualquier módulo: sin imports y en
// JS de navegador antiguo.
export const SCRIPT_TEMA_INICIAL = `(function () {
  var oscuro = null;
  try {
    var guardado = JSON.parse(localStorage.getItem('dark-mode') || 'null');
    var estado = guardado && guardado.state;
    if (estado && (estado.tema === 'claro' || estado.tema === 'oscuro')) {
      oscuro = estado.tema === 'oscuro';
    } else if (estado && typeof estado.isDark === 'boolean') {
      oscuro = estado.isDark;
    }
  } catch (e) {}
  if (oscuro === null) oscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', oscuro);
})();`
