const config = require('./config');


const schemaUsuario = yup.object().shape({
    nome: config.string().required(),
    email: config.string().required(),
    senha: config.string().min(8).required(),
});

module.exports = schemaUsuario;