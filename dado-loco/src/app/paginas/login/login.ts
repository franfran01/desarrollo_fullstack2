import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '../../servicios/sesion.service';
import { mensajeError, obligatorio } from '../../servicios/validadores';

@Component({
  selector: 'app-login',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private sesion = inject(SesionService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  private fb = inject(FormBuilder);

  formulario = this.fb.nonNullable.group({
    usuario: ['', obligatorio],
    clave: ['', obligatorio],
  });
  error = '';

  errorCampo(campo: string): string {
    const control = this.formulario.get(campo);
    return control?.touched ? mensajeError(control) : '';
  }

  ingresar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { usuario: texto, clave } = this.formulario.getRawValue();
    const usuario = this.sesion.iniciarSesion(texto, clave);
    // Mismo mensaje para usuario o contraseña: no revela qué cuentas existen
    if (!usuario) {
      this.error = 'Usuario o contraseña incorrectos.';
      return;
    }
    // Si venía de una página que pedía sesión (ej. /carrito), vuelve a ella; solo rutas propias
    const volver = this.ruta.snapshot.queryParamMap.get('volver');
    if (volver?.startsWith('/') && !volver.startsWith('//')) this.router.navigateByUrl(volver);
    else this.router.navigate([usuario.rol === 'admin' ? '/admin' : '/catalogo']);
  }
}
