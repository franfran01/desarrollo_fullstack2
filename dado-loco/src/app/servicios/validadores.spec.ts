import { FormControl } from '@angular/forms';
import { calcularEdad, obligatorio } from './validadores';

describe('Validadores', () => {
  it('calcula la edad según si ya pasó el cumpleaños este año', () => {
    const hoy = new Date(2026, 10, 20); // 20 de noviembre de 2026
    expect(calcularEdad('2013-11-20', hoy)).toBe(13); // cumple hoy
    expect(calcularEdad('2013-11-21', hoy)).toBe(12); // cumple mañana
    expect(calcularEdad('2013-12-01', hoy)).toBe(12);
  });

  it('considera vacío un campo con solo espacios', () => {
    expect(obligatorio(new FormControl('   '))).toEqual({ required: true });
    expect(obligatorio(new FormControl(null))).toEqual({ required: true });
    expect(obligatorio(new FormControl('Ana'))).toBeNull();
  });
});
