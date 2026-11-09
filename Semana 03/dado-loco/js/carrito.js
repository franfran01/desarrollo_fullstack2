/* ==========================================================
   Dado Loco - Carrito y compra simulada
   ========================================================== */

const zonaCarrito = document.getElementById("zona-carrito");
const zonaCompra = document.getElementById("zona-compra");
const comprador = usuarioActual();

function pintarCarrito() {
  const detalle = detalleCarrito();
  if (!detalle.length) {
    zonaCarrito.innerHTML = `
      <div class="text-center">
        <p>Tu carrito está vacío.</p>
        <a href="catalogo.html" class="boton">Ver el catálogo</a>
      </div>`;
    zonaCompra.hidden = true;
    return;
  }

  const filas = detalle.map(({ producto: p, cantidad }) => `
    <tr>
      <td><img src="${escapar(p.imagen)}" alt="" class="miniatura"></td>
      <td><a href="producto.html?id=${encodeURIComponent(p.id)}">${escapar(p.nombre)}</a></td>
      <td>${formatoPeso(precioFinal(p))}</td>
      <td>
        <label class="visually-hidden" for="cant-${escapar(p.id)}">Cantidad de ${escapar(p.nombre)}</label>
        <input type="number" class="form-control form-control-sm" id="cant-${escapar(p.id)}" data-id="${escapar(p.id)}" value="${cantidad}" min="1" max="${p.stock}" style="width: 5rem">
      </td>
      <td>${formatoPeso(precioFinal(p) * cantidad)}</td>
      <td><button type="button" class="btn btn-sm btn-outline-danger" data-quitar="${escapar(p.id)}">Quitar</button></td>
    </tr>`).join("");

  zonaCarrito.innerHTML = `
    <div class="table-responsive tabla-tienda">
      <table class="table align-middle mb-0">
        <thead><tr><th></th><th>Juego</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
        <tfoot><tr><th colspan="4" class="text-end">Total</th><th colspan="2" id="total-carrito">${formatoPeso(totalDetalle(detalle))}</th></tr></tfoot>
      </table>
    </div>`;
  zonaCompra.hidden = false;
}

// Cambiar cantidad: se ajusta al rango 1..stock y se vuelve a pintar
zonaCarrito.addEventListener("change", (evento) => {
  const id = evento.target.dataset.id;
  if (!id) return;
  cambiarCantidad(id, Math.floor(Number(evento.target.value)) || 1);
  pintarCarrito();
});

zonaCarrito.addEventListener("click", (evento) => {
  const id = evento.target.closest("[data-quitar]")?.dataset.quitar;
  if (!id) return;
  quitarDelCarrito(id);
  pintarCarrito();
});

/* ---------- Confirmar compra (solo clientes con sesión) ---------- */

const formCompra = document.getElementById("form-compra");
const avisoSesion = document.getElementById("aviso-sesion");

if (!comprador || comprador.rol === "admin") {
  formCompra.hidden = true;
  avisoSesion.hidden = false;
  avisoSesion.innerHTML = comprador
    ? "Las cuentas de administrador no pueden comprar. Ingresa con una cuenta de cliente."
    : 'Para finalizar la compra debes <a href="login.html?volver=carrito.html">iniciar sesión</a> o <a href="registro.html">registrarte</a>.';
} else {
  document.getElementById("direccion").value = comprador.direccion ?? "";
  conectarFormulario(formCompra, validadoresCompra, (valores) => {
    const pedido = confirmarCompra(comprador, { direccion: valores.direccion.trim(), pago: valores.pago });
    if (!pedido) return pintarCarrito();
    document.getElementById("contenido-carrito").innerHTML = `
      <div class="alert alert-success text-center" role="alert">
        <h2 class="h4">¡Compra realizada correctamente! (simulación)</h2>
        <p class="mb-1">Pedido N° <strong>${pedido.numero}</strong> por <strong>${formatoPeso(pedido.total)}</strong>.</p>
        <p class="mb-0">Lo enviaremos a ${escapar(pedido.direccion)}. No se realizó ningún cobro real.</p>
      </div>
      <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
        <a href="historial.html" class="boton">Ver mis compras</a>
        <a href="catalogo.html" class="boton boton-inicio">Seguir comprando</a>
      </div>`;
  });
}

pintarCarrito();
