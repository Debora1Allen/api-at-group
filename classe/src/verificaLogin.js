const knex = require('../conexao');
const jwt = require('jsonwebtoken');


const verificaLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json('Token não informado');
  }

  try {

    const token = authorization.replace('Bearer', '').trim();

    const usuario = jwt.verify(token, process.env.SEGREDO);

    const usuarioEncontrado = await knex('usuarios').where({ id: usuario.id }).first();

    if (!usuarioEncontrado) {
      return res.status(400).json('O usuário não existe.');
    }

    req.usuario = {
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email
    }

    next();

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = verificaLogin;