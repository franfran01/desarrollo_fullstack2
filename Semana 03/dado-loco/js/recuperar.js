/* ==========================================================
   Dado Loco - Recuperar contraseña (simulación)
   Solo valida el correo y muestra un mensaje de ejemplo.
   ========================================================== */

const formRecuperar = document.getElementById("form-recuperar");

conectarFormulario(formRecuperar, validadoresRecuperar, (valores, { mostrarMensaje }) => {
  const correo = valores.correo.trim();
  formRecuperar.reset();
  // Mensaje igual exista o no la cuenta, como en los sitios reales
  mostrarMensaje(`Si existe una cuenta con ${correo}, te enviamos un enlace para crear una contraseña nueva. (Simulación: no se envía ningún correo.)`);
});
