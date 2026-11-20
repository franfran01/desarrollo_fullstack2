# Tablero Trello — Dado Loco (semanas 4 y 5)

Agrega estas tareas al tablero de las semanas anteriores, con las mismas 4 listas:

1. **Iniciado**
2. **Proceso**
3. **No terminado por dificultades**
4. **Terminado**

Mueve cada tarjeta a la lista que corresponda según tu avance real.

## Tareas

| # | Tarea | Descripción |
|---|---|---|
| 1 | Análisis del requerimiento | Leer guía, instrucciones y pauta de la semana 4 |
| 2 | Instalar herramientas | Node.js, npm y Angular CLI (`npm install -g @angular/cli`) |
| 3 | Crear el proyecto Angular | `ng new dado-loco` en `Semana 04/` |
| 4 | Instalar Bootstrap | `npm install bootstrap` y agregarlo en `angular.json` |
| 5 | Pasar CSS e imágenes | `styles.css` global e imágenes en `public/img` |
| 6 | Componentes compartidos | Encabezado (menú según rol), pie y tarjeta de producto con `@Input` |
| 7 | Datos estáticos | Categorías, juegos y cuentas en `datos.ts`, servicios de tienda y sesión |
| 8 | Páginas y rutas | Un componente por página y sus rutas en `app.routes.ts` |
| 9 | Directivas | `*ngIf`, `*ngFor` y `[(ngModel)]` en catálogo, carrito, formularios y administración |
| 10 | Una sola página de categoría | Reemplazar los 4 HTML por `/categoria/:nombre` |
| 11 | Detalle dinámico del juego | `/producto/:id` recibe el id y muestra sus datos |
| 12 | Confirmación de compra | El carrito envía el pedido a `/compra-exitosa` con `NavigationExtras` |
| 13 | Rutas protegidas | Perfil e historial con sesión, administración solo para el admin |
| 14 | Pruebas | `ng serve`, recorrer todas las páginas en celular, tablet y PC, y `ng test` |
| 15 | README del proyecto | Cómo ejecutarlo, tabla HTML → componente y requisitos cubiertos |
| 16 | Entrega | ZIP sin `node_modules` + links de Git y Trello en el AVA |

## Tareas de la semana 5

| # | Tarea | Descripción |
|---|---|---|
| 17 | Análisis del requerimiento | Leer guía, instrucciones y pauta de la semana 5 |
| 18 | Ordenar el repositorio | Mover el proyecto a `dado-loco/` en la raíz para trabajarlo todas las semanas |
| 19 | Validadores | `validadores.ts`: obligatorio, correo, contraseña segura, edad mínima y contraseñas iguales |
| 20 | Registro reactivo | `FormBuilder` con todas las validaciones, mensajes de error y botones Enviar y Limpiar |
| 21 | Demás formularios reactivos | Login, recuperar, perfil, carrito, producto, catálogo y administración sin `ngModel` |
| 22 | Eventos | `(ngSubmit)`, `(click)` y `(change)` en formularios, carrito y administración |
| 23 | Pruebas unitarias | `registro.spec.ts` y `validadores.spec.ts` con Jasmine y Karma (`ng test`) |
| 24 | Pruebas manuales | `ng serve` y revisar cada formulario con datos válidos e inválidos |
| 25 | README | Requisitos de la semana 5 y cómo correr las pruebas |
| 26 | Entrega | ZIP sin `node_modules` + links de Git y Trello en el AVA |
