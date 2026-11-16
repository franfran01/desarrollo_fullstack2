import { Component } from '@angular/core';

@Component({
  selector: 'app-pie',
  template: `
    <footer class="pie">
      <p>&copy; {{ anio }} Dado Loco &middot; Tienda de juegos de mesa</p>
    </footer>
  `,
})
export class Pie {
  anio = new Date().getFullYear();
}
