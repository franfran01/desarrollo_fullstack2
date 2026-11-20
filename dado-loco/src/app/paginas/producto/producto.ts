import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto as DatosProducto } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

/* Un solo HTML de detalle para todos los juegos: el id llega en la ruta (/producto/:id)
   y con él se buscan los datos que se muestran. */
@Component({
  selector: 'app-producto',
  imports: [NgIf, FormsModule, RouterLink, PesoPipe],
  templateUrl: './producto.html',
})
export class Producto {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  private ruta = inject(ActivatedRoute);
  private titulo = inject(Title);

  producto?: DatosProducto;
  cantidad = 1;
  mensaje = '';
  tipoMensaje = 'success';

  constructor() {
    this.ruta.paramMap.subscribe((parametros) => {
      this.producto = this.tienda.buscarProducto(parametros.get('id') ?? '');
      this.cantidad = 1;
      this.mensaje = '';
      this.titulo.setTitle(`${this.producto?.nombre ?? 'Juego no encontrado'} | Dado Loco`);
    });
  }

  get nombreCategoria(): string {
    return this.producto ? this.tienda.buscarCategoria(this.producto.categoria)?.nombre ?? '' : '';
  }

  agregar(): void {
    if (!this.producto) return;
    const agregados = this.tienda.agregarAlCarrito(this.producto.id, this.cantidad);
    if (agregados) {
      this.mensaje = `Agregaste ${agregados} unidad(es) de ${this.producto.nombre} al carrito.`;
      this.tipoMensaje = 'success';
    } else {
      this.mensaje = 'Ya tienes en el carrito todo el stock disponible de este juego.';
      this.tipoMensaje = 'warning';
    }
  }
}
