const User = require("./user.model");
const jwt = require('jsonwebtoken');

module.exports = {
  add: async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const email = decoded.email;
    let user = await User.findOne({ email:email })
    user.artists.push(req.body.artist);
    if (user.artists.includes(req.body.artist)) {
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
      return res.status(200).send({ok: true, msg: 'Artist added'});
    }
    
    res.status(500).send({ok: false, msg: 'Server error, please contact the admin'})
  },

  eraseArtist: async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const email = decoded.email;
    let user = await User.findOne({ email:email });
    const idx = user.artists.findIndex((artist) => JSON.stringify(artist) === JSON.stringify(req.body.artist));
    if (idx < 0){
      return res.status(400).send({ok: false, msg: "Bad request"});
    }
    user.artists.splice(idx, 1);
    if (user.artists.includes(req.body.artist) === false) {
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
      return res.status(200).send({ok: true, msg: 'Artist deleted'});
    }
    res.status(500).send({ok: false, msg: 'Server error, please contact the admin'});
  }
}