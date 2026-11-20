import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SesionService } from '../../servicios/sesion.service';
import { camposIguales, correo, mensajeError, obligatorio, reglasClave } from '../../servicios/validadores';

// La ruta /perfil tiene sesionGuard, así que aquí siempre hay un usuario conectado
@Component({
  selector: 'app-perfil',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  sesion = inject(SesionService);
  private fb = inject(FormBuilder);

  // Copia de los datos: se editan en el formulario y solo se guardan al enviar.
  // La contraseña nueva es opcional, pero si se escribe debe cumplir las mismas reglas del registro.
  formulario = this.fb.nonNullable.group(
    {
      usuario: [{ value: '', disabled: true }],
      nombre: ['', obligatorio],
      correo: ['', [obligatorio, correo]],
      direccion: [''],
      clave: ['', reglasClave],
      repetir: [''],
    },
    { validators: camposIguales('clave', 'repetir') }
  );
  mensaje = '';

  constructor() {
    this.cargar();
  }

  cargar(): void {
    const u = this.sesion.usuarioActual;
    this.formulario.reset({
      usuario: u?.usuario ?? '',
      nombre: u?.nombre ?? '',
      correo: u?.correo ?? '',
      direccion: u?.direccion ?? '',
      clave: '',
      repetir: '',
    });
  }

  error(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control?.touched) return '';
    if (campo === 'repetir' && this.formulario.hasError('clavesDistintas')) return 'Las contraseñas no coinciden.';
    return mensajeError(control);
  }

  deshacer(): void {
    this.cargar();
    this.mensaje = '';
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = '';
      return;
    }
    const datos = this.formulario.getRawValue();
    const cambios: { nombre: string; correo: string; direccion: string; clave?: string } = {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      direccion: datos.direccion.trim(),
    };
    if (datos.clave) cambios.clave = datos.clave;
    this.sesion.actualizarUsuario(datos.usuario, cambios);
    this.cargar();
    this.mensaje = 'Tus datos se guardaron correctamente.';
  }
}
