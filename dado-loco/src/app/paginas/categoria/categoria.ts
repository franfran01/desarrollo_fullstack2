import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CATEGORIAS, Categoria as DatosCategoria, Producto } from '../../datos/datos';
import { FichaProducto } from '../../componentes/ficha-producto/ficha-producto';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

/* Una sola página para las 4 categorías (antes eran estrategia.html, familiares.html,
   cartas.html y cooperativos.html). La categoría llega en la ruta: /categoria/:nombre */
@Component({
  selector: 'app-categoria',
  imports: [NgFor, NgIf, RouterLink, FichaProducto],
  templateUrl: './categoria.html',
})
export class Categoria {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  private ruta = inject(ActivatedRoute);
  private titulo = inject(Title);

  categoria?: DatosCategoria;
  anterior!: DatosCategoria;
  siguiente!: DatosCategoria;

  constructor() {
    // Se escucha el parámetro porque al pasar de una categoría a otra Angular reutiliza este componente
    this.ruta.paramMap.subscribe((parametros) => {
      const nombre = parametros.get('nombre') ?? '';
      const i = CATEGORIAS.findIndex((c) => c.id === nombre);
      this.categoria = CATEGORIAS[i];
      // Los botones de abajo dan la vuelta: después de la última viene la primera
      this.anterior = CATEGORIAS[(i - 1 + CATEGORIAS.length) % CATEGORIAS.length];
      this.siguiente = CATEGORIAS[(i + 1) % CATEGORIAS.length];
      this.titulo.setTitle(`${this.categoria?.nombre ?? 'Categoría no encontrada'} | Dado Loco`);
    });
  }

  get productos(): Producto[] {
    return this.tienda.productos.filter((p) => p.categoria === this.categoria?.id);
  }
}
