import { Injectable } from '@angular/core';
import { CATEGORIAS, ItemCarrito, Pedido, Producto, PRODUCTOS_INICIALES, Usuario } from '../datos/datos';

export interface LineaCarrito {
  producto: Producto;
  cantidad: number;
}

/* ==========================================================
   Productos, carrito y pedidos.
   Los datos viven en variables del servicio (en memoria):
   se comparten entre páginas y vuelven al inicio al recargar.
   ========================================================== */
@Injectable({ providedIn: 'root' })
export class TiendaService {
  productos: Producto[] = structuredClone(PRODUCTOS_INICIALES);
  carrito: ItemCarrito[] = [];
  pedidos: Pedido[] = [];

  /* ---------- Productos ---------- */

  buscarProducto(id: string): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }

  buscarCategoria(id: string) {
    return CATEGORIAS.find((c) => c.id === id);
  }

  // Se redondea a la decena, igual que los precios de oferta de la semana 2
  precioFinal(p: Producto): number {
    return Math.round((p.precio * (100 - p.descuento)) / 1000) * 10;
  }

  // Id legible a partir del nombre: "La Isla Prohibida" -> "la-isla-prohibida"
  private crearId(nombre: string): string {
    const base = nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'juego';
    let id = base;
    for (let n = 2; this.buscarProducto(id); n++) id = `${base}-${n}`;
    return id;
  }

  // Sin id agrega un juego nuevo (con la imagen de su categoría); con id lo modifica
  guardarProducto(datos: Omit<Producto, 'id' | 'imagen'>, id?: string): void {
    const existente = id ? this.buscarProducto(id) : undefined;
    if (existente) Object.assign(existente, datos);
    else this.productos.push({ id: this.crearId(datos.nombre), imagen: `img/cat-${datos.categoria}.svg`, ...datos });
  }

  eliminarProducto(id: string): void {
    this.productos = this.productos.filter((p) => p.id !== id);
    this.quitarDelCarrito(id);
  }

  /* ---------- Carrito ---------- */

  // Devuelve cuántas unidades se agregaron de verdad (nunca más que el stock)
  agregarAlCarrito(id: string, cantidad = 1): number {
    const producto = this.buscarProducto(id);
    if (!producto) return 0;
    const item = this.carrito.find((i) => i.id === id);
    const antes = item?.cantidad ?? 0;
    const despues = Math.min(antes + cantidad, producto.stock);
    if (despues <= antes) return 0;
    if (item) item.cantidad = despues;
    else this.carrito.push({ id, cantidad: despues });
    return despues - antes;
  }

  cambiarCantidad(id: string, cantidad: number): void {
    const item = this.carrito.find((i) => i.id === id);
    const stock = this.buscarProducto(id)?.stock ?? 0;
    if (item) item.cantidad = Math.max(1, Math.min(Math.floor(cantidad) || 1, stock));
  }

  quitarDelCarrito(id: string): void {
    this.carrito = this.carrito.filter((i) => i.id !== id);
  }

  // Une el carrito con los productos: ignora los eliminados o agotados y ajusta al stock
  detalleCarrito(): LineaCarrito[] {
    const lineas: LineaCarrito[] = [];
    for (const item of this.carrito) {
      const producto = this.buscarProducto(item.id);
      if (producto && producto.stock > 0) lineas.push({ producto, cantidad: Math.min(item.cantidad, producto.stock) });
    }
    return lineas;
  }

  totalDetalle(lineas: LineaCarrito[]): number {
    return lineas.reduce((suma, l) => suma + this.precioFinal(l.producto) * l.cantidad, 0);
  }

  unidadesEnCarrito(): number {
    return this.carrito.reduce((suma, i) => suma + i.cantidad, 0);
  }

  /* ---------- Pedidos ---------- */

  // Compra simulada: guarda el pedido, descuenta stock y vacía el carrito. No cobra nada.
  confirmarCompra(usuario: Usuario, direccion: string, pago: string): Pedido | null {
    const lineas = this.detalleCarrito();
    if (!lineas.length) return null;
    for (const l of lineas) l.producto.stock -= l.cantidad;

    const pedido: Pedido = {
      numero: 1001 + this.pedidos.length,
      usuario: usuario.usuario,
      fecha: new Date(),
      direccion,
      pago,
      items: lineas.map((l) => ({ nombre: l.producto.nombre, precio: this.precioFinal(l.producto), cantidad: l.cantidad })),
      total: this.totalDetalle(lineas),
    };
    this.pedidos.push(pedido);
    this.carrito = [];
    return pedido;
  }
}
