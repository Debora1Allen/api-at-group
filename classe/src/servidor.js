const express = require('express');
const usuarios = require('./controladores/usuarios');

const rotas = express();

rotas.post('/cadastro', usuarios.cadastrar);
rotas.post('/login', usuarios.login);

rotas.use(verificaToken);

rotas.get('/detalhar', usuarios.detalhar);
rotas.put('/atualizar', usuarios.atualizar);

module.exports = rotas;