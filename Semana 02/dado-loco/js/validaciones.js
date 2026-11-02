/* ==========================================================
   Dado Loco - Reglas de validación del formulario de registro
   Cada regla recibe los valores del formulario y devuelve el
   mensaje de error, o "" si el campo es válido.
   ========================================================== */

const EDAD_MINIMA = 13;
const CLAVE_MIN = 6;
const CLAVE_MAX = 18;

// Se separa "AAAA-MM-DD" a mano: new Date(texto) lo lee en UTC y en Chile restaría un día
function calcularEdad(fecha, hoy = new Date()) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const mesActual = hoy.getMonth() + 1;
  const yaCumplio = mesActual > mes || (mesActual === mes && hoy.getDate() >= dia);
  return hoy.getFullYear() - anio - (yaCumplio ? 0 : 1);
}

const validadores = {
  nombre: (v) => (v.nombre.trim() ? "" : "Ingresa tu nombre completo."),

  usuario: (v) => (v.usuario.trim() ? "" : "Ingresa un nombre de usuario."),

  correo: (v) => {
    if (!v.correo.trim()) return "Ingresa tu correo electrónico.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.correo.trim())
      ? ""
      : "El correo debe tener un formato válido, como nombre@dominio.cl.";
  },

  clave: (v) => {
    if (!v.clave) return "Ingresa una contraseña.";
    if (v.clave.length < CLAVE_MIN || v.clave.length > CLAVE_MAX) {
      return `La contraseña debe tener entre ${CLAVE_MIN} y ${CLAVE_MAX} caracteres.`;
    }
    if (!/\d/.test(v.clave)) return "La contraseña debe tener al menos un número.";
    // \p{Lu} también reconoce mayúsculas como Ñ o Á
    if (!/\p{Lu}/u.test(v.clave)) return "La contraseña debe tener al menos una letra mayúscula.";
    return "";
  },

  repetir: (v) => {
    if (!v.repetir) return "Repite la contraseña.";
    return v.repetir === v.clave ? "" : "Las contraseñas no coinciden.";
  },

  fecha: (v, hoy) => {
    if (!v.fecha) return "Ingresa tu fecha de nacimiento.";
    return calcularEdad(v.fecha, hoy) >= EDAD_MINIMA
      ? ""
      : `Debes tener al menos ${EDAD_MINIMA} años para registrarte.`;
  },
};
