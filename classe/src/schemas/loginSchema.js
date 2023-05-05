const config = require('./config');

const loginSchema = yup.object().shape({
    email: config.string().email().required(),
    senha: config.string().required()
});

module.exports = loginSchema;