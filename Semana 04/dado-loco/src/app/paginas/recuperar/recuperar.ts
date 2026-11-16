import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Simulación: no se envía ningún correo
@Component({
  selector: 'app-recuperar',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './recuperar.html',
})
export class Recuperar {
  correo = '';
  mensaje = '';

  enviar(): void {
    // Mensaje igual exista o no la cuenta, como en los sitios reales
    this.mensaje = `Si existe una cuenta con ${this.correo.trim()}, te enviamos un enlace para crear una contraseña nueva. (Simulación: no se envía ningún correo.)`;
    this.correo = '';
  }
}
