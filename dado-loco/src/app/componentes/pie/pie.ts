import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../../datos/datos';

@Component({
  selector: 'app-pie',
  imports: [NgFor, RouterLink],
  template: `
    <footer class="pie">
      <div class="container-xl">
        <div class="row g-4">
          <div class="col-12 col-lg-5">
            <a routerLink="/" class="logo mb-2"><span class="logo-texto">Dado Loco</span></a>
            <p style="max-width: 300px">Para quienes saben que el mejor juego es el que se comparte en la mesa.</p>
          </div>
          <div class="col-6 col-sm-4 col-lg-2">
            <h2>Tienda</h2>
            <ul>
              <li><a routerLink="/catalogo">Todos los juegos</a></li>
              <li *ngFor="let c of categorias"><a [routerLink]="['/categoria', c.id]">{{ c.nombre }}</a></li>
            </ul>
          </div>
          <div class="col-6 col-sm-4 col-lg-2">
            <h2>Visítanos</h2>
            <ul>
              <li><a routerLink="/" fragment="tienda">La tienda</a></li>
              <li><a routerLink="/" fragment="tienda">Horarios</a></li>
              <li><a routerLink="/registro">El club</a></li>
            </ul>
          </div>
          <div class="col-6 col-sm-4 col-lg-3">
            <h2>Tu cuenta</h2>
            <ul>
              <li><a routerLink="/login">Iniciar sesión</a></li>
              <li><a routerLink="/registro">Crear cuenta</a></li>
              <li><a routerLink="/carrito">Carrito</a></li>
            </ul>
          </div>
        </div>
        <div class="pie-legal">
          <p>&copy; {{ anio }} Dado Loco · Tienda de juegos de mesa</p>
          <p>Proyecto académico · Desarrollo Full Stack II</p>
        </div>
      </div>
    </footer>
  `,
})
export class Pie {
  anio = new Date().getFullYear();
  categorias = CATEGORIAS;
}
