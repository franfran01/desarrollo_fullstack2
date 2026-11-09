/* ==========================================================
   Dado Loco - Productos, carrito y pedidos (simulados)
   Todo se guarda en localStorage. Los productos parten con
   los 12 juegos de la semana 2 y el admin puede cambiarlos.
   ========================================================== */

// v3: las imágenes pasaron de .svg a .webp; la clave nueva evita usar rutas viejas guardadas
const CLAVE_PRODUCTOS = "dadoloco.productos.v3";
const CLAVE_PEDIDOS = "dadoloco.pedidos";

const CATEGORIAS = {
  estrategia: "Estrategia",
  familiares: "Familiares",
  cartas: "Cartas",
  cooperativos: "Cooperativos",
};

const PRODUCTOS_INICIALES = [
  { id: "catan", nombre: "Catan", categoria: "estrategia", precio: 39990, descuento: 10, stock: 8, imagen: "img/catan.webp", descripcion: "Coloniza una isla, comercia recursos y construye caminos y ciudades. De 3 a 4 jugadores." },
  { id: "carcassonne", nombre: "Carcassonne", categoria: "estrategia", precio: 29990, descuento: 0, stock: 5, imagen: "img/carcassonne.webp", descripcion: "Arma el paisaje medieval loseta a loseta y coloca a tus seguidores en ciudades y caminos." },
  { id: "ticket-to-ride", nombre: "¡Aventureros al Tren!", categoria: "estrategia", precio: 44990, descuento: 15, stock: 2, imagen: "img/ticket-to-ride.webp", descripcion: "Conecta ciudades con rutas de tren y completa tus billetes de destino antes que el resto." },
  { id: "dixit", nombre: "Dixit", categoria: "familiares", precio: 32990, descuento: 0, stock: 6, imagen: "img/dixit.webp", descripcion: "Usa tu imaginación para describir cartas ilustradas y adivina la carta de los demás." },
  { id: "pictionary", nombre: "Pictionary", categoria: "familiares", precio: 24990, descuento: 20, stock: 10, imagen: "img/pictionary.webp", descripcion: "Dibuja contra el reloj y haz que tu equipo adivine la palabra secreta." },
  { id: "monopoly", nombre: "Monopoly", categoria: "familiares", precio: 27990, descuento: 0, stock: 4, imagen: "img/monopoly.webp", descripcion: "Compra propiedades, construye hoteles y lleva a la quiebra a tus rivales." },
  { id: "uno", nombre: "UNO", categoria: "cartas", precio: 6990, descuento: 0, stock: 25, imagen: "img/uno.webp", descripcion: "El clásico de colores y números: deshazte de todas tus cartas y no olvides gritar ¡UNO!" },
  { id: "exploding-kittens", nombre: "Exploding Kittens", categoria: "cartas", precio: 19990, descuento: 10, stock: 7, imagen: "img/exploding-kittens.webp", descripcion: "Ruleta rusa con gatitos: evita robar el gatito explosivo o quedas fuera." },
  { id: "dobble", nombre: "Dobble", categoria: "cartas", precio: 15990, descuento: 0, stock: 12, imagen: "img/dobble.webp", descripcion: "Encuentra el único símbolo en común entre dos cartas antes que nadie." },
  { id: "pandemic", nombre: "Pandemic", categoria: "cooperativos", precio: 42990, descuento: 10, stock: 3, imagen: "img/pandemic.webp", descripcion: "Viaja por el mundo como equipo de especialistas para curar cuatro enfermedades." },
  { id: "hanabi", nombre: "Hanabi", categoria: "cooperativos", precio: 12990, descuento: 0, stock: 0, imagen: "img/hanabi.webp", descripcion: "Arma el espectáculo de fuegos artificiales perfecto viendo las cartas de todos menos las tuyas." },
  { id: "isla-prohibida", nombre: "La Isla Prohibida", categoria: "cooperativos", precio: 21990, descuento: 15, stock: 9, imagen: "img/isla-prohibida.webp", descripcion: "Recupera los cuatro tesoros sagrados antes de que la isla se hunda bajo el mar." },
];

/* ---------- Productos ---------- */

const leerProductos = () => leerGuardado(CLAVE_PRODUCTOS, PRODUCTOS_INICIALES);
const guardarProductos = (lista) => guardar(CLAVE_PRODUCTOS, lista);
const buscarProducto = (id, lista = leerProductos()) => lista.find((p) => p.id === id);

// Se redondea a la decena, igual que los precios de oferta de la semana 2
const precioFinal = (p) => Math.round((p.precio * (100 - p.descuento)) / 1000) * 10;
const formatoPeso = (monto) => "$" + monto.toLocaleString("es-CL");

// Id legible a partir del nombre: "La Isla Prohibida" -> "la-isla-prohibida"
function crearId(nombre, lista = leerProductos()) {
  const base = nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "juego";
  let id = base;
  for (let n = 2; buscarProducto(id, lista); n++) id = `${base}-${n}`;
  return id;
}

