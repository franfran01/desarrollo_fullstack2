/* ==========================================================
   Dado Loco - Catálogo y páginas de categoría
   Pinta las tarjetas desde los datos de tienda.js.
   ========================================================== */

const contenedorProductos = document.getElementById("productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroTexto = document.getElementById("filtro-texto");
const puedeComprar = usuarioActual()?.rol !== "admin";

function pintarProductos() {
  // Las páginas de categoría fijan la categoría con data-categoria; el catálogo usa el filtro
  const categoria = contenedorProductos.dataset.categoria || filtroCategoria?.value || "";
  const texto = (filtroTexto?.value ?? "").trim().toLowerCase();
  const lista = leerProductos().filter(
    (p) => (!categoria || p.categoria === categoria) && p.nombre.toLowerCase().includes(texto)
  );
  contenedorProductos.innerHTML = lista.length
    ? lista.map((p) => crearFicha(p, puedeComprar)).join("")
    : '<p class="col-12 text-center">No encontramos juegos con esa búsqueda.</p>';
}

filtroCategoria?.addEventListener("change", pintarProductos);
filtroTexto?.addEventListener("input", pintarProductos);

contenedorProductos.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-agregar]");
  if (boton) avisarEnBoton(boton, agregarAlCarrito(boton.dataset.agregar));
});

pintarProductos();
