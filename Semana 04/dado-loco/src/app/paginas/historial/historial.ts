import { Component, inject } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pedido } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

// El mismo HTML sirve para las dos vistas: el cliente ve sus compras y el administrador todas las ventas
@Component({
  selector: 'app-historial',
  imports: [NgFor, NgIf, DatePipe, RouterLink, PesoPipe],
  templateUrl: './historial.html',
})
export class Historial {
  sesion = inject(SesionService);
  private tienda = inject(TiendaService);

  pedidos: Pedido[] = this.tienda.pedidos
    .filter((p) => this.sesion.esAdmin || p.usuario === this.sesion.usuarioActual?.usuario)
    .reverse(); // los más nuevos primero

  total = this.pedidos.reduce((suma, p) => suma + p.total, 0);
}
