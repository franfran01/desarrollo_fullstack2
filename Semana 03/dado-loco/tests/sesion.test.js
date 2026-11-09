// Ejecutar desde la carpeta del proyecto con: node --test
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// localStorage de mentira para probar fuera del navegador
const datos = new Map();
globalThis.localStorage = {
  getItem: (k) => datos.get(k) ?? null,
  setItem: (k, v) => datos.set(k, String(v)),
  removeItem: (k) => datos.delete(k),
};
vm.runInThisContext(fs.readFileSync(path.join(__dirname, "../js/sesion.js"), "utf8"));
const s = vm.runInThisContext("({ buscarUsuario, agregarUsuario, actualizarUsuario, usuarioActual, iniciarSesion, leerUsuarios })");

test("las cuentas de prueba existen con roles distintos", () => {
  assert.equal(s.buscarUsuario("admin").rol, "admin");
  assert.equal(s.buscarUsuario(" CLIENTE@dadoloco.cl ").rol, "cliente");
  assert.equal(s.buscarUsuario("nadie"), undefined);
});

test("registrar, iniciar sesión y editar perfil", () => {
  s.agregarUsuario({ usuario: "ana", nombre: "Ana", correo: "ana@x.cl", clave: "Abc123", rol: "cliente" });
  s.iniciarSesion(s.buscarUsuario("ana"));
  assert.equal(s.usuarioActual().nombre, "Ana");
  s.actualizarUsuario("ana", { nombre: "Ana Pérez" });
  assert.equal(s.usuarioActual().nombre, "Ana Pérez");
  assert.equal(s.leerUsuarios().length, 3);
});

test("un dato dañado en localStorage no rompe el sitio", () => {
  datos.set("dadoloco.usuarios", "{roto");
  assert.equal(s.leerUsuarios().length, 2);
});
