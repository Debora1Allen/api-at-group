const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const schemaUsuario = require('../schemas/schemaUsuario');


const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        await schemaUsuario.validate(req.body);
        const queryEmail = 'select * from usuarios where email = $1';
        const { rowCount: usuariosCount } = await conexao.query(queryEmail, [email]);
        if (usuariosCount > 0) {
            return res.status(400).json({
                mensagem: "Já existe usuário cadastrado com o e-mail informado."
            });
        }
        const cripto = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome,nome_loja,email,senha) values($1,$2,$3,$4)';

        const registerUser = await conexao.query(query, [nome, nome_loja, email, cripto]);

        if (registerUser.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar usuario');
        };
        return res.status(200).json();


    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const detalharUsuario = async (req, res) => {
    const { usuario: usuarioReq } = req;

    try {
        const usuario = await conexao.query('select * from usuarios where id = $1', [usuarioReq.id]);
        delete usuario.rows[0].senha;
        return res.status(200).json(usuario.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atulizarUsuario = async (req, res) => {
    const { usuario: usuarioReq } = req;
    const { nome, email, senha } = req.body;

    try {

        const usuarioAtualizado = await conexao.query('update usuarios set nome = $1, nome_loja=$2,email=$3,senha =$4 where id =$5', [nome, nome_loja, email, senha, usuarioReq.id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Não foi possivel atualização de usuario' })
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


module.exports = { cadastrarUsuario, detalharUsuario, atulizarUsuario };

