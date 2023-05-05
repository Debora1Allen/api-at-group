require('dotenv').config();
const express = require('express');
const servidor = require('./servidor');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(servidor);

app.listen(process.env.PORT || 8000);