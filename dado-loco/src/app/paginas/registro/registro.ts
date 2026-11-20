import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SesionService } from '../../servicios/sesion.service';
import { camposIguales, correo, edadMinima, mensajeError, obligatorio, reglasClave } from '../../servicios/validadores';

// Formulario reactivo: los campos y sus validaciones se definen aquí, no en el HTML
@Component({
  selector: 'app-registro',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private sesion = inject(SesionService);
  private fb = inject(FormBuilder);

  formulario = this.fb.nonNullable.group(
    {
      nombre: ['', obligatorio],
      usuario: ['', obligatorio],
      correo: ['', [obligatorio, correo]],
      clave: ['', [obligatorio, ...reglasClave]],
      repetir: ['', obligatorio],
      fecha: ['', [obligatorio, edadMinima(13)]],
      direccion: [''], // opcional: sin validaciones
    },
    { validators: camposIguales('clave', 'repetir') }
  );

  mensaje = '';
  tipoMensaje = 'success';

  // El error se muestra recién cuando el usuario pasó por el campo o intentó enviar
  error(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control?.touched) return '';
    if (campo === 'repetir' && control.valid && this.formulario.hasError('clavesDistintas')) {
      return 'Las contraseñas no coinciden.';
    }
    return mensajeError(control);
  }

  enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisa los campos marcados en rojo.';
      this.tipoMensaje = 'danger';
      return;
    }

    const datos = this.formulario.getRawValue();
    const usuario = datos.usuario.trim();
    const creado = this.sesion.registrar({
      usuario,
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      clave: datos.clave,
      fecha: datos.fecha,
      direccion: datos.direccion.trim(),
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
    this.formulario.reset();
    this.mensaje = '';
  }
}
