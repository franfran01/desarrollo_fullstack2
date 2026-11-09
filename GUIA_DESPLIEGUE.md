# Guía de despliegue: Dado Loco (Desarrollo Full Stack II)

Guía para clonar y correr el proyecto en otra computadora. Está escrita para que una persona o Claude Code la siga paso a paso.

## 1. Qué es el proyecto

- Repositorio: <https://github.com/franfran01/desarrollo_fullstack2>
- Rama: `main`
- Un sitio web **estático** (HTML, CSS, JavaScript y Bootstrap 5.3 por CDN) por cada semana del curso:

| Carpeta | Contenido |
|---|---|
| `Semana 01/dado-loco/` | Sitio con HTML y CSS |
| `Semana 02/dado-loco/` | Bootstrap y formulario de registro con validaciones |
| `Semana 03/dado-loco/` | Tienda con sesión, roles, carrito y administración (la versión más reciente) |

No hay backend, base de datos, `package.json` ni dependencias que instalar. Los datos (usuarios, carrito, pedidos) se guardan en el `localStorage` del navegador.

## 2. Requisitos

| Herramienta | ¿Obligatoria? | Para qué | Versión probada |
|---|---|---|---|
| Git | Sí | Clonar el repositorio | Cualquiera reciente |
| Navegador (Chrome, Edge, Firefox) | Sí | Ver el sitio | — |
| Conexión a internet | Sí | Bootstrap se carga desde un CDN | — |
| Node.js 18 o superior | Solo para las pruebas | `node --test` | 24.22 |
| Python 3 **o** VS Code con Live Server | Recomendado | Servir el sitio en `localhost` | Python 3.13 |

Comprobar lo instalado:

```bash
git --version
```

```bash
node --version
```

```bash
python --version
```

## 3. Clonar

```bash
git clone https://github.com/franfran01/desarrollo_fullstack2.git Desarrollo_fullstack2
```

```bash
cd Desarrollo_fullstack2
```

Para hacer `git push` desde la computadora nueva hay que iniciar sesión en GitHub con la cuenta `franfran01` (por ejemplo con `gh auth login` o con el administrador de credenciales de Git), y configurar el autor:

```bash
git config user.name "franfran01"
```

```bash
git config user.email "maryfdonosor@gmail.com"
```

> Los nombres de carpeta tienen espacios (`Semana 03`): en la terminal siempre van entre comillas.

## 4. Correr el sitio

Elige una opción. Las rutas son relativas a la raíz del repositorio.

**Opción A: servidor de Python (recomendada)**

```bash
python -m http.server 5503 -d "Semana 03/dado-loco"
```

Abrir <http://localhost:5503>. Para las otras semanas, cambia la carpeta y el puerto (`5500` para Semana 01, `5502` para Semana 02). Se detiene con `Ctrl + C`.

**Opción B: VS Code + Live Server**

Abrir la carpeta `Semana 03/dado-loco` en VS Code, clic derecho sobre `index.html` → *Open with Live Server*.

**Opción C: sin servidor**

Doble clic en `Semana 03/dado-loco/index.html`. Funciona, pero el `localStorage` queda asociado a `file://`, así que los datos no se comparten con las otras opciones.

### Cuentas de prueba (Semana 03)

| Rol | Usuario | Contraseña |
|---|---|---|
| Cliente | `cliente` | `Cliente123` |
| Administrador | `admin` | `Admin123` |

Para volver a los datos iniciales: F12 → Application → Local Storage → borrar las entradas del sitio.

## 5. Correr las pruebas

Las pruebas usan el runner que trae Node.js; no hay que instalar nada. Se ejecutan desde la carpeta de cada semana:

```bash
cd "Semana 03/dado-loco" && node --test
```

```bash
cd "Semana 02/dado-loco" && node --test
```

Todas deben terminar con `fail 0`. Semana 01 no tiene pruebas.

## 6. Archivos que NO vienen al clonar

Estos archivos existen en la computadora original pero no están en GitHub. Si se necesitan, hay que copiarlos a mano (pendrive, Drive, etc.):

| Ruta | Qué es | ¿Necesario para correr? |
|---|---|---|
| `Semana 01/Exp1_S1_Maria_Donoso.zip` | Entrega de la semana 1 | No |
| `Semana 02/Exp1_S2_Maria_Donoso.zip` | Entrega de la semana 2 | No |
| `Semana 03/img/` | Imágenes originales de los juegos (las que usa el sitio ya están en `Semana 03/dado-loco/img/`) | No |
| `contexto/` | Documentos del curso (ignorados en `.gitignore` porque Duoc no permite publicarlos) | No |
| `.claude/launch.json` | Configuración local de Claude Code para la vista previa | No (se recrea abajo) |

### Recrear `.claude/launch.json` (para Claude Code)

Crear el archivo `.claude/launch.json` en la raíz del repositorio con:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "dado-loco",
      "runtimeExecutable": "python",
      "runtimeArgs": ["-m", "http.server", "5500", "-d", "Semana 01/dado-loco"],
      "port": 5500
    },
    {
      "name": "dado-loco-s2",
      "runtimeExecutable": "python",
      "runtimeArgs": ["-m", "http.server", "5502", "-d", "Semana 02/dado-loco"],
      "port": 5502
    },
    {
      "name": "dado-loco-s3",
      "runtimeExecutable": "python",
      "runtimeArgs": ["-m", "http.server", "5503", "-d", "Semana 03/dado-loco"],
      "port": 5503
    }
  ]
}
```

Si en esa computadora Python se llama `python3` o `py`, cambia `runtimeExecutable`.

## 7. Comprobar que quedó bien

- [ ] `git log --oneline` muestra el commit "Semana 03: tienda Dado Loco con sesión, roles, carrito y administración".
- [ ] <http://localhost:5503> carga la página de inicio con estilos de Bootstrap y las 4 categorías.
- [ ] Iniciar sesión con `admin` / `Admin123` muestra el enlace al panel de administración.
- [ ] Agregar un juego al carrito actualiza el contador del menú.
- [ ] `node --test` en Semana 02 y Semana 03 termina con `fail 0`.

## 8. Problemas comunes

| Síntoma | Causa | Solución |
|---|---|---|
| El sitio se ve sin estilos | No hay internet y Bootstrap no carga del CDN | Conectarse a internet |
| `python` no se reconoce | Python no instalado o con otro nombre | Instalar Python 3 o usar `python3` / `py` |
| `Address already in use` | El puerto está ocupado | Usar otro puerto, por ejemplo `5510` |
| `node --test` no encuentra pruebas | Se ejecutó desde la raíz del repositorio | Entrar primero a `Semana 0X/dado-loco` |
| `cd: Semana: No such file or directory` | Ruta con espacios sin comillas | Escribir `cd "Semana 03/dado-loco"` |
| Usuarios o carrito con datos raros | Quedó `localStorage` de pruebas anteriores | Borrar el Local Storage del sitio (F12) |
| `git push` pide credenciales o falla | No hay sesión de GitHub en esa computadora | `gh auth login` o iniciar sesión con la cuenta `franfran01` |
