var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/myChatLogin', function(req, res, next) {
  res.render('myChat.login.pug', { title: 'myChat' });
});

router.get('/myChat', function(req, res, next) {
  res.render('myChat', { title: 'myChat' });
});

module.exports = router;
