const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioSchema = require('../schemas/schemaUsuario');
const loginSchema = require('../schemas/loginSchema');

const cadastrar = async (req, res) => {

  const { nome, email, senha, deleted = false} = req.body;
  try {
    await usuarioSchema.validate(req.body);
    const emailCadastrado = await knex('usuarios').where({ email: email }).first();

    if (emailCadastrado) {
      return res.status(400).json('O email fornecido já existe.');
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await knex('usuarios').insert({ nome, email, senha: senhaCriptografada, deleted:false});

    return res.status(201).json('Cadastro realizado com sucesso');

  } catch (error) {
    return res.status(400).json(error.message);
  }

}

const detalhar = async (req, res) => {
  const usuario = req.usuario;

  try {
    const detalhar = await knex('usuarios').where({ id: usuario.id }).first();
    const { senha, ...resto } = detalhar
    return res.status(200).json(resto)


  } catch (error) {
    return res.status(401).json({ mensagem: error.message })

  }
}

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    await loginSchema.validate(req.body);
    const usuario = await knex('usuarios').where('email', email).first();

    if (!usuario) {
      return res.status(400).json('O email fornecido não existe.');
    }

    const verificarSenha = await bcrypt.compare(senha, usuario.senha);

    if (!verificarSenha) {
      return res.status(400).json('Senha incorreta');
    }

    const token = jwt.sign({ id: usuario.id }, process.env.SEGREDO, { expiresIn: '12h' });

    return res.status(201).json(token);

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const atualizar = async (req, res) => {
  const { nome, email, senha} = req.body;
  const { id } = req.usuario;

  try {
    await usuarioSchema.validate(req.body);
    const usuario = await knex('usuarios').where({ email }).first();

    if (usuario && usuario.email === email && usuario.id !== id) {
      return res.status(400).json('O e-mail informado já está sendo utilizado por outro usuário.')
    };

    let body = {
      nome,
      email
    };

    if (senha) {
      const senhaCripto = await bcrypt.hash(senha, 10);
      body = { ...body, senha: senhaCripto }
    }

    const usuarioAtualizado = await knex('usuarios')
      .where({ id })
      .update(body);

    if (!usuarioAtualizado) {
      return res.status(400).json("Não foi possível atualizar o usuário");
    }

    return res.status(200).json();

  } catch (error) {
    return res.status(400).json(error.message)
  }

  const deleteUsuario = async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await knex('usuario')
        .where({ id })
        .first();
  
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario não encontrado' });
      }
  
      await knex('usuario')
        .where({ id })
        .update({ deleted: true });
  
      return res.status(200).json({ message: 'Usuario marcado como excluido' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}


module.exports = {
  cadastrar,
  login,
  detalhar,
  atualizar,
  deleteUsuario
}