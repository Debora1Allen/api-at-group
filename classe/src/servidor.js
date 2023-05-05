const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const verifica = require('./verificaLogin');
const usuario = require('./controladores/usuarios');

const app = express();

app.use(express.json());

app.post('/usuario', usuarios.cadastrarUsuario);
app.post('/login',login.login);
app.use(verifica);
app.get('/usuario', usuario.detalharUsuario);
app.put('/usuario', usuario.atulizarUsuario);

module.exports = app;