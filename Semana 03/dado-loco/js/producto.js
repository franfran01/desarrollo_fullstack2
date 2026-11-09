/* ==========================================================
   Dado Loco - Detalle de un juego (producto.html?id=...)
   ========================================================== */

const idProducto = new URLSearchParams(location.search).get("id");
const producto = buscarProducto(idProducto ?? "");
const zonaDetalle = document.getElementById("detalle");

if (!producto) {
  zonaDetalle.innerHTML = `
    <div class="col-12 text-center">
      <h1>Juego no encontrado</h1>
      <p>Puede que ya no esté a la venta.</p>
      <a href="catalogo.html" class="boton">Ir al catálogo</a>
    </div>`;
} else {
  document.title = `${producto.nombre} | Dado Loco`;
  const conDescuento = producto.descuento > 0;
  const puedeComprar = usuarioActual()?.rol !== "admin";

  zonaDetalle.innerHTML = `
    <div class="col-12 col-md-6">
      <img src="${escapar(producto.imagen)}" alt="Imagen del juego ${escapar(producto.nombre)}" class="detalle-imagen">
    </div>
    <div class="col-12 col-md-6 d-flex flex-column gap-2">
      <a href="${producto.categoria}.html" class="small">${CATEGORIAS[producto.categoria]}</a>
      <h1 class="titulo-detalle">${escapar(producto.nombre)}</h1>
      <p class="precio">
        ${conDescuento ? `<del>${formatoPeso(producto.precio)}</del>` : ""}
        <strong>${formatoPeso(precioFinal(producto))}</strong>
        ${conDescuento ? `<span class="badge-descuento position-static">-${producto.descuento}%</span>` : ""}
      </p>
      <p>${escapar(producto.descripcion)}</p>
      <p class="descuento ${producto.stock > 3 ? "no" : "si"}">
        ${producto.stock === 0 ? "Agotado" : `Stock disponible: ${producto.stock}`}
      </p>
      ${puedeComprar && producto.stock > 0 ? `
      <form id="form-cantidad" class="d-flex flex-wrap align-items-start gap-2 mt-2" novalidate>
        <div>
          <label for="cantidad" class="form-label visually-hidden">Cantidad</label>
          <input type="number" class="form-control" id="cantidad" name="cantidad" value="1" min="1" max="${producto.stock}" required aria-describedby="error-cantidad" style="width: 7rem">
          <div class="invalid-feedback" id="error-cantidad"></div>
        </div>
        <button type="submit" class="boton">Agregar al carrito</button>
      </form>` : ""}
      <a href="catalogo.html" class="mt-3">&larr; Volver al catálogo</a>
    </div>`;

  const formCantidad = document.getElementById("form-cantidad");
  if (formCantidad) {
    const reglas = {
      cantidad: (v) =>
        esEnteroEntre(v.cantidad, 1, producto.stock) ? "" : `Elige una cantidad entre 1 y ${producto.stock}.`,
    };
    conectarFormulario(formCantidad, reglas, (valores, { mostrarMensaje, limpiarMarcas }) => {
      const agregados = agregarAlCarrito(producto.id, Number(valores.cantidad));
      limpiarMarcas();
      if (agregados) mostrarMensaje(`Agregaste ${agregados} unidad(es) de ${producto.nombre} al carrito.`);
      else mostrarMensaje("Ya tienes en el carrito todo el stock disponible de este juego.", "warning");
    });
  }
}
