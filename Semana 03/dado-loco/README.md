# Dado Loco 🎲

Tienda online de una PYME que vende juegos de mesa. Evaluación sumativa 1 de la semana 3: **Desarrollando nuestro primer FrontEnd** (Desarrollo Full Stack II, DSY2202).

## Cómo verlo

Abre `index.html` en el navegador, idealmente con la extensión **Live Server** de VS Code. No necesita instalaciones, pero sí internet, porque Bootstrap se carga desde un CDN.

### Cuentas de prueba

| Rol | Usuario | Contraseña | Qué puede hacer |
|---|---|---|---|
| Cliente | `cliente` | `Cliente123` | Comprar, ver sus compras y editar su perfil |
| Administrador | `admin` | `Admin123` | Gestionar productos, inventario y usuarios, y ver todas las ventas |

Los usuarios que se registran quedan guardados en el navegador (`localStorage`) con rol cliente. Para volver a los datos iniciales, borra el `localStorage` del sitio desde las herramientas de desarrollo (F12 → Application → Local Storage).

## Páginas

| Página | Quién la ve | Qué hace |
|---|---|---|
| `index.html` | Todos | Inicio con las 4 categorías |
| `catalogo.html` | Todos | Todos los juegos, con búsqueda por nombre y filtro por categoría |
| `estrategia.html`, `familiares.html`, `cartas.html`, `cooperativos.html` | Todos | Juegos de cada categoría |
| `producto.html?id=...` | Todos | Detalle del juego y cantidad a agregar al carrito |
| `carrito.html` | Visitantes y clientes | Cambiar cantidades, quitar juegos y confirmar la compra (simulada) |
| `login.html` | Visitantes | Inicio de sesión |
| `registro.html` | Visitantes | Registro de usuarios |
| `recuperar.html` | Visitantes | Recuperar contraseña (simulado) |
| `perfil.html` | Con sesión | Modificar datos y contraseña |
| `historial.html` | Con sesión | Cliente: sus compras. Administrador: todas las ventas |
| `admin.html` | Solo administrador | Mantenedor de productos e inventario, y de usuarios y roles |

## Estructura

```
dado-loco/
├── *.html                  Páginas (ver tabla anterior)
├── css/styles.css          Estilos propios de todo el sitio
├── js/sesion.js            Usuarios, sesión, permisos y menú según el rol
├── js/tienda.js            Productos, carrito y pedidos (datos ficticios)
├── js/validaciones.js      Reglas de validación de todos los formularios
├── js/formulario.js        Conecta las reglas con el DOM (común a los formularios)
├── js/catalogo.js          Catálogo y páginas de categoría
├── js/producto.js          Detalle del juego
├── js/carrito.js           Carrito y compra simulada
├── js/historial.js         Historial de compras y ventas
├── js/admin.js             Panel de administración
├── js/registro.js, login.js, recuperar.js, perfil.js
├── tests/                  Pruebas con Node.js
├── docs/tareas-trello.md   Tareas para el tablero de Trello
└── img/                    Imágenes de categorías y juegos (SVG)
```

## Requisitos cubiertos

| Requisito | Dónde |
|---|---|
| Inicio de sesión, registro, recuperar contraseña y modificación de perfil | `login.html`, `registro.html`, `recuperar.html`, `perfil.html` |
| Al menos 2 roles con privilegios distintos | Cliente y administrador: menú, páginas permitidas (`exigirSesion`) y botones distintos |
| Contraseña con al menos 4 validaciones | Regla `clave`: largo mínimo 6, largo máximo 18, un número y una mayúscula |
| Validaciones en todos los formularios | `js/validaciones.js`: registro, login, recuperar, perfil, cantidad, compra y producto |
| Páginas propias de la temática (e-commerce) | Catálogo, detalle, carrito, confirmación, historial y administración |
| Mantenedores de productos, inventario y usuarios | `admin.html` |
| Pago simulado, sin WebPay | `carrito.html` muestra "Compra realizada correctamente (simulación)" |
| Responsividad en 3 tamaños con la grilla de 12 columnas | `row`, `col-*`, `row-cols-*` y `table-responsive` en todas las páginas |
| Manipulación del DOM con JavaScript | Tarjetas, tablas y mensajes creados desde los datos; clases `is-valid` e `is-invalid`; contador del carrito |

## Pruebas

Las validaciones, la sesión y la tienda se prueban con Node.js, desde esta carpeta:

```bash
node --test
```

## Alcance

El sitio no tiene backend: usuarios, productos, carrito y pedidos se simulan con `localStorage`, y las contraseñas se guardan sin cifrar. Recuperar contraseña no envía correos y la compra no cobra nada.

## Tecnologías

HTML5 semántico, CSS3 (variables y animaciones), Bootstrap 5.3 y JavaScript.
