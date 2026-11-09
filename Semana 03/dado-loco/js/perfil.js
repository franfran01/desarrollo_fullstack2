/* ==========================================================
   Dado Loco - Modificación de perfil
   Carga los datos del usuario conectado y guarda los cambios.
   ========================================================== */

const usuarioPerfil = exigirSesion();

const formPerfil = document.getElementById("form-perfil");
const CAMPOS_PERFIL = ["usuario", "nombre", "correo", "direccion"];

// defaultValue hace que el botón "Deshacer cambios" (reset) vuelva a los datos guardados
function cargarPerfil(datos) {
  for (const campo of CAMPOS_PERFIL) document.getElementById(campo).defaultValue = datos[campo] ?? "";
  document.getElementById("rol").textContent = datos.rol === "admin" ? "Administrador" : "Cliente";
  formPerfil.reset();
}

if (usuarioPerfil) cargarPerfil(usuarioPerfil);

conectarFormulario(formPerfil, validadoresPerfil, (valores, { marcarCampo, mostrarMensaje }) => {
  const correo = valores.correo.trim();
  const dueno = buscarUsuario(correo);
  if (dueno && dueno.usuario !== usuarioPerfil.usuario) {
    marcarCampo("correo", "Ese correo ya lo usa otra cuenta.");
    return document.getElementById("correo").focus();
  }

  const cambios = { nombre: valores.nombre.trim(), correo, direccion: valores.direccion.trim() };
  if (valores.clave) cambios.clave = valores.clave;
  actualizarUsuario(usuarioPerfil.usuario, cambios);

  cargarPerfil(usuarioActual());
  mostrarMensaje("Tus datos se guardaron correctamente.");
});
