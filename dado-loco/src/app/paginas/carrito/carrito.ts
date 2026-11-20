import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { MEDIOS_PAGO } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';
import { SesionService } from '../../servicios/sesion.service';
import { LineaCarrito, TiendaService } from '../../servicios/tienda.service';
import { mensajeError, obligatorio } from '../../servicios/validadores';

@Component({
  selector: 'app-carrito',
  imports: [NgFor, NgIf, ReactiveFormsModule, RouterLink, PesoPipe],
  templateUrl: './carrito.html',
})
export class Carrito {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  private router = inject(Router);

  mediosPago = MEDIOS_PAGO;
  lineas: LineaCarrito[] = [];
  total = 0;

  // Formulario reactivo de despacho y pago; la dirección parte con la del perfil
  formulario = inject(FormBuilder).nonNullable.group({
    direccion: [this.sesion.usuarioActual?.direccion ?? '', obligatorio],
    pago: ['', obligatorio],
  });

  error(campo: string): string {
    const control = this.formulario.get(campo);
    return control?.touched ? mensajeError(control) : '';
  }

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

  // Evento (change) del input de cantidad
  cambiarCantidad(linea: LineaCarrito, evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.tienda.cambiarCantidad(linea.producto.id, Number(input.value));
    this.refrescar();
  }

  quitar(linea: LineaCarrito): void {
    this.tienda.quitarDelCarrito(linea.producto.id);
    this.refrescar();
  }

  confirmar(): void {
    const usuario = this.sesion.usuarioActual;
    if (!usuario) return;
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { direccion, pago } = this.formulario.getRawValue();
    const pedido = this.tienda.confirmarCompra(usuario, direccion.trim(), pago);
    if (!pedido) return this.refrescar();

    // El pedido viaja a la página de confirmación con NavigationExtras (state)
    const extras: NavigationExtras = { state: { pedido } };
    this.router.navigate(['/compra-exitosa'], extras);
  }
}
