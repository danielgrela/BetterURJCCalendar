// Descarga un Blob con el nombre indicado mediante un enlace temporal
export const descargarBlob = (blob, nombre) => {
  const url = URL.createObjectURL(blob);
  const enlaceOculto = document.createElement('a');
  enlaceOculto.href = url;
  enlaceOculto.download = nombre;

  document.body.appendChild(enlaceOculto);
  enlaceOculto.click();
  document.body.removeChild(enlaceOculto);
  URL.revokeObjectURL(url);
};
