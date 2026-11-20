import { Routes } from '@angular/router';
import { Admin } from './paginas/admin/admin';
import { Carrito } from './paginas/carrito/carrito';
import { Catalogo } from './paginas/catalogo/catalogo';
import { Categoria } from './paginas/categoria/categoria';
import { CompraExitosa } from './paginas/compra-exitosa/compra-exitosa';
import { Historial } from './paginas/historial/historial';
import { Inicio } from './paginas/inicio/inicio';
import { Login } from './paginas/login/login';
import { Perfil } from './paginas/perfil/perfil';
import { Producto } from './paginas/producto/producto';
import { Recuperar } from './paginas/recuperar/recuperar';
import { Registro } from './paginas/registro/registro';
import { adminGuard, sesionGuard } from './servicios/sesion.guard';

// Cada HTML de la semana 3 pasa a ser una ruta. Las rutas con ":" reciben datos en la URL.
export const routes: Routes = [
  { path: '', component: Inicio, title: 'Dado Loco | Juegos de mesa' },
  { path: 'catalogo', component: Catalogo, title: 'Catálogo | Dado Loco' },
  { path: 'categoria/:nombre', component: Categoria },   // reemplaza estrategia, familiares, cartas y cooperativos.html
  { path: 'producto/:id', component: Producto },          // reemplaza producto.html?id=...
  { path: 'carrito', component: Carrito, title: 'Carrito | Dado Loco' },
  { path: 'compra-exitosa', component: CompraExitosa, title: 'Compra realizada | Dado Loco' },
  { path: 'login', component: Login, title: 'Iniciar sesión | Dado Loco' },
  { path: 'registro', component: Registro, title: 'Registro | Dado Loco' },
  { path: 'recuperar', component: Recuperar, title: 'Recuperar contraseña | Dado Loco' },
  { path: 'perfil', component: Perfil, title: 'Mi perfil | Dado Loco', canActivate: [sesionGuard] },
  { path: 'historial', component: Historial, title: 'Historial | Dado Loco', canActivate: [sesionGuard] },
  { path: 'admin', component: Admin, title: 'Administración | Dado Loco', canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
