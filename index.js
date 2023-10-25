const express = require('express');
const app = express();
app.use(express.json());

const users = [];

// Récupère les utilisateurs
app.get('/api/users', (req, res) => {
    res.send(users);
});

// Récupérer 1 utilisateur
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    const idx = users.findIndex(user => user.id === id);
    
})

// Crée un nouvel utilisateur
app.post('/api/users', (req, res) => {
    const newUser = req.body;

    // if (!newUser || !newUser.name || !newUser.email) {
    //     return res.status(400).send({ message: 'Les champs name et email sont requis.' });
    // }

    users.push(newUser);

    res.send(users);
});