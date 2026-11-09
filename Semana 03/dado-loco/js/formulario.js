/* ==========================================================
   Dado Loco - Comportamiento común de los formularios
   Conecta un objeto de reglas (validaciones.js) con el DOM:
   marca campos, muestra errores y mensajes.
   ========================================================== */

// alEnviar(valores, herramientas) se llama solo cuando todos los campos son válidos
function conectarFormulario(formulario, reglas, alEnviar) {
  const leerValores = () => Object.fromEntries(new FormData(formulario));
  let mensaje;

  // Muestra el resultado en el campo cambiando sus clases, atributos y mensaje
  function marcarCampo(nombre, error) {
    const campo = document.getElementById(nombre);
    campo.classList.toggle("is-invalid", error !== "");
    campo.classList.toggle("is-valid", error === "");
    campo.setAttribute("aria-invalid", error !== "");
    document.getElementById(`error-${nombre}`).textContent = error;
  }

  function validarCampo(nombre) {
    const error = reglas[nombre](leerValores());
    marcarCampo(nombre, error);
    return error === "";
  }

  function quitarMensaje() {
    mensaje?.remove();
  }

  function mostrarMensaje(texto, tipo = "success") {
    quitarMensaje();
    mensaje = document.createElement("div");
    mensaje.className = `alert alert-${tipo} mt-3`;
    mensaje.setAttribute("role", "alert");
    mensaje.textContent = texto;
    formulario.after(mensaje);
  }

  function limpiarMarcas() {
    for (const nombre of Object.keys(reglas)) {
      const campo = document.getElementById(nombre);
      campo.classList.remove("is-valid", "is-invalid");
      campo.removeAttribute("aria-invalid");
    }
  }

  formulario.addEventListener("focusout", (evento) => {
    if (evento.target.name in reglas) validarCampo(evento.target.name);
  });

  // Mientras escribe solo se actualizan los campos que ya se revisaron, para no marcar errores antes de tiempo
  formulario.addEventListener("input", (evento) => {
    const nombre = evento.target.name;
    const revisado = evento.target.matches(".is-valid, .is-invalid");
    if (nombre in reglas && revisado) validarCampo(nombre);
    if (nombre === "clave" && "repetir" in reglas && leerValores().repetir) validarCampo("repetir");
  });

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    quitarMensaje();

    // map y no every: todos los campos deben mostrar su error, no solo el primero
    const resultados = Object.keys(reglas).map(validarCampo);
    if (resultados.includes(false)) {
      formulario.querySelector(".is-invalid").focus();
      return;
    }
    alEnviar(leerValores(), { marcarCampo, mostrarMensaje, limpiarMarcas });
  });

  formulario.addEventListener("reset", () => {
    quitarMensaje();
    limpiarMarcas();
  });
}
