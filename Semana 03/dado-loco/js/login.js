/* ==========================================================
   Dado Loco - Inicio de sesión
   Compara con los usuarios guardados y abre la sesión.
   ========================================================== */

const formLogin = document.getElementById("form-login");

conectarFormulario(formLogin, validadoresLogin, (valores, { mostrarMensaje }) => {
  const usuario = buscarUsuario(valores.usuario);
  // Mismo mensaje para usuario o contraseña: no revela qué cuentas existen
  if (!usuario || usuario.clave !== valores.clave) {
    return mostrarMensaje("Usuario o contraseña incorrectos.", "danger");
  }
  iniciarSesion(usuario);
  // Solo se acepta volver a una página propia (ej. carrito.html), nunca a otro sitio
  const volver = new URLSearchParams(location.search).get("volver");
  if (volver && /^[a-z-]+\.html$/.test(volver)) location.href = volver;
  else location.href = usuario.rol === "admin" ? "admin.html" : "catalogo.html";
});
