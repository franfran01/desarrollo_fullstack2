/* ==========================================================
   Dado Loco - Usuarios y sesión simulados
   Los usuarios se guardan en localStorage del navegador.
   La primera vez se cargan las dos cuentas de prueba.
   ========================================================== */

// shortcut: usuarios y contraseñas en texto plano en el navegador; reemplazar por un backend cuando exista
const CUENTAS_DEMO = [
  { usuario: "admin", nombre: "Administradora Dado Loco", correo: "admin@dadoloco.cl", clave: "Admin123", rol: "admin", direccion: "" },
  { usuario: "cliente", nombre: "Camila Rojas", correo: "cliente@dadoloco.cl", clave: "Cliente123", rol: "cliente", direccion: "Av. Siempre Viva 742, Santiago" },
];

const CLAVE_USUARIOS = "dadoloco.usuarios";
const CLAVE_SESION = "dadoloco.sesion";
const CLAVE_CARRITO = "dadoloco.carrito";

// Si el navegador bloquea localStorage o el dato está dañado, se usan los datos iniciales
function leerGuardado(clave, inicial) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? structuredClone(inicial);
  } catch {
    return structuredClone(inicial);
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Evita que texto escrito por usuarios se interprete como HTML
const escapar = (texto) => String(texto).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const leerUsuarios = () => leerGuardado(CLAVE_USUARIOS, CUENTAS_DEMO);
const guardarUsuarios = (lista) => guardar(CLAVE_USUARIOS, lista);

// Acepta nombre de usuario o correo, sin importar mayúsculas
function buscarUsuario(texto, lista = leerUsuarios()) {
  const buscado = texto.trim().toLowerCase();
  return lista.find((u) => u.usuario.toLowerCase() === buscado || u.correo.toLowerCase() === buscado);
}

function agregarUsuario(datos) {
  const lista = leerUsuarios();
  lista.push(datos);
  guardarUsuarios(lista);
}

// Se busca por usuario porque el nombre de usuario no se puede cambiar
function actualizarUsuario(usuario, cambios) {
  const lista = leerUsuarios();
  Object.assign(lista.find((u) => u.usuario === usuario), cambios);
  guardarUsuarios(lista);
}

function usuarioActual() {
  const usuario = localStorage.getItem(CLAVE_SESION);
  return usuario ? buscarUsuario(usuario) : undefined;
}

// Devuelve el usuario conectado, o redirige si no puede ver la página
function exigirSesion(rol) {
  const usuario = usuarioActual();
  if (!usuario) location.replace("login.html?volver=" + location.pathname.split("/").pop());
  else if (rol && usuario.rol !== rol) location.replace("index.html");
  else return usuario;
}

function iniciarSesion(usuario) {
  localStorage.setItem(CLAVE_SESION, usuario.usuario);
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  location.href = "index.html";
}

/* ---------- Menú según la sesión y el rol ---------- */

const paginaActual = () => location.pathname.split("/").pop() || "index.html";

function agregarAlMenu(menu, html, destino) {
  const item = document.createElement("li");
  item.className = "nav-item";
  const enlace = document.createElement(typeof destino === "string" ? "a" : "button");
  enlace.className = "nav-link";
  enlace.innerHTML = html;
  if (typeof destino === "string") {
    enlace.href = destino;
  } else {
    enlace.type = "button";
    enlace.addEventListener("click", destino);
  }
  item.append(enlace);
  menu.append(item);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = leerGuardado(CLAVE_CARRITO, []).reduce((suma, i) => suma + i.cantidad, 0);
}

function marcarPaginaActiva(menu) {
  for (const enlace of menu.querySelectorAll("a[href]")) {
    if (enlace.getAttribute("href") !== paginaActual()) continue;
    enlace.setAttribute("aria-current", "page");
    enlace.classList.add(enlace.classList.contains("dropdown-item") ? "active" : "activo");
    // Si es una categoría, también se marca el botón "Categorías"
    enlace.closest(".dropdown")?.querySelector(".dropdown-toggle").classList.add("activo");
  }
}

function pintarMenuSesion() {
  const menu = document.querySelector(".menu");
  if (!menu) return;
  const usuario = usuarioActual();
  const carrito = 'Carrito <span class="badge rounded-pill text-bg-warning" id="contador-carrito">0</span>';

  if (!usuario) {
    agregarAlMenu(menu, carrito, "carrito.html");
    agregarAlMenu(menu, "Ingresar", "login.html");
    agregarAlMenu(menu, "Registro", "registro.html");
  } else if (usuario.rol === "admin") {
    agregarAlMenu(menu, "Administración", "admin.html");
    agregarAlMenu(menu, "Ventas", "historial.html");
    agregarAlMenu(menu, "Mi perfil", "perfil.html");
    agregarAlMenu(menu, "Cerrar sesión", cerrarSesion);
  } else {
    agregarAlMenu(menu, carrito, "carrito.html");
    agregarAlMenu(menu, "Mis compras", "historial.html");
    agregarAlMenu(menu, "Mi perfil", "perfil.html");
    agregarAlMenu(menu, "Cerrar sesión", cerrarSesion);
  }
  marcarPaginaActiva(menu);
  actualizarContadorCarrito();
}

if (typeof document !== "undefined") pintarMenuSesion();
