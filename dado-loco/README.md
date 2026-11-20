# Dado Loco 🎲 (Angular)

Tienda online de una PYME que vende juegos de mesa (Desarrollo Full Stack II, DSY2202).

Es el mismo sitio de la semana 3 (HTML, CSS y Bootstrap), pasado a **Angular 20**. Este proyecto se trabaja todas las semanas desde la semana 4; el avance de cada una queda en el historial de Git.

- **Semana 4** (actividad formativa 3): *Integrando un framework a nuestro FrontEnd*.
- **Semana 5** (actividad formativa 4): *Implementando pruebas unitarias*: formularios reactivos, validaciones, eventos y pruebas con Jasmine y Karma.

## Cómo ejecutarlo

Necesitas Node.js y Angular CLI (`npm install -g @angular/cli`). Desde esta carpeta:

```bash
npm install
```

```bash
ng serve
```

Luego abre <http://localhost:4200/>. La carpeta `node_modules` no se sube a Git ni va en el ZIP: `npm install` la vuelve a crear.

### Cuentas de prueba

| Rol | Usuario | Contraseña | Qué puede hacer |
|---|---|---|---|
| Cliente | `cliente` | `Cliente123` | Comprar, ver sus compras y editar su perfil |
| Administrador | `admin` | `Admin123` | Gestionar productos, inventario y usuarios, y ver todas las ventas |

Los datos (productos, usuarios, carrito y pedidos) son **estáticos**: viven en variables de TypeScript y se comparten entre páginas mientras la app está abierta. Al recargar el navegador vuelven a los datos iniciales.

## De HTML a componentes

Cada HTML de la semana 3 pasó a ser un componente con su ruta. Las 4 páginas de categoría y la de producto ahora son **un solo componente cada una** que recibe los datos por la ruta.

| Semana 3 | Semana 4 (ruta) | Componente |
|---|---|---|
| `index.html` | `/` | `paginas/inicio` |
| `catalogo.html` | `/catalogo` | `paginas/catalogo` |
| `estrategia.html`, `familiares.html`, `cartas.html`, `cooperativos.html` | `/categoria/:nombre` | `paginas/categoria` (uno solo) |
| `producto.html?id=...` | `/producto/:id` | `paginas/producto` |
| `carrito.html` | `/carrito` | `paginas/carrito` |
| Mensaje de compra dentro del carrito | `/compra-exitosa` | `paginas/compra-exitosa` |
| `login.html` | `/login` | `paginas/login` |
| `registro.html` | `/registro` | `paginas/registro` |
| `recuperar.html` | `/recuperar` | `paginas/recuperar` |
| `perfil.html` | `/perfil` (con sesión) | `paginas/perfil` |
| `historial.html` | `/historial` (con sesión) | `paginas/historial` |
| `admin.html` | `/admin` (solo administrador) | `paginas/admin` |
| Menú y pie repetidos en cada HTML | Se escriben una vez | `componentes/encabezado`, `componentes/pie` |
| Tarjeta de producto armada con `innerHTML` | Componente reutilizable con `@Input` | `componentes/ficha-producto` |

## Estructura

```
src/
├── index.html                 Solo <app-root>; Bootstrap ya no va por CDN
├── styles.css                 Estilos de la semana 3 (globales)
└── app/
    ├── app.ts / app.html      Menú + <router-outlet> + pie
    ├── app.routes.ts          Rutas de todas las páginas
    ├── datos/datos.ts         Datos estáticos: categorías, juegos y cuentas de prueba
    ├── servicios/
    │   ├── tienda.service.ts  Productos, carrito y pedidos
    │   ├── sesion.service.ts  Usuarios, sesión y rol
    │   ├── sesion.guard.ts    Protege /perfil, /historial y /admin
    │   ├── validadores.ts     Validadores de los formularios reactivos
    │   └── peso.pipe.ts       Formato $39.990
    ├── componentes/           Encabezado, pie y tarjeta de producto
    └── paginas/               Una carpeta por página (ver tabla anterior)
public/img/                    Imágenes de categorías y juegos
```

