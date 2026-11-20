import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/* ==========================================================
   Validadores de los formularios reactivos.
   Los que trae Angular (Validators) se combinan con estos
   propios para cubrir las reglas de la actividad.
   ========================================================== */

// Como Validators.required, pero un texto con solo espacios también cuenta como vacío
export const obligatorio: ValidatorFn = (control) =>
  String(control.value ?? '').trim() ? null : { required: true };

// Validators.email acepta "ana@correo" sin dominio; este exige algo como "ana@correo.cl"
export const correo: ValidatorFn = Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);

// Al menos un número y una mayúscula (el largo lo revisan minLength y maxLength)
export const claveSegura: ValidatorFn = (control) => {
  const clave = String(control.value ?? '');
  if (!clave) return null;
  const errores: ValidationErrors = {};
  if (!/\d/.test(clave)) errores['sinNumero'] = true;
  if (!/[A-Z]/.test(clave)) errores['sinMayuscula'] = true;
  return Object.keys(errores).length ? errores : null;
};

// Reglas completas de la contraseña: entre 6 y 18 caracteres, un número y una mayúscula
export const reglasClave: ValidatorFn[] = [Validators.minLength(6), Validators.maxLength(18), claveSegura];

// Calcula la edad cumplida a la fecha de hoy (fecha en formato AAAA-MM-DD del input date)
export function calcularEdad(fecha: string, hoy = new Date()): number {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  let edad = hoy.getFullYear() - anio;
  const yaCumplio = hoy.getMonth() + 1 > mes || (hoy.getMonth() + 1 === mes && hoy.getDate() >= dia);
  if (!yaCumplio) edad--;
  return edad;
}

export function edadMinima(minima: number): ValidatorFn {
  return (control) => {
    if (!control.value) return null;
    const edad = calcularEdad(control.value);
    if (Number.isNaN(edad) || edad > 120) return { fechaInvalida: true };
    return edad < minima ? { edadMinima: { minima, actual: edad } } : null;
  };
}

// Validador de grupo: compara dos campos del mismo FormGroup
export function camposIguales(campo: string, repetir: string): ValidatorFn {
  return (grupo: AbstractControl) =>
    grupo.get(campo)?.value === grupo.get(repetir)?.value ? null : { clavesDistintas: true };
}

// Texto del primer error del campo, para mostrarlo bajo el input
export function mensajeError(control: AbstractControl | null): string {
  const e = control?.errors;
  if (!e) return '';
  if (e['required']) return 'Este campo es obligatorio.';
  if (e['pattern']) return 'Escribe un correo válido, por ejemplo nombre@correo.cl.';
  if (e['minlength']) return `Debe tener al menos ${e['minlength'].requiredLength} caracteres.`;
  if (e['maxlength']) return `Debe tener como máximo ${e['maxlength'].requiredLength} caracteres.`;
  if (e['sinNumero'] && e['sinMayuscula']) return 'Debe incluir al menos un número y una letra mayúscula.';
  if (e['sinNumero']) return 'Debe incluir al menos un número.';
  if (e['sinMayuscula']) return 'Debe incluir al menos una letra mayúscula.';
  if (e['edadMinima']) return `Debes tener al menos ${e['edadMinima'].minima} años para registrarte.`;
  if (e['fechaInvalida']) return 'Ingresa una fecha de nacimiento válida.';
  if (e['min']) return `El valor mínimo es ${e['min'].min}.`;
  if (e['max']) return `El valor máximo es ${e['max'].max}.`;
  return 'Revisa este campo.';
}
