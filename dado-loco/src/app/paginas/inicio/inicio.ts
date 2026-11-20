import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CATEGORIAS } from '../../datos/datos';

@Component({
  selector: 'app-inicio',
  imports: [NgFor, RouterLink],
  templateUrl: './inicio.html',
})
export class Inicio {
  categorias = CATEGORIAS;
}
