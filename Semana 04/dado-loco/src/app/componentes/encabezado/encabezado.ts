import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CATEGORIAS } from '../../datos/datos';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

// Menú común a todas las páginas. Las opciones cambian según la sesión y el rol.
@Component({
  selector: 'app-encabezado',
  imports: [NgIf, NgFor, RouterLink, RouterLinkActive],
  templateUrl: './encabezado.html',
})
export class Encabezado {
  sesion = inject(SesionService);
  tienda = inject(TiendaService);
  private router = inject(Router);

  categorias = CATEGORIAS;

  constructor() {
    // En celular, el menú desplegado se cierra al cambiar de página
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) document.getElementById('menu-principal')?.classList.remove('show');
    });
  }

  cerrarSesion(): void {
    this.sesion.cerrarSesion();
    this.router.navigate(['/']);
  }
}
