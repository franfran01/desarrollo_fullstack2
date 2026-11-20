import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Pedido } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';

// Recibe el pedido que envía el carrito con NavigationExtras ({ state: { pedido } })
@Component({
  selector: 'app-compra-exitosa',
  imports: [NgFor, NgIf, RouterLink, PesoPipe],
  templateUrl: './compra-exitosa.html',
})
export class CompraExitosa {
  pedido?: Pedido = inject(Router).getCurrentNavigation()?.extras.state?.['pedido'];
}
