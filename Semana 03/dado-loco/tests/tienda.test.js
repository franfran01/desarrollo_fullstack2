// Ejecutar desde la carpeta del proyecto con: node --test
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// Contexto aparte con un localStorage de mentira, para no mezclarse con sesion.test.js
const datos = new Map();
const contexto = vm.createContext({
  structuredClone,
  localStorage: {
    getItem: (k) => datos.get(k) ?? null,
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
  },
});
for (const archivo of ["sesion.js", "validaciones.js", "tienda.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../js", archivo), "utf8"), contexto);
}
const t = vm.runInContext(
  `({ precioFinal, leerProductos, agregarAlCarrito, cambiarCantidad, leerCarrito, detalleCarrito,
      totalDetalle, confirmarCompra, leerPedidos, buscarProducto, crearId, validadoresProducto, validadoresCompra })`,
  contexto
);

test("los precios con descuento son los mismos de la semana 2", () => {
  const precios = Object.fromEntries(t.leerProductos().map((p) => [p.id, t.precioFinal(p)]));
  assert.equal(precios.catan, 35990);
  assert.equal(precios["ticket-to-ride"], 38240);
  assert.equal(precios.pictionary, 19990);
  assert.equal(precios["isla-prohibida"], 18690);
  assert.equal(precios.uno, 6990);
});

test("el carrito nunca supera el stock", () => {
  assert.equal(t.agregarAlCarrito("ticket-to-ride", 5), 2); // solo hay 2
  assert.equal(t.agregarAlCarrito("ticket-to-ride"), 0);
  assert.equal(t.agregarAlCarrito("hanabi"), 0); // agotado
  assert.equal(t.agregarAlCarrito("no-existe"), 0);
  t.cambiarCantidad("ticket-to-ride", 99);
  assert.equal(t.leerCarrito()[0].cantidad, 2);
});

test("la compra simulada guarda el pedido, descuenta stock y vacía el carrito", () => {
  t.agregarAlCarrito("uno", 3);
  const total = t.totalDetalle(t.detalleCarrito());
  assert.equal(total, 2 * 38240 + 3 * 6990);
  const pedido = t.confirmarCompra({ usuario: "cliente" }, { direccion: "Calle 1", pago: "Transferencia" });
  assert.equal(pedido.numero, 1001);
  assert.equal(pedido.total, total);
  assert.equal(t.buscarProducto("ticket-to-ride").stock, 0);
  assert.equal(t.buscarProducto("uno").stock, 22);
  assert.equal(t.leerCarrito().length, 0);
  assert.equal(t.leerPedidos().length, 1);
  assert.equal(t.confirmarCompra({ usuario: "cliente" }, {}), null); // carrito vacío
});

test("ids nuevos sin tildes ni repetidos", () => {
  assert.equal(t.crearId("Dominó Ñandú"), "domino-nandu");
  assert.equal(t.crearId("Catan"), "catan-2");
});

test("validaciones del mantenedor de productos", () => {
  const bueno = { nombre: "Jenga", categoria: "familiares", precio: "12990", descuento: "0", stock: "4", descripcion: "Torre de bloques de madera." };
  for (const [campo, regla] of Object.entries(t.validadoresProducto)) assert.equal(regla(bueno), "", campo);
  assert.notEqual(t.validadoresProducto.precio({ precio: "999" }), "");
  assert.notEqual(t.validadoresProducto.precio({ precio: "12.5" }), "");
  assert.notEqual(t.validadoresProducto.descuento({ descuento: "95" }), "");
  assert.notEqual(t.validadoresProducto.stock({ stock: "-1" }), "");
  assert.notEqual(t.validadoresProducto.descripcion({ descripcion: "corta" }), "");
  assert.notEqual(t.validadoresCompra.pago({ pago: "" }), "");
  assert.notEqual(t.validadoresCompra.direccion({ direccion: " a " }), "");
});
