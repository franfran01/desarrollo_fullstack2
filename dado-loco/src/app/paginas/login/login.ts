import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SesionService } from '../../servicios/sesion.service';

@Component({
  selector: 'app-login',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private sesion = inject(SesionService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  usuario = '';
  clave = '';
  error = '';

  ingresar(): void {
    const usuario = this.sesion.iniciarSesion(this.usuario, this.clave);
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
