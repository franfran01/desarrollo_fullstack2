import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../../datos/datos';
import { FichaProducto } from '../../componentes/ficha-producto/ficha-producto';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

@Component({
  selector: 'app-inicio',
  imports: [NgFor, RouterLink, FichaProducto],
  templateUrl: './inicio.html',
})
export class Inicio {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  categorias = CATEGORIAS;

  // Siete cajas para el abanico de la portada
  get abanico() {
    return this.tienda.productos.slice(0, 7);
  }

  // Los juegos con descuento van primero en "Destacados"
  get destacados() {
    const disponibles = this.tienda.productos.filter((p) => p.stock > 0);
    return [...disponibles].sort((a, b) => b.descuento - a.descuento).slice(0, 4);
  }

  cantidadEn(categoria: string): number {
    return this.tienda.productos.filter((p) => p.categoria === categoria).length;
  }
}
