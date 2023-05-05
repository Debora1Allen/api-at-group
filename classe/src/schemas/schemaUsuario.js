const yup = require('./config');

const schemaUsuario = yup.object().shape({
    nome: yup.string().required("O campo nome é obrigatório"),
    email: yup.string().email().required("O campo email é obrigatório"),
    senha: yup.string().required("O campo senha é obrigatório").min(8)
});

module.exports = schemaUsuario;