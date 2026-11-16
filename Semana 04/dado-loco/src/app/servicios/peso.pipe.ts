import { Pipe, PipeTransform } from '@angular/core';

// Formato de pesos chilenos: 39990 -> "$39.990"
@Pipe({ name: 'peso' })
export class PesoPipe implements PipeTransform {
  transform(monto: number): string {
    return '$' + monto.toLocaleString('es-CL');
  }
}
