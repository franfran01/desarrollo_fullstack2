import { Injectable } from '@angular/core';
import { CUENTAS_DEMO, Usuario } from '../datos/datos';

/* ==========================================================
   Usuarios y sesión simulados (en memoria).
   Parte con las dos cuentas de prueba de la semana 3.
   ========================================================== */
@Injectable({ providedIn: 'root' })
export class SesionService {
  usuarios: Usuario[] = structuredClone(CUENTAS_DEMO);
  usuarioActual: Usuario | null = null;

  get esAdmin(): boolean {
    return this.usuarioActual?.rol === 'admin';
  }

  // Los visitantes y los clientes pueden comprar; el administrador no
  get puedeComprar(): boolean {
    return !this.esAdmin;
  }

  // Acepta nombre de usuario o correo, sin importar mayúsculas
  buscarUsuario(texto: string): Usuario | undefined {
    const buscado = texto.trim().toLowerCase();
    return this.usuarios.find((u) => u.usuario.toLowerCase() === buscado || u.correo.toLowerCase() === buscado);
  }

  // Devuelve el usuario si los datos coinciden; si no, null
  iniciarSesion(usuarioOCorreo: string, clave: string): Usuario | null {
    const usuario = this.buscarUsuario(usuarioOCorreo);
    if (!usuario || usuario.clave !== clave) return null;
    this.usuarioActual = usuario;
    return usuario;
  }

  cerrarSesion(): void {
    this.usuarioActual = null;
  }

  // Devuelve false si el usuario o el correo ya existen
  registrar(datos: Omit<Usuario, 'rol'>): boolean {
    if (this.buscarUsuario(datos.usuario) || this.buscarUsuario(datos.correo)) return false;
    this.usuarios.push({ ...datos, rol: 'cliente' });
    return true;
  }

  // Se busca por usuario porque el nombre de usuario no se puede cambiar
  actualizarUsuario(usuario: string, cambios: Partial<Usuario>): void {
    const encontrado = this.usuarios.find((u) => u.usuario === usuario);
    if (encontrado) Object.assign(encontrado, cambios);
  }

  eliminarUsuario(usuario: string): void {
    this.usuarios = this.usuarios.filter((u) => u.usuario !== usuario);
  }
}
