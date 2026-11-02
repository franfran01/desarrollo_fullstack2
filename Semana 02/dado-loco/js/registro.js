/* ==========================================================
   Dado Loco - Comportamiento del formulario de registro
   Conecta las reglas de validaciones.js con el DOM.
   ========================================================== */

const formulario = document.getElementById("form-registro");
const leerValores = () => Object.fromEntries(new FormData(formulario));

// en-CA entrega la fecha local como AAAA-MM-DD, el formato que usa el input date
document.getElementById("fecha").max = new Date().toLocaleDateString("en-CA");

// Muestra el resultado en el campo cambiando sus clases, atributos y mensaje
function marcarCampo(nombre, error) {
  const campo = document.getElementById(nombre);
  campo.classList.toggle("is-invalid", error !== "");
  campo.classList.toggle("is-valid", error === "");
  campo.setAttribute("aria-invalid", error !== "");
  document.getElementById(`error-${nombre}`).textContent = error;
}

function validarCampo(nombre) {
  const error = validadores[nombre](leerValores());
  marcarCampo(nombre, error);
  return error === "";
}

function quitarMensaje() {
  document.getElementById("mensaje-exito")?.remove();
}

function mostrarMensaje(usuario) {
  const mensaje = document.createElement("div");
  mensaje.id = "mensaje-exito";
  mensaje.className = "alert alert-success mt-3";
  mensaje.setAttribute("role", "alert");
  mensaje.textContent = `¡Registro exitoso! Te damos la bienvenida a Dado Loco, ${usuario}.`;
  formulario.after(mensaje);
}

formulario.addEventListener("focusout", (evento) => {
  if (evento.target.name in validadores) validarCampo(evento.target.name);
});

// Mientras escribe solo se actualizan los campos que ya se revisaron, para no marcar errores antes de tiempo
formulario.addEventListener("input", (evento) => {
  const nombre = evento.target.name;
  const revisado = evento.target.matches(".is-valid, .is-invalid");
  if (nombre in validadores && revisado) validarCampo(nombre);
  if (nombre === "clave" && leerValores().repetir) validarCampo("repetir");
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  quitarMensaje();

  // map y no every: todos los campos deben mostrar su error, no solo el primero
  const resultados = Object.keys(validadores).map(validarCampo);
  if (resultados.includes(false)) {
    formulario.querySelector(".is-invalid").focus();
    return;
  }

  const { usuario } = leerValores();
  formulario.reset();
  mostrarMensaje(usuario.trim());
});

formulario.addEventListener("reset", () => {
  quitarMensaje();
  for (const nombre of Object.keys(validadores)) {
    const campo = document.getElementById(nombre);
    campo.classList.remove("is-valid", "is-invalid");
    campo.removeAttribute("aria-invalid");
  }
});
