// Script en línea del <head> (lo pone root.tsx): aplica .dark y data-tema antes de pintar para que no
// haya destello blanco al abrir en oscuro. Lee lo que guarda useDarkMode en localStorage ('dark-mode',
// formato de zustand/persist; misma lógica que temaDeEstado en tema.ts) y, en 'sistema', sigue a
// prefers-color-scheme. Va como texto porque se ejecuta antes que cualquier módulo: sin imports y en
// JS de navegador antiguo.
export const SCRIPT_TEMA_INICIAL = `(function () {
  var tema = 'sistema';
  try {
    var guardado = JSON.parse(localStorage.getItem('dark-mode') || 'null');
    var estado = guardado && guardado.state;
    if (estado && (estado.tema === 'sistema' || estado.tema === 'claro' || estado.tema === 'oscuro')) {
      tema = estado.tema;
    } else if (estado && typeof estado.isDark === 'boolean') {
      tema = estado.isDark ? 'oscuro' : 'claro';
    }
  } catch (e) {}
  var raiz = document.documentElement;
  raiz.setAttribute('data-tema', tema);
  raiz.classList.toggle('dark', tema === 'oscuro' ||
    (tema === 'sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches));
})();`
