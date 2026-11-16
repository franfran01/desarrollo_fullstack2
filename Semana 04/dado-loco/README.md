# Dado Loco 🎲 (Angular)

Tienda online de una PYME que vende juegos de mesa. Actividad formativa 3 de la semana 4: **Integrando un framework a nuestro FrontEnd** (Desarrollo Full Stack II, DSY2202).

Es el mismo sitio de la semana 3 (HTML, CSS y Bootstrap), pasado a **Angular 20**.

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
    │   └── peso.pipe.ts       Formato $39.990
    ├── componentes/           Encabezado, pie y tarjeta de producto
    └── paginas/               Una carpeta por página (ver tabla anterior)
public/img/                    Imágenes de categorías y juegos
```

## Requisitos de la actividad

| Requisito | Dónde |
|---|---|
| Proyecto nuevo en Angular con un componente por HTML | `src/app/paginas/` y `app.routes.ts` |
| HTML y CSS adaptados | Cada `.html` de `paginas/` tiene solo el contenido del `<main>`; los estilos están en `src/styles.css` |
| Bootstrap reconocido por el proyecto | `npm install bootstrap` y rutas de CSS y JS en `angular.json` (`styles` y `scripts`, en `build` y `test`) |
| Datos estáticos en variables del `.ts` | `datos/datos.ts` y los servicios |
| `*ngIf` | Agotado / últimas unidades, carrito vacío, menú según el rol, mensajes, "no encontrado", columnas solo para el admin |
| `*ngFor` | Categorías del inicio y del menú, tarjetas de juegos, filas del carrito, historial y tablas de administración |
| `[(ngModel)]` | Buscador y filtro del catálogo, cantidad, despacho y pago, login, registro, recuperar, perfil, formulario de productos y rol de usuarios |
| Pasar datos entre páginas | Parámetros de ruta (`/producto/:id`, `/categoria/:nombre`), `queryParams` (`/login?volver=/carrito`) y `NavigationExtras` con `state` (el carrito envía el pedido a `/compra-exitosa`) |
| Sin validaciones ni JS de formularios | No se copiaron `validaciones.js`, `formulario.js` ni los JS por página |

## Pruebas

```bash
ng test
```

Usa Jasmine y Karma. Por ahora solo comprueba que la app se crea y muestra el menú.

## Tecnologías

Angular 20 (componentes standalone), TypeScript, HTML5, CSS3 y Bootstrap 5.3.
