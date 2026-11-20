import { Component, Input, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';
import { TiendaService } from '../../servicios/tienda.service';

// Tarjeta de un juego. El componente padre (catálogo o categoría) le pasa el producto con @Input.
@Component({
  selector: 'app-ficha-producto',
  imports: [NgIf, RouterLink, PesoPipe],
  templateUrl: './ficha-producto.html',
  host: { class: 'col' },
})
export class FichaProducto {
  @Input({ required: true }) producto!: Producto;
  @Input() puedeComprar = true;

  tienda = inject(TiendaService);
  textoBoton = 'Agregar al carrito';
  avisando = false;

  // Muestra en el botón que se agregó, para que el cambio se vea sin salir de la página
  agregar(): void {
    const agregados = this.tienda.agregarAlCarrito(this.producto.id);
    this.textoBoton = agregados ? '¡Agregado! ✔' : 'Sin más stock';
    this.avisando = true;
    setTimeout(() => {
      this.textoBoton = 'Agregar al carrito';
      this.avisando = false;
    }, 1200);
  }
}
