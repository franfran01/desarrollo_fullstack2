import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, Producto, Usuario } from '../../datos/datos';
import { PesoPipe } from '../../servicios/peso.pipe';
import { SesionService } from '../../servicios/sesion.service';
import { TiendaService } from '../../servicios/tienda.service';

const FORMULARIO_VACIO = { nombre: '', categoria: '', precio: 0, descuento: 0, stock: 0, descripcion: '' };

// Mantenedor de productos e inventario, y de usuarios. La ruta /admin tiene adminGuard.
@Component({
  selector: 'app-admin',
  imports: [NgFor, NgIf, FormsModule, RouterLink, PesoPipe],
  templateUrl: './admin.html',
})
export class Admin {
  tienda = inject(TiendaService);
  sesion = inject(SesionService);
  categorias = CATEGORIAS;

  // Formulario de producto enlazado con [(ngModel)]; idEditando vacío = agregar
  idEditando = '';
  formulario = { ...FORMULARIO_VACIO };
  mensaje = '';

  /* ---------- Resumen ---------- */

  get agotados(): number {
    return this.tienda.productos.filter((p) => p.stock === 0).length;
  }

  get totalVendido(): number {
    return this.tienda.pedidos.reduce((suma, p) => suma + p.total, 0);
  }

  nombreCategoria(id: string): string {
    return this.tienda.buscarCategoria(id)?.nombre ?? id;
  }

  claseStock(stock: number): string {
    return stock === 0 ? 'text-bg-danger' : stock <= 3 ? 'text-bg-warning' : 'text-bg-success';
  }

  /* ---------- Productos ---------- */

  editar(p: Producto): void {
    this.idEditando = p.id;
    const { id, imagen, ...datos } = p;
    this.formulario = { ...datos };
    this.mensaje = '';
    document.getElementById('form-producto')?.scrollIntoView({ behavior: 'smooth' });
  }

  limpiar(): void {
    this.idEditando = '';
    this.formulario = { ...FORMULARIO_VACIO };
  }

  guardar(): void {
    const datos = {
      ...this.formulario,
      nombre: this.formulario.nombre.trim(),
      descripcion: this.formulario.descripcion.trim(),
      precio: Number(this.formulario.precio),
      descuento: Number(this.formulario.descuento),
      stock: Number(this.formulario.stock),
    };
    const editando = Boolean(this.idEditando);
    this.tienda.guardarProducto(datos, this.idEditando || undefined);
    this.limpiar();
    this.mensaje = editando ? `Se guardaron los cambios de ${datos.nombre}.` : `${datos.nombre} se agregó al catálogo.`;
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}" del catálogo?`)) return;
    this.tienda.eliminarProducto(p.id);
    if (this.idEditando === p.id) this.limpiar();
  }

  /* ---------- Usuarios ---------- */

  // No se puede quitar el rol ni borrar la cuenta propia, para no quedar sin administrador
  esYo(u: Usuario): boolean {
    return u.usuario === this.sesion.usuarioActual?.usuario;
  }

  eliminarUsuario(u: Usuario): void {
    if (confirm(`¿Eliminar la cuenta "${u.usuario}"?`)) this.sesion.eliminarUsuario(u.usuario);
  }
}
