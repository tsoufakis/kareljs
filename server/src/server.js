var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var config = require('./config');
var api = require('./api');
var staticDir = '../../client/public';
var app = express();
app.set('port', process.env.PORT || 8081);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, staticDir)));
app.use('/api', api);
app.get('/app*', (req, res) => {
    res.sendFile(path.resolve(__dirname, staticDir, 'index.html'))
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, staticDir, 'index.html'))
})

app.listen(app.get('port'), function() {
    console.log('Server started at hello: http://localhost:' + app.get('port') + '/');
});

module.exports = app;
