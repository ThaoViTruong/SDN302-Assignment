var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const authMiddleware = require('../middleware/auth');

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'This is protected data',
    user: req.user
  });
});

module.exports = router;

module.exports = router;
