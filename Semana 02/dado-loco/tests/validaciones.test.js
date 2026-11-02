// Ejecutar desde la carpeta del proyecto con: node --test
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// validaciones.js es un script clásico de navegador (para que funcione abriendo el HTML sin servidor)
vm.runInThisContext(fs.readFileSync(path.join(__dirname, "../js/validaciones.js"), "utf8"));
const { calcularEdad, validadores } = vm.runInThisContext("({ calcularEdad, validadores })");

const HOY = new Date(2026, 10, 2); // 2 de noviembre de 2026

test("campos obligatorios vacíos o solo con espacios", () => {
  assert.notEqual(validadores.nombre({ nombre: "   " }), "");
  assert.notEqual(validadores.usuario({ usuario: "" }), "");
  assert.notEqual(validadores.correo({ correo: "" }), "");
  assert.notEqual(validadores.clave({ clave: "" }), "");
  assert.notEqual(validadores.repetir({ repetir: "" }), "");
  assert.notEqual(validadores.fecha({ fecha: "" }, HOY), "");
  assert.equal(validadores.nombre({ nombre: "Ana Pérez" }), "");
});

test("formato del correo", () => {
  for (const malo of ["ana", "ana@", "ana@dominio", "@dominio.cl", "a na@dominio.cl"]) {
    assert.notEqual(validadores.correo({ correo: malo }), "", malo);
  }
  assert.equal(validadores.correo({ correo: "ana@dominio.cl" }), "");
});

test("largo de la contraseña entre 6 y 18", () => {
  assert.notEqual(validadores.clave({ clave: "Abc12" }), "");
  assert.equal(validadores.clave({ clave: "Abc123" }), "");
  assert.equal(validadores.clave({ clave: "Abc123" + "x".repeat(12) }), "");
  assert.notEqual(validadores.clave({ clave: "Abc123" + "x".repeat(13) }), "");
});

test("la contraseña exige número y mayúscula", () => {
  assert.notEqual(validadores.clave({ clave: "Abcdefg" }), "");
  assert.notEqual(validadores.clave({ clave: "abc1234" }), "");
  assert.equal(validadores.clave({ clave: "Ñandú123" }), "");
});

test("las contraseñas deben coincidir", () => {
  assert.notEqual(validadores.repetir({ clave: "Abc123", repetir: "Abc124" }), "");
  assert.equal(validadores.repetir({ clave: "Abc123", repetir: "Abc123" }), "");
});

test("edad mínima de 13 años, justo en el límite", () => {
  assert.equal(validadores.fecha({ fecha: "2013-11-02" }, HOY), "");
  assert.notEqual(validadores.fecha({ fecha: "2013-11-03" }, HOY), "");
  assert.notEqual(validadores.fecha({ fecha: "2030-01-01" }, HOY), "");
});

test("nacido el 29 de febrero en un año sin esa fecha", () => {
  assert.equal(calcularEdad("2012-02-29", new Date(2025, 1, 28)), 12);
  assert.equal(calcularEdad("2012-02-29", new Date(2025, 2, 1)), 13);
});
