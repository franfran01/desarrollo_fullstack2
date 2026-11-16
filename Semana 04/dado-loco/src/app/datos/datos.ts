/* ==========================================================
   Dado Loco - Datos estáticos de la tienda
   Son los mismos datos de la semana 3, ahora como variables
   de TypeScript con su tipo. Los servicios parten desde aquí.
   ========================================================== */

export interface Categoria {
  id: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  imagen: string;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  descuento: number;
  stock: number;
  imagen: string;
  descripcion: string;
}

export interface Usuario {
  usuario: string;
  nombre: string;
  correo: string;
  clave: string;
  rol: 'admin' | 'cliente';
  direccion: string;
  fecha?: string;
}

export interface ItemCarrito {
  id: string;
  cantidad: number;
}

export interface Pedido {
  numero: number;
  usuario: string;
  fecha: Date;
  direccion: string;
  pago: string;
  items: { nombre: string; precio: number; cantidad: number }[];
  total: number;
}

export const CATEGORIAS: Categoria[] = [
  { id: 'estrategia', nombre: 'Estrategia', emoji: '♟️', descripcion: 'Planifica, negocia y conquista. Juegos para mentes tácticas.', imagen: 'img/cat-estrategia.svg' },
  { id: 'familiares', nombre: 'Familiares', emoji: '👨‍👩‍👧', descripcion: 'Diversión para todas las edades, ideal para juntarse en familia.', imagen: 'img/cat-familiares.svg' },
  { id: 'cartas', nombre: 'Cartas', emoji: '🃏', descripcion: 'Partidas rápidas y portátiles para llevar a cualquier parte.', imagen: 'img/cat-cartas.svg' },
  { id: 'cooperativos', nombre: 'Cooperativos', emoji: '🤝', descripcion: 'Todos contra el juego: ganan o pierden en equipo.', imagen: 'img/cat-cooperativos.svg' },
];

export const MEDIOS_PAGO: string[] = ['Tarjeta de débito', 'Tarjeta de crédito', 'Transferencia'];

export const PRODUCTOS_INICIALES: Producto[] = [
  { id: 'catan', nombre: 'Catan', categoria: 'estrategia', precio: 39990, descuento: 10, stock: 8, imagen: 'img/catan.webp', descripcion: 'Coloniza una isla, comercia recursos y construye caminos y ciudades. De 3 a 4 jugadores.' },
  { id: 'carcassonne', nombre: 'Carcassonne', categoria: 'estrategia', precio: 29990, descuento: 0, stock: 5, imagen: 'img/carcassonne.webp', descripcion: 'Arma el paisaje medieval loseta a loseta y coloca a tus seguidores en ciudades y caminos.' },
  { id: 'ticket-to-ride', nombre: '¡Aventureros al Tren!', categoria: 'estrategia', precio: 44990, descuento: 15, stock: 2, imagen: 'img/ticket-to-ride.webp', descripcion: 'Conecta ciudades con rutas de tren y completa tus billetes de destino antes que el resto.' },
  { id: 'dixit', nombre: 'Dixit', categoria: 'familiares', precio: 32990, descuento: 0, stock: 6, imagen: 'img/dixit.webp', descripcion: 'Usa tu imaginación para describir cartas ilustradas y adivina la carta de los demás.' },
  { id: 'pictionary', nombre: 'Pictionary', categoria: 'familiares', precio: 24990, descuento: 20, stock: 10, imagen: 'img/pictionary.webp', descripcion: 'Dibuja contra el reloj y haz que tu equipo adivine la palabra secreta.' },
  { id: 'monopoly', nombre: 'Monopoly', categoria: 'familiares', precio: 27990, descuento: 0, stock: 4, imagen: 'img/monopoly.webp', descripcion: 'Compra propiedades, construye hoteles y lleva a la quiebra a tus rivales.' },
  { id: 'uno', nombre: 'UNO', categoria: 'cartas', precio: 6990, descuento: 0, stock: 25, imagen: 'img/uno.webp', descripcion: 'El clásico de colores y números: deshazte de todas tus cartas y no olvides gritar ¡UNO!' },
  { id: 'exploding-kittens', nombre: 'Exploding Kittens', categoria: 'cartas', precio: 19990, descuento: 10, stock: 7, imagen: 'img/exploding-kittens.webp', descripcion: 'Ruleta rusa con gatitos: evita robar el gatito explosivo o quedas fuera.' },
  { id: 'dobble', nombre: 'Dobble', categoria: 'cartas', precio: 15990, descuento: 0, stock: 12, imagen: 'img/dobble.webp', descripcion: 'Encuentra el único símbolo en común entre dos cartas antes que nadie.' },
  { id: 'pandemic', nombre: 'Pandemic', categoria: 'cooperativos', precio: 42990, descuento: 10, stock: 3, imagen: 'img/pandemic.webp', descripcion: 'Viaja por el mundo como equipo de especialistas para curar cuatro enfermedades.' },
  { id: 'hanabi', nombre: 'Hanabi', categoria: 'cooperativos', precio: 12990, descuento: 0, stock: 0, imagen: 'img/hanabi.webp', descripcion: 'Arma el espectáculo de fuegos artificiales perfecto viendo las cartas de todos menos las tuyas.' },
  { id: 'isla-prohibida', nombre: 'La Isla Prohibida', categoria: 'cooperativos', precio: 21990, descuento: 15, stock: 9, imagen: 'img/isla-prohibida.webp', descripcion: 'Recupera los cuatro tesoros sagrados antes de que la isla se hunda bajo el mar.' },
];

// shortcut: contraseñas en texto plano, solo para la demo; reemplazar por un backend cuando exista
export const CUENTAS_DEMO: Usuario[] = [
  { usuario: 'admin', nombre: 'Administradora Dado Loco', correo: 'admin@dadoloco.cl', clave: 'Admin123', rol: 'admin', direccion: '' },
  { usuario: 'cliente', nombre: 'Camila Rojas', correo: 'cliente@dadoloco.cl', clave: 'Cliente123', rol: 'cliente', direccion: 'Av. Siempre Viva 742, Santiago' },
];
