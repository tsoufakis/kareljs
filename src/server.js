var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Level = require('./level.js')

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../public')));

/*
mongoose.connect('mongodb://localhost:27017/kareltest');

var router = express.Router();

router.use(function(req, res, next) {
    console.log('middle!');
    next();
});

router.get('/', function(req, res) {
    res.json({message: 'hello'});
});

app.use('/api', router);
*/



app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
