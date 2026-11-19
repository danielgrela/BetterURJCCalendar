// Script en línea del <head> (lo pone root.tsx): aplica .dark antes de pintar para que no haya destello
// blanco al abrir en oscuro. Lee lo que guarda useDarkMode en localStorage ('dark-mode', formato de
// zustand/persist) y, si no hay nada guardado, sigue a prefers-color-scheme.
// Va como texto porque se ejecuta antes que cualquier módulo: sin imports y en JS de navegador antiguo.
export const SCRIPT_TEMA_INICIAL = `(function () {
  try {
    var guardado = JSON.parse(localStorage.getItem('dark-mode') || 'null');
    var estado = guardado && guardado.state;
    var oscuro = estado && typeof estado.isDark === 'boolean'
      ? estado.isDark
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', oscuro);
  } catch (e) {}
})();`
