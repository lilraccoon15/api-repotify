const User = require("./user.model");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

module.exports = {
  login: async (req, res) => {
    const email  = req.body.email;
    const user = await User.findOne({ email:email });

    if(user){
      const token = jwt.sign(_.pick(user, 'email'), process.env.PRIVATE_KEY);
      return res.status(200).send({ok: true, msg: 'Connected', data: token});
    }
    res.status(404).send({
        ok: false,
        msg: 'User was not found with the given email',
    });
  },

  create: async (req, res) => {
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
        picture:req.body.picture,
        artists: [],
        genres: []
    }

    const user = new User(userData);
  
    try {
      await user.save();
      res.status(201).send({ ok: true, msg: user });
    } catch (err) {
        console.error(err.message);
      res.status(500).send({ ok: false, msg: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string(),
            picture: Joi.string(),
        })

        const {error} = schema.validate(req.body);

        if(error) {
            return res.status(400).send({
                ok:false,
                msg: error.details[0].message,
            });
        };
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const email = decoded.email;

        let user = await User.findOne({email:email});

        if(!user)
            return res.status(404).send({
                ok:false,
                msg: "user was not found with the given email"
        });

        const updatedUser = await User.findOneAndUpdate({email: email}, {$set: req.body}, { new: true });

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
  },

  erase: async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const email = decoded.email;

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

    
  }
}