## Requisitos de la semana 4

| Requisito | Dónde |
|---|---|
| Proyecto nuevo en Angular con un componente por HTML | `src/app/paginas/` y `app.routes.ts` |
| HTML y CSS adaptados | Cada `.html` de `paginas/` tiene solo el contenido del `<main>`; los estilos están en `src/styles.css` |
| Bootstrap reconocido por el proyecto | `npm install bootstrap` y rutas de CSS y JS en `angular.json` (`styles` y `scripts`, en `build` y `test`) |
| Datos estáticos en variables del `.ts` | `datos/datos.ts` y los servicios |
| `*ngIf` | Agotado / últimas unidades, carrito vacío, menú según el rol, mensajes, "no encontrado", columnas solo para el admin |
| `*ngFor` | Categorías del inicio y del menú, tarjetas de juegos, filas del carrito, historial y tablas de administración |
| `[(ngModel)]` | Se usó en la semana 4; en la semana 5 se reemplazó por formularios reactivos (ver abajo) |
| Pasar datos entre páginas | Parámetros de ruta (`/producto/:id`, `/categoria/:nombre`), `queryParams` (`/login?volver=/carrito`) y `NavigationExtras` con `state` (el carrito envía el pedido a `/compra-exitosa`) |
| Sin validaciones ni JS de formularios | No se copiaron `validaciones.js`, `formulario.js` ni los JS por página |

## Requisitos de la semana 5

| Requisito | Dónde |
|---|---|
| Todos los formularios pasan a formularios reactivos | `ReactiveFormsModule` con `FormBuilder`/`FormGroup` en registro, login, recuperar, perfil, carrito (despacho y pago), producto (cantidad), catálogo (buscador y filtro) y administración (productos). Ya no queda ningún `ngModel` |
| Ningún campo vacío o nulo, salvo la dirección | Validador `obligatorio` (también rechaza textos con solo espacios); `direccion` no tiene validaciones |
| Correo con formato de email | Validador `correo` (exige dominio, ej. `nombre@correo.cl`) |
| Las dos contraseñas iguales | Validador de grupo `camposIguales('clave', 'repetir')` |
| Contraseña con al menos un número y una mayúscula | Validador `claveSegura` |
| Contraseña de 6 a 18 caracteres | `Validators.minLength(6)` y `Validators.maxLength(18)` |
| Mínimo 13 años para registrarse | Validador `edadMinima(13)` sobre la fecha de nacimiento |
| Botones Enviar y Limpiar | Registro: `(ngSubmit)="enviar()"` y `(click)="limpiar()"` (`formulario.reset()`) |
| Eventos | `(ngSubmit)`, `(click)` y `(change)` (cantidad del carrito y rol de usuario en administración) |
| Mensajes de error | Bajo cada campo, con las clases `is-invalid` / `invalid-feedback` de Bootstrap, al salir del campo o al intentar enviar |
| 2 pruebas unitarias o más | `registro.spec.ts` (7 pruebas) y `validadores.spec.ts` (2 pruebas) |

Todos los validadores están en `src/app/servicios/validadores.ts`.

## Pruebas unitarias

```bash
ng test
```

Usa **Jasmine** (para escribir las pruebas) y **Karma** (las ejecuta en Chrome). Para correrlas una sola vez, sin dejar el navegador abierto:

```bash
ng test --watch=false --browsers=ChromeHeadless
```

| Archivo | Qué prueba |
|---|---|
| `app.spec.ts` | La app se crea y muestra el logo en el menú |
| `paginas/registro/registro.spec.ts` | Formulario vacío inválido y dirección opcional; contraseñas distintas; largo, número y mayúscula de la contraseña; formato del correo; menos de 13 años; enviar un formulario inválido marca los errores y no registra; registro exitoso y botón Limpiar |
| `servicios/validadores.spec.ts` | Cálculo de la edad antes y después del cumpleaños; un campo con solo espacios cuenta como vacío |

## Tecnologías

Angular 20 (componentes standalone), TypeScript, HTML5, CSS3 y Bootstrap 5.3.
