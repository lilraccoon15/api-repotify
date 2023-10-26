const User = require("./user.model");

module.exports = {
  add: async (req, res) => {
    const email  = req.body.email;
    let user = await User.findOne({ email:email })
    user.artists.push(req.body.artist);
    if (user.artists.includes(req.body.artist)) {
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
      return res.status(200).send({ok: true, msg: 'Artist added'});
    }
    
    res.status(500).send({ok: false, msg: 'Server error, please contact the admin'})
  },

  erase: async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ email:email });
    let idx = user.artists.findIndex(req.body.artist);
    if (idx < 0){
      return res.status(403).send({ok: false, msg: "Bad request"});
    }
    user.artists.slice(idx, 1);
  }
}