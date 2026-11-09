/* ==========================================================
   Dado Loco - Historial de compras
   El cliente ve sus pedidos; el administrador ve todas las ventas.
   ========================================================== */

const lector = exigirSesion();

if (lector) {
  const esAdmin = lector.rol === "admin";
  const pedidos = leerPedidos()
    .filter((p) => esAdmin || p.usuario === lector.usuario)
    .reverse(); // los más nuevos primero

  if (esAdmin) {
    document.getElementById("titulo-historial").textContent = "Ventas";
    document.getElementById("bajada-historial").textContent = "Todos los pedidos realizados en la tienda.";
  }

  const zona = document.getElementById("zona-historial");
  if (!pedidos.length) {
    zona.innerHTML = `<p class="text-center">Todavía no hay compras registradas.</p>
      ${esAdmin ? "" : '<p class="text-center"><a href="catalogo.html" class="boton">Ir al catálogo</a></p>'}`;
  } else {
    const filas = pedidos.map((p) => `
      <tr>
        <td>${p.numero}</td>
        <td>${new Date(p.fecha).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}</td>
        ${esAdmin ? `<td>${escapar(p.usuario)}</td>` : ""}
        <td><ul class="mb-0 ps-3">${p.items.map((i) => `<li>${i.cantidad} × ${escapar(i.nombre)}</li>`).join("")}</ul></td>
        <td>${escapar(p.pago)}</td>
        <td><strong>${formatoPeso(p.total)}</strong></td>
      </tr>`).join("");
    const total = pedidos.reduce((suma, p) => suma + p.total, 0);
    zona.innerHTML = `
      <div class="table-responsive tabla-tienda">
        <table class="table align-middle mb-0">
          <thead><tr><th>N°</th><th>Fecha</th>${esAdmin ? "<th>Cliente</th>" : ""}<th>Productos</th><th>Pago</th><th>Total</th></tr></thead>
          <tbody>${filas}</tbody>
          <tfoot><tr><th colspan="${esAdmin ? 5 : 4}" class="text-end">Total ${esAdmin ? "vendido" : "comprado"}</th><th>${formatoPeso(total)}</th></tr></tfoot>
        </table>
      </div>`;
  }
}
