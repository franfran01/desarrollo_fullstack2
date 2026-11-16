import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SesionService } from '../../servicios/sesion.service';

// Esta semana no se incluyen las validaciones de la semana 2 y 3: solo se enlazan los campos con ngModel
@Component({
  selector: 'app-registro',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private sesion = inject(SesionService);

  nombre = '';
  usuario = '';
  correo = '';
  clave = '';
  repetir = '';
  fecha = '';
  direccion = '';

  mensaje = '';
  tipoMensaje = 'success';

  enviar(): void {
    const usuario = this.usuario.trim();
    const creado = this.sesion.registrar({
      usuario,
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      clave: this.clave,
      fecha: this.fecha,
      direccion: this.direccion.trim(),
    });

    if (!creado) {
      this.mensaje = 'Ese nombre de usuario o correo ya está registrado.';
      this.tipoMensaje = 'danger';
      return;
    }
    this.limpiar();
    this.mensaje = `¡Registro exitoso! Te damos la bienvenida a Dado Loco, ${usuario}. Ya puedes iniciar sesión.`;
    this.tipoMensaje = 'success';
  }

  limpiar(): void {
    this.nombre = this.usuario = this.correo = this.clave = this.repetir = this.fecha = this.direccion = '';
    this.mensaje = '';
  }
}
