require('dotenv').config();
const express = require('express');
require('./connect')();
const { login, create, update, erase } = require('./userController');
const { add } = require('./artistsController');
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permet à tous les domaines d'accéder à votre API
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // Les méthodes HTTP autorisées
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Les en-têtes autorisés
    next();
});
app.use(express.json());

app.post('/login', login);
app.post('/users', create);
app.put('/users', update);
app.delete('/users', erase);

app.post('/artists', add)
app.listen(8000, () => console.log("Listening on port 8000"));