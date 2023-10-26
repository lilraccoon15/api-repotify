const User = require("./user.model");
const jwt = require('jsonwebtoken');

module.exports = {
  addGenre: async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const email = decoded.email;
    let user = await User.findOne({ email:email })
    user.genres.push(req.body.genre);
    if (user.genres.includes(req.body.genre)) {
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
      return res.status(200).send({ok: true, msg: 'genre added'});
    }
    
    res.status(500).send({ok: false, msg: 'Server error, please contact the admin'})
  },

  eraseGenre: async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const email = decoded.email;
    let user = await User.findOne({ email:email });
    const idx = user.genres.findIndex((genre) => genre === req.body.genre);
    if (idx < 0){
      return res.status(403).send({ok: false, msg: "Bad request"});
    }
    user.genres.splice(idx, 1);
    if (user.genres.includes(req.body.genre) === false) {
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
      return res.status(200).send({ok: true, msg: 'genre deleted'});
    }
    res.status(500).send({ok: false, msg: 'Server error, please contact the admin'});
  }
}