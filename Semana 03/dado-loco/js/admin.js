/* ==========================================================
   Dado Loco - Panel de administración (solo rol admin)
   Mantenedor de productos e inventario, y de usuarios.
   ========================================================== */

const administrador = exigirSesion("admin");

const formProducto = document.getElementById("form-producto");
const tablaProductos = document.getElementById("tabla-productos");
const tablaUsuarios = document.getElementById("tabla-usuarios");

/* ---------- Resumen ---------- */

function pintarResumen() {
  const productos = leerProductos();
  document.getElementById("res-productos").textContent = productos.length;
  document.getElementById("res-agotados").textContent = productos.filter((p) => p.stock === 0).length;
  document.getElementById("res-usuarios").textContent = leerUsuarios().length;
  document.getElementById("res-ventas").textContent = formatoPeso(leerPedidos().reduce((s, p) => s + p.total, 0));
}

/* ---------- Productos e inventario ---------- */

function pintarProductosAdmin() {
  tablaProductos.innerHTML = leerProductos().map((p) => `
    <tr>
      <td><img src="${escapar(p.imagen)}" alt="" class="miniatura"></td>
      <td>${escapar(p.nombre)}</td>
      <td>${CATEGORIAS[p.categoria] ?? escapar(p.categoria)}</td>
      <td>${formatoPeso(p.precio)}</td>
      <td>${p.descuento}%</td>
      <td><span class="badge ${p.stock === 0 ? "text-bg-danger" : p.stock <= 3 ? "text-bg-warning" : "text-bg-success"}">${p.stock}</span></td>
      <td class="text-nowrap">
        <button type="button" class="btn btn-sm btn-outline-primary" data-editar="${escapar(p.id)}">Editar</button>
        <button type="button" class="btn btn-sm btn-outline-danger" data-eliminar="${escapar(p.id)}">Eliminar</button>
      </td>
    </tr>`).join("");
  pintarResumen();
}

function modoFormulario(producto) {
  document.getElementById("titulo-form-producto").textContent = producto ? `Editar: ${producto.nombre}` : "Agregar juego";
  document.getElementById("btn-guardar-producto").textContent = producto ? "Guardar cambios" : "Agregar juego";
}

tablaProductos.addEventListener("click", (evento) => {
  const editar = evento.target.closest("[data-editar]")?.dataset.editar;
  const eliminar = evento.target.closest("[data-eliminar]")?.dataset.eliminar;

  if (editar) {
    const p = buscarProducto(editar);
    formProducto.reset();
    for (const campo of ["id", "nombre", "categoria", "precio", "descuento", "stock", "descripcion"]) {
      formProducto.elements[campo].value = p[campo];
    }
    modoFormulario(p);
    formProducto.scrollIntoView({ behavior: "smooth" });
    formProducto.elements.nombre.focus({ preventScroll: true });
  }

  if (eliminar) {
    const p = buscarProducto(eliminar);
    if (!confirm(`¿Eliminar "${p.nombre}" del catálogo?`)) return;
    guardarProductos(leerProductos().filter((x) => x.id !== eliminar));
    pintarProductosAdmin();
  }
});

// Al limpiar el formulario se vuelve al modo "Agregar" (el input oculto id queda vacío)
formProducto.addEventListener("reset", () => modoFormulario(null));

conectarFormulario(formProducto, validadoresProducto, (valores, { mostrarMensaje }) => {
  const datos = {
    nombre: valores.nombre.trim(),
    categoria: valores.categoria,
    precio: Number(valores.precio),
    descuento: Number(valores.descuento),
    stock: Number(valores.stock),
    descripcion: valores.descripcion.trim(),
  };
  const productos = leerProductos();

  if (valores.id) {
    Object.assign(buscarProducto(valores.id, productos), datos);
  } else {
    // Los juegos nuevos usan la imagen de su categoría
    productos.push({ id: crearId(datos.nombre, productos), imagen: `img/cat-${datos.categoria}.svg`, ...datos });
  }
  guardarProductos(productos);
  formProducto.reset();
  pintarProductosAdmin();
  mostrarMensaje(valores.id ? `Se guardaron los cambios de ${datos.nombre}.` : `${datos.nombre} se agregó al catálogo.`);
});

/* ---------- Usuarios ---------- */

function pintarUsuarios() {
  tablaUsuarios.innerHTML = leerUsuarios().map((u) => {
    const yo = u.usuario === administrador.usuario;
    return `
    <tr>
      <td>${escapar(u.usuario)}${yo ? ' <span class="badge text-bg-secondary">tú</span>' : ""}</td>
      <td>${escapar(u.nombre)}</td>
      <td>${escapar(u.correo)}</td>
      <td>
        <label class="visually-hidden" for="rol-${escapar(u.usuario)}">Rol de ${escapar(u.usuario)}</label>
        <select class="form-select form-select-sm" id="rol-${escapar(u.usuario)}" data-rol="${escapar(u.usuario)}" ${yo ? "disabled" : ""}>
          <option value="cliente" ${u.rol === "cliente" ? "selected" : ""}>Cliente</option>
          <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Administrador</option>
        </select>
      </td>
      <td><button type="button" class="btn btn-sm btn-outline-danger" data-borrar-usuario="${escapar(u.usuario)}" ${yo ? "disabled" : ""}>Eliminar</button></td>
    </tr>`;
  }).join("");
  pintarResumen();
}

// No se puede quitar el rol ni borrar la cuenta propia, para no quedar sin administrador
tablaUsuarios.addEventListener("change", (evento) => {
  const usuario = evento.target.dataset.rol;
  if (usuario) actualizarUsuario(usuario, { rol: evento.target.value });
});

tablaUsuarios.addEventListener("click", (evento) => {
  const usuario = evento.target.closest("[data-borrar-usuario]")?.dataset.borrarUsuario;
  if (!usuario || !confirm(`¿Eliminar la cuenta "${usuario}"?`)) return;
  guardarUsuarios(leerUsuarios().filter((u) => u.usuario !== usuario));
  pintarUsuarios();
});

if (administrador) {
  pintarProductosAdmin();
  pintarUsuarios();
}
