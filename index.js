require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./connect')();
const { login, create, update, erase } = require('./userController');
const { add } = require('./artistsController');
const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', login);
app.post('/users', create);
app.put('/users', update);
app.delete('/users', erase);

app.post('/artists', add)
app.listen(8000, () => console.log("Listening on port 8000"));