import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { correo, mensajeError, obligatorio } from '../../servicios/validadores';

// Simulación: no se envía ningún correo
@Component({
  selector: 'app-recuperar',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar.html',
})
export class Recuperar {
  formulario = inject(FormBuilder).nonNullable.group({
    correo: ['', [obligatorio, correo]],
  });
  mensaje = '';

  get error(): string {
    const control = this.formulario.controls.correo;
    return control.touched ? mensajeError(control) : '';
  }

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    // Mensaje igual exista o no la cuenta, como en los sitios reales
    this.mensaje = `Si existe una cuenta con ${this.formulario.getRawValue().correo.trim()}, te enviamos un enlace para crear una contraseña nueva. (Simulación: no se envía ningún correo.)`;
    this.formulario.reset();
  }
}
