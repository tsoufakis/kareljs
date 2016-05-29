var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var config = require('./config');
var api = require('./api');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/api', api);
app.get('/', (req, res) => {
    res.json({ msg: 'hi' });
});

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

module.exports = app;
