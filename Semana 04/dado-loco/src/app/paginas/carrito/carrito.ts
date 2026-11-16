import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { MEDIOS_PAGO } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';
import { SesionService } from '../../servicios/sesion.service';
import { LineaCarrito, TiendaService } from '../../servicios/tienda.service';

@Component({
  selector: 'app-carrito',
  imports: [NgFor, NgIf, FormsModule, RouterLink, PesoPipe],
  templateUrl: './carrito.html',
})
export class Carrito {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  private router = inject(Router);

  mediosPago = MEDIOS_PAGO;
  lineas: LineaCarrito[] = [];
  total = 0;

  // Datos de despacho enlazados con [(ngModel)]
  direccion = this.sesion.usuarioActual?.direccion ?? '';
  pago = '';

  constructor() {
    this.refrescar();
  }

  refrescar(): void {
    this.lineas = this.tienda.detalleCarrito();
    this.total = this.tienda.totalDetalle(this.lineas);
  }

  // trackBy: Angular reutiliza la fila del mismo juego en vez de volver a dibujarla
  porId(_indice: number, linea: LineaCarrito): string {
    return linea.producto.id;
  }

  cambiarCantidad(linea: LineaCarrito): void {
    this.tienda.cambiarCantidad(linea.producto.id, linea.cantidad);
    this.refrescar();
  }

  quitar(linea: LineaCarrito): void {
    this.tienda.quitarDelCarrito(linea.producto.id);
    this.refrescar();
  }

  confirmar(): void {
    const usuario = this.sesion.usuarioActual;
    if (!usuario) return;
    const pedido = this.tienda.confirmarCompra(usuario, this.direccion.trim(), this.pago);
    if (!pedido) return this.refrescar();

    // El pedido viaja a la página de confirmación con NavigationExtras (state)
    const extras: NavigationExtras = { state: { pedido } };
    this.router.navigate(['/compra-exitosa'], extras);
  }
}
