/* ==========================================================
   Dado Loco - Formulario de registro
   Valida, revisa que el usuario y el correo no existan
   y guarda la cuenta nueva con rol "cliente".
   ========================================================== */

const formRegistro = document.getElementById("form-registro");

// en-CA entrega la fecha local como AAAA-MM-DD, el formato que usa el input date
document.getElementById("fecha").max = new Date().toLocaleDateString("en-CA");

conectarFormulario(formRegistro, validadores, (valores, { marcarCampo, mostrarMensaje }) => {
  const usuario = valores.usuario.trim();
  const correo = valores.correo.trim();
  const usuarioTomado = Boolean(buscarUsuario(usuario));
  const correoTomado = Boolean(buscarUsuario(correo));
  if (usuarioTomado) marcarCampo("usuario", "Ese nombre de usuario ya está registrado.");
  if (correoTomado) marcarCampo("correo", "Ese correo ya está registrado.");
  if (usuarioTomado || correoTomado) return formRegistro.querySelector(".is-invalid").focus();

  agregarUsuario({
    usuario,
    nombre: valores.nombre.trim(),
    correo,
    clave: valores.clave,
    fecha: valores.fecha,
    direccion: valores.direccion.trim(),
    rol: "cliente",
  });
  formRegistro.reset();
  mostrarMensaje(`¡Registro exitoso! Te damos la bienvenida a Dado Loco, ${usuario}. Ya puedes iniciar sesión.`);
});
