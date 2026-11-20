import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CATEGORIAS, Producto } from '../../datos/datos';
import { RouterLink } from '@angular/router';
import { FichaProducto } from '../../componentes/ficha-producto/ficha-producto';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

@Component({
  selector: 'app-catalogo',
  imports: [NgFor, NgIf, ReactiveFormsModule, RouterLink, FichaProducto],
  templateUrl: './catalogo.html',
})
export class Catalogo {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  categorias = CATEGORIAS;

  // Buscador y filtro como formulario reactivo: la lista se recalcula con cada cambio
  filtros = new FormGroup({
    texto: new FormControl('', { nonNullable: true }),
    categoria: new FormControl('', { nonNullable: true }),
  });

  get productosFiltrados(): Producto[] {
    const { texto, categoria } = this.filtros.getRawValue();
    const buscado = texto.trim().toLowerCase();
    return this.tienda.productos.filter(
      (p) => (!categoria || p.categoria === categoria) && p.nombre.toLowerCase().includes(buscado)
    );
  }
}
