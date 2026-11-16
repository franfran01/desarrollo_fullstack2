import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from './sesion.service';

// Páginas que necesitan sesión: si no hay, va al login y después vuelve a la página pedida
export const sesionGuard: CanActivateFn = (_ruta, estado) => {
  const sesion = inject(SesionService);
  return sesion.usuarioActual ? true : inject(Router).createUrlTree(['/login'], { queryParams: { volver: estado.url } });
};

// Páginas solo para el administrador
export const adminGuard: CanActivateFn = (_ruta, estado) => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  if (!sesion.usuarioActual) return router.createUrlTree(['/login'], { queryParams: { volver: estado.url } });
  return sesion.esAdmin ? true : router.createUrlTree(['/']);
};
