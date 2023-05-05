const express = require('express');
const usuarios = require('./controladores');

const servidor = express();

servidor.post('/cadastro', usuarios.cadastrar);
servidor.post('/login', usuarios.login);

servidor.use(verificaToken);

servidor.get('/detalhar', usuarios.detalhar);
servidor.put('/atualizar', usuarios.atualizar);

module.exports = servidor;