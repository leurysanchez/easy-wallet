var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/account', function(req, res) {
  res.json({message:'Welcome To Wallet API'});
});

module.exports = router;