/* ---------- Carrito: lista de { id, cantidad } ---------- */

const leerCarrito = () => leerGuardado(CLAVE_CARRITO, []);

function guardarCarrito(carrito) {
  guardar(CLAVE_CARRITO, carrito);
  if (typeof document !== "undefined") actualizarContadorCarrito();
}

// Devuelve cuántas unidades se agregaron de verdad (nunca más que el stock)
function agregarAlCarrito(id, cantidad = 1) {
  const producto = buscarProducto(id);
  if (!producto) return 0;
  const carrito = leerCarrito();
  const item = carrito.find((i) => i.id === id);
  const antes = item?.cantidad ?? 0;
  const despues = Math.min(antes + cantidad, producto.stock);
  if (despues <= antes) return 0;
  if (item) item.cantidad = despues;
  else carrito.push({ id, cantidad: despues });
  guardarCarrito(carrito);
  return despues - antes;
}

function cambiarCantidad(id, cantidad) {
  const carrito = leerCarrito();
  const item = carrito.find((i) => i.id === id);
  if (!item) return;
  item.cantidad = Math.max(1, Math.min(cantidad, buscarProducto(id)?.stock ?? 0));
  guardarCarrito(carrito.filter((i) => i.cantidad > 0));
}

function quitarDelCarrito(id) {
  guardarCarrito(leerCarrito().filter((i) => i.id !== id));
}

// Une el carrito con los productos actuales: ignora los eliminados y ajusta al stock que queda
function detalleCarrito() {
  const productos = leerProductos();
  return leerCarrito()
    .map((i) => ({ producto: buscarProducto(i.id, productos), cantidad: i.cantidad }))
    .filter((i) => i.producto && i.producto.stock > 0)
    .map((i) => ({ ...i, cantidad: Math.min(i.cantidad, i.producto.stock) }));
}

const totalDetalle = (detalle) => detalle.reduce((suma, i) => suma + precioFinal(i.producto) * i.cantidad, 0);

/* ---------- Pedidos ---------- */

const leerPedidos = () => leerGuardado(CLAVE_PEDIDOS, []);

// Compra simulada: guarda el pedido, descuenta stock y vacía el carrito. No cobra nada.
function confirmarCompra(usuario, despacho) {
  const detalle = detalleCarrito();
  if (!detalle.length) return null;

  const productos = leerProductos();
  for (const i of detalle) buscarProducto(i.producto.id, productos).stock -= i.cantidad;
  guardarProductos(productos);

  const pedidos = leerPedidos();
  const pedido = {
    numero: 1001 + pedidos.length,
    usuario: usuario.usuario,
    fecha: new Date().toISOString(),
    direccion: despacho.direccion,
    pago: despacho.pago,
    items: detalle.map((i) => ({ nombre: i.producto.nombre, precio: precioFinal(i.producto), cantidad: i.cantidad })),
    total: totalDetalle(detalle),
  };
  pedidos.push(pedido);
  guardar(CLAVE_PEDIDOS, pedidos);
  guardarCarrito([]);
  return pedido;
}

/* ---------- Tarjeta de producto (catálogo y categorías) ---------- */

function crearFicha(p, puedeComprar) {
  const conDescuento = p.descuento > 0;
  const stock =
    p.stock === 0 ? '<p class="descuento si">Agotado</p>'
    : p.stock <= 3 ? `<p class="descuento si">¡Últimas ${p.stock} unidades!</p>`
    : `<p class="descuento no">Disponible: ${p.stock}</p>`;
  const boton = !puedeComprar ? ""
    : `<button type="button" class="boton mt-auto" data-agregar="${escapar(p.id)}" ${p.stock === 0 ? "disabled" : ""}>Agregar al carrito</button>`;

  return `
    <div class="col">
      <article class="ficha h-100">
        ${conDescuento ? `<span class="badge-descuento">-${p.descuento}%</span>` : ""}
        <a href="producto.html?id=${encodeURIComponent(p.id)}"><img src="${escapar(p.imagen)}" alt="Imagen del juego ${escapar(p.nombre)}"></a>
        <div class="ficha-cuerpo">
          <h3><a href="producto.html?id=${encodeURIComponent(p.id)}">${escapar(p.nombre)}</a></h3>
          <p class="ficha-desc">${escapar(p.descripcion)}</p>
          <p class="precio">
            ${conDescuento ? `<del>${formatoPeso(p.precio)}</del>` : ""}
            <strong>${formatoPeso(precioFinal(p))}</strong>
          </p>
          ${stock}
          ${boton}
        </div>
      </article>
    </div>`;
}

// Muestra en el botón que se agregó, para que el cambio se vea sin salir de la página
function avisarEnBoton(boton, agregados) {
  const original = boton.textContent;
  boton.textContent = agregados ? "¡Agregado! ✔" : "Sin más stock";
  boton.disabled = true;
  setTimeout(() => {
    boton.textContent = original;
    boton.disabled = false;
  }, 1200);
}
