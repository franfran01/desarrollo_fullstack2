import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SesionService } from '../../servicios/sesion.service';

// La ruta /perfil tiene sesionGuard, así que aquí siempre hay un usuario conectado
@Component({
  selector: 'app-perfil',
  imports: [NgIf, FormsModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  sesion = inject(SesionService);

  // Copia de los datos: se editan aquí y solo se guardan al enviar
  usuario = '';
  nombre = '';
  correo = '';
  direccion = '';
  clave = '';
  repetir = '';
  mensaje = '';

  constructor() {
    this.cargar();
  }

  cargar(): void {
    const u = this.sesion.usuarioActual;
    this.usuario = u?.usuario ?? '';
    this.nombre = u?.nombre ?? '';
    this.correo = u?.correo ?? '';
    this.direccion = u?.direccion ?? '';
    this.clave = this.repetir = '';
  }

  deshacer(): void {
    this.cargar();
    this.mensaje = '';
  }

  guardar(): void {
    const cambios: { nombre: string; correo: string; direccion: string; clave?: string } = {
      nombre: this.nombre.trim(),
      correo: this.correo.trim(),
      direccion: this.direccion.trim(),
    };
    if (this.clave) cambios.clave = this.clave;
    this.sesion.actualizarUsuario(this.usuario, cambios);
    this.cargar();
    this.mensaje = 'Tus datos se guardaron correctamente.';
  }
}
