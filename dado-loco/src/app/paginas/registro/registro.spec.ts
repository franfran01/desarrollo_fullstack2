import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SesionService } from '../../servicios/sesion.service';
import { Registro } from './registro';

// Fecha AAAA-MM-DD de alguien que cumple `edad` años hoy
function fechaConEdad(edad: number): string {
  const hoy = new Date();
  const anio = String(hoy.getFullYear() - edad);
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

const DATOS_VALIDOS = {
  nombre: 'Ana Pérez',
  usuario: 'anap',
  correo: 'ana@correo.cl',
  clave: 'Clave123',
  repetir: 'Clave123',
  fecha: fechaConEdad(20),
  direccion: '',
};

describe('Registro (formulario reactivo)', () => {
  let fixture: ComponentFixture<Registro>;
  let componente: Registro;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registro],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Registro);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('es inválido vacío y la dirección de despacho es opcional', () => {
    expect(componente.formulario.valid).toBeFalse();
    componente.formulario.setValue(DATOS_VALIDOS);
    expect(componente.formulario.valid).toBeTrue();
  });

  it('marca error si las dos contraseñas no coinciden', () => {
    componente.formulario.setValue({ ...DATOS_VALIDOS, repetir: 'Otra1234' });
    expect(componente.formulario.hasError('clavesDistintas')).toBeTrue();
    expect(componente.formulario.valid).toBeFalse();
  });

  it('exige contraseña de 6 a 18 caracteres con un número y una mayúscula', () => {
    const clave = componente.formulario.controls.clave;
    clave.setValue('Ab1');
    expect(clave.hasError('minlength')).toBeTrue();
    clave.setValue('Abcdefghijklmnopq12');
    expect(clave.hasError('maxlength')).toBeTrue();
    clave.setValue('clave123');
    expect(clave.hasError('sinMayuscula')).toBeTrue();
    clave.setValue('ClaveSegura');
    expect(clave.hasError('sinNumero')).toBeTrue();
    clave.setValue('Clave123');
    expect(clave.valid).toBeTrue();
  });

  it('rechaza un correo sin formato de email', () => {
    const correo = componente.formulario.controls.correo;
    correo.setValue('ana@correo');
    expect(correo.valid).toBeFalse();
    correo.setValue('ana@correo.cl');
    expect(correo.valid).toBeTrue();
  });

  it('no permite registrarse con menos de 13 años', () => {
    const fecha = componente.formulario.controls.fecha;
    fecha.setValue(fechaConEdad(12));
    expect(fecha.hasError('edadMinima')).toBeTrue();
    fecha.setValue(fechaConEdad(13));
    expect(fecha.valid).toBeTrue();
  });

  it('al enviar un formulario inválido muestra los errores y no registra al usuario', () => {
    const sesion = TestBed.inject(SesionService);
    spyOn(sesion, 'registrar');

    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    boton.click();
    fixture.detectChanges();

    expect(sesion.registrar).not.toHaveBeenCalled();
    const errores = fixture.nativeElement.querySelectorAll('.is-invalid');
    expect(errores.length).toBe(6); // todos menos la dirección
    expect(fixture.nativeElement.querySelector('#error-nombre').textContent).toContain('obligatorio');
  });

  it('registra al usuario con datos válidos y el botón Limpiar vacía el formulario', () => {
    const sesion = TestBed.inject(SesionService);
    componente.formulario.setValue(DATOS_VALIDOS);
    componente.enviar();

    expect(sesion.buscarUsuario('anap')).toBeDefined();
    expect(componente.tipoMensaje).toBe('success');

    componente.formulario.patchValue({ nombre: 'Algo' });
    const limpiar: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="button"]');
    limpiar.click();
    expect(componente.formulario.getRawValue().nombre).toBe('');
    expect(componente.mensaje).toBe('');
  });
});
