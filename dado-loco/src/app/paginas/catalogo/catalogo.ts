import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CATEGORIAS, Producto } from '../../datos/datos';
import { FichaProducto } from '../../componentes/ficha-producto/ficha-producto';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

@Component({
  selector: 'app-catalogo',
  imports: [NgFor, NgIf, FormsModule, FichaProducto],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  categorias = CATEGORIAS;

  // Enlazados con [(ngModel)] al buscador y al filtro
  texto = '';
  categoria = '';

  get productosFiltrados(): Producto[] {
    const buscado = this.texto.trim().toLowerCase();
    return this.tienda.productos.filter(
      (p) => (!this.categoria || p.categoria === this.categoria) && p.nombre.toLowerCase().includes(buscado)
    );
  }
}
