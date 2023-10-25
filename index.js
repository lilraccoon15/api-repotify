require('dotenv').config();
const express = require('express');
const Joi = require('joi');

const User = require('./user.model')
const connect = require('./connect')

connect();

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permet à tous les domaines d'accéder à votre API
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // Les méthodes HTTP autorisées
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Les en-têtes autorisés
    next();
});

app.use(express.json());

// Récupère les utilisateurs
// app.get('/users', (req, res) => {
//     res.send(users);
// });
const findUser = async (email) => {
    const user = await User.findOne({
        email:email
    });

    return user;
}

// Récupérer 1 utilisateur
app.post('/login', async (req, res) => {
    const email  = req.body.email;

    // const idx = users.findIndex(user => user.email === email);

    const user = await findUser(email);

    if(user)
    return res.status(200).send({ok : true, msg: 'Connected'});

    res.status(404).send({
        ok: false,
        msg: 'User was not found with the given email',
    });
});



// Créer un utilisateur
app.post('/users', async (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      picture: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
  
    if (error) {
      return res.status(400).send({
        ok: false,
        msg: error.details[0].message,
      });
    }
  
    const userData = {
        name:req.body.name,
        email:req.body.email,
        picture:req.body.picture
    }

    const user = new User(userData);
  
    try {
      await user.save();
      res.status(201).send({ ok: true, msg: user });
    } catch (err) {
        console.error(err.message);
      res.status(500).send({ ok: false, msg: 'Internal server error' });
    }
  });


// mettre à jour 1 utilisateur
const updateUser = async (email, updatedData) => {
    const user = await User.findOneAndUpdate({email: email}, {$set: updatedData}, { new: true });

    return user;
}

app.put('/users/:email', async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            picture: Joi.string()
        })

        const {error} = schema.validate(req.body);

        if(error) {
            return res.status(400).send({
                ok:false,
                msg: error.details[0].message,
            });
        };

        const {email} = req.params;

        let user = await User.findOne({email:email});

        if(!user)
            return res.status(404).send({
                ok:false,
                msg: "user was not found with the given email"
        });

        const updatedUser = await updateUser(email, req.body);

        console.log("updatedUser:", updatedUser);

        if(updatedUser)
        {
            res.status(200).send({ok: true, data: updatedUser})
        }
        else
        {
            return res.status(401).send({
                ok:false,
                msg: "could not update user"
            });

        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, msg: 'Erreur interne du serveur' });
    }
})

app.delete('/users/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOneAndDelete({email:email});

        if(user) {
            return res.status(200).send({ok: true, msg: "Utilisateur supprimé avec succès"});
        }
        else {
            return res.status(404).send({ok: false, msg: "utilisateur inconnu"})
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ ok: false, msg: 'Erreur interne du serveur' });
    }

    
})

app.listen(8000, () => console.log("Listening on port 8000"));