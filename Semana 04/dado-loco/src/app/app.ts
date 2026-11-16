import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Encabezado } from './componentes/encabezado/encabezado';
import { Pie } from './componentes/pie/pie';

// Componente principal: el menú y el pie se repiten, y el router-outlet muestra la página actual
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, Pie],
  templateUrl: './app.html',
})
export class App {}
