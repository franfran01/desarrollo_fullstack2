# Dado Loco 🎲

Sitio web de una PYME que vende juegos de mesa. Actividad formativa 2 de la semana 2: **Adaptando nuestra interfaz gráfica** (Desarrollo Full Stack II, DSY2202).

## Cómo verlo

Abre `index.html` en el navegador. No necesita servidor ni instalaciones, pero sí internet, porque Bootstrap se carga desde un CDN.

## Estructura

```
dado-loco/
├── index.html              Página principal: nombre de la PYME y las 4 categorías
├── estrategia.html         Categoría con 3 juegos
├── familiares.html         Categoría con 3 juegos
├── cartas.html             Categoría con 3 juegos
├── cooperativos.html       Categoría con 3 juegos
├── registro.html           Formulario de registro de compradores
├── css/styles.css          Estilos propios de todo el sitio
├── js/validaciones.js      Reglas de validación del formulario
├── js/registro.js          Conecta las reglas con el DOM
├── tests/                  Pruebas de las reglas de validación
└── img/                    Imágenes de categorías y juegos (SVG)
```

## Requisitos cubiertos

| Requisito | Dónde |
|---|---|
| Formulario con nombre, usuario, correo, contraseña, repetir contraseña, fecha de nacimiento y dirección | `registro.html` |
| Campos obligatorios (la dirección es opcional) | `js/validaciones.js` |
| Correo con formato de email | Regla `correo` |
| Contraseñas iguales | Regla `repetir` |
| Contraseña de 6 a 18 caracteres, con un número y una mayúscula | Regla `clave` |
| Edad mínima de 13 años | Regla `fecha` y función `calcularEdad` |
| Botones Enviar y Limpiar | `registro.html` |
| Responsividad con Bootstrap en 3 tamaños de pantalla | Navbar y grilla (`row`, `col`) en todas las páginas |
| Se mantiene el diseño de la semana 1 | Colores, menú y animaciones en `css/styles.css` |
| Manipulación dinámica de CSS y HTML con JavaScript | `js/registro.js`: clases `is-valid` e `is-invalid`, atributos `aria-invalid` y `max`, mensajes de error y mensaje de éxito creado con `createElement` |

## Pruebas

Las reglas de validación se prueban con Node.js, desde esta carpeta:

```bash
node --test
```

## Alcance

El sitio no tiene backend: al enviar el formulario se valida y se muestra un mensaje de éxito, pero los datos no se guardan.

## Tecnologías

HTML5 semántico, CSS3 (variables y animaciones), Bootstrap 5.3 y JavaScript.
