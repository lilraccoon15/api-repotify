const User = require("./user.model");
const jwt = require('jsonwebtoken');

module.exports = {
  addReco: async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const email = decoded.email;
    let user = await User.findOne({ email:email })
    const idx = user.recommendations.findIndex((recommendation) => JSON.stringify(recommendation) === JSON.stringify(req.body.recommendation));
    if(idx >=0){
      return res.status(400).send({ok: false, msg: 'recommendation already add'})
    }
    user.recommendations.push(req.body.recommendation);
    try { 
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
    } catch {
      return res.status(500).send({ok: false, msg: 'Server error, please contact the admin'})
    }
    res.status(200).send({ok: true, msg: 'recommendation added'});
  },

  eraseReco: async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const email = decoded.email;
    let user = await User.findOne({ email:email });
    const idx = user.recommendations.findIndex((recommendation) => recommendation === req.body.recommendation);
    if (idx < 0){
      return res.status(403).send({ok: false, msg: "Bad request"});
    }
    user.recommendations.splice(idx, 1);
    if (user.recommendations.includes(req.body.recommendation) === false) {
      await User.findOneAndUpdate({email: email}, {$set: user}, { new: true });
      return res.status(200).send({ok: true, msg: 'recommendation deleted'});
    }
    res.status(500).send({ok: false, msg: 'Server error, please contact the admin'});
  }
}