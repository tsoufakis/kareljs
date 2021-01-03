const express = require('express');
const path = require('path');
const process = require('process');

const STATIC_DIR = './public';
const INDEX_HTML = path.resolve(__dirname, STATIC_DIR, 'index.html');

const app = express();

app.set('port', process.env.PORT || 8080);

app.use('/static', express.static(path.join(__dirname, STATIC_DIR)));

app.get('/', (req, res) => {
    res.sendFile(INDEX_HTML);
});

app.get('/app*', (req, res) => {
    res.sendFile(INDEX_HTML);
});

app.listen(app.get('port'), function() {
    console.log('Server started at hello: http://localhost:' + app.get('port') + '/');
});

process.on('SIGTERM', function () {
    console.log('exiting');
    process.exit();
});
