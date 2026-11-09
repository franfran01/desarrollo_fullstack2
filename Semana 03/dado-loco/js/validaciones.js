/* ==========================================================
   Dado Loco - Reglas de validación de los formularios
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

const validadoresLogin = {
  usuario: (v) => (v.usuario.trim() ? "" : "Ingresa tu usuario o correo."),
  clave: (v) => (v.clave ? "" : "Ingresa tu contraseña."),
};

const validadoresRecuperar = { correo: validadores.correo };

// En el perfil la contraseña nueva es opcional: si se deja vacía, se mantiene la actual
const validadoresPerfil = {
  nombre: validadores.nombre,
  correo: validadores.correo,
  clave: (v) => (v.clave ? validadores.clave(v) : ""),
  repetir: (v) => (v.clave || v.repetir ? validadores.repetir(v) : ""),
};

const esEnteroEntre = (texto, min, max) => /^\d+$/.test(texto) && Number(texto) >= min && Number(texto) <= max;

// Mantenedor de productos del administrador
const validadoresProducto = {
  nombre: (v) => (v.nombre.trim().length >= 2 ? "" : "Ingresa el nombre del juego (mínimo 2 caracteres)."),
  categoria: (v) => (v.categoria ? "" : "Elige una categoría."),
  precio: (v) => (esEnteroEntre(v.precio, 1000, 1000000) ? "" : "El precio debe ser un número entero entre 1.000 y 1.000.000."),
  descuento: (v) => (esEnteroEntre(v.descuento, 0, 90) ? "" : "El descuento debe ser un número entero entre 0 y 90."),
  stock: (v) => (esEnteroEntre(v.stock, 0, 999) ? "" : "El stock debe ser un número entero entre 0 y 999."),
  descripcion: (v) => {
    const largo = v.descripcion.trim().length;
    return largo >= 10 && largo <= 200 ? "" : "La descripción debe tener entre 10 y 200 caracteres.";
  },
};

// Datos de despacho al confirmar la compra
const validadoresCompra = {
  direccion: (v) => (v.direccion.trim().length >= 5 ? "" : "Ingresa una dirección de despacho (mínimo 5 caracteres)."),
  pago: (v) => (v.pago ? "" : "Elige un medio de pago."),
};
