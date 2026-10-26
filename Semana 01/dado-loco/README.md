# Dado Loco 🎲

Sitio web de una PYME que vende juegos de mesa. Actividad formativa 1 de la semana 1: **Desarrollando nuestra interfaz gráfica** (Desarrollo Full Stack II, DSY2202).

## Cómo verlo

Abre `index.html` en el navegador. No necesita servidor ni instalaciones.

## Estructura

```
dado-loco/
├── index.html          Página principal: nombre de la PYME y las 4 categorías
├── estrategia.html     Categoría con 3 juegos
├── familiares.html     Categoría con 3 juegos
├── cartas.html         Categoría con 3 juegos
├── cooperativos.html   Categoría con 3 juegos
├── css/styles.css      Estilos de todo el sitio
└── img/                Imágenes de categorías y juegos (SVG)
```

## Requisitos cubiertos

| Requisito | Dónde |
|---|---|
| Nombre de la PYME y listado de categorías | `index.html` |
| Cada categoría con hipervínculo e imagen | Tarjetas de `index.html` |
| Ficha de juego: imagen, nombre, descripción, precio, descuento | Cada página de categoría |
| Navegación entre páginas y volver al inicio | Menú superior y botones al final de cada categoría |
| 4 categorías con 3 juegos cada una | `estrategia`, `familiares`, `cartas`, `cooperativos` |
| Variables CSS | Bloque `:root` en `css/styles.css` |
| Al menos 4 animaciones CSS | 5 `@keyframes`: `aparecer`, `girar`, `flotar`, `latido`, `fondo-animado` |
| Media queries para responsividad | Cortes en 992px (tablet) y 600px (celular) |

## Tecnologías

HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `footer`) y CSS3 (Grid, Flexbox, variables, animaciones, media queries).
