var express = require('express');
var router = express.Router();
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const User = require('../models/users')
const { checkBody } = require('../modules/checkBody');

/* GET users listing. */
router.post('/signup', function(req, res, next) {
  if (!checkBody(req.body, ['firstname', 'username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({username: req.body.username}).then(data => {
    if(data === null){
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
      })

      newUser.save().then(newData => {
        res.json({ result: true, token: newData.token, firstname: newData.firstname, username: newData.username, });
      });
    } else {
      res.json({result: false, error: 'username already took'})
    }
  })
});

router.post('/signin', (req,res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  
  User.findOne({username: req.body.username}).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username, firstname: data.firstname });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  })
})

module.exports = router;
