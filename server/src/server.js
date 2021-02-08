const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const process = require('process');
const mongoose = require('mongoose');

const config = require('./config');
const api = require('./api');

let APP_SINGLETON;
let SERVER;

process.on('SIGTERM', function () {
    console.log('exiting');
    process.exit();
});


function connectToMongo(uri, timeout) {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: timeout,
        serverSelectionTimeoutMS: timeout
    }).catch(error => {
            console.log('exiting, could not establish initial connection to mongo', error);
            process.exit(1);
    });

    mongoose.connection.on('connected', () => {
        console.log('mongo connected');
    });
}

function createApp(options = {}) {
    const port = options.port || process.env.PORT || 8081;
    const mongodb_uri = options.mongodb_uri || process.env.MONGODB_URI || config.database;
    // defaults to mongoose default
    const mongoConnTimeoutMS = options.mongoConnTimeoutMS || 30000;
    console.log(options, mongoConnTimeoutMS);

    if (APP_SINGLETON) {
        return APP_SINGLETON;
    } else {
        const app = express();
        app.set('port', port);
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(morgan('dev'));
        app.use('/api', api);

        connectToMongo(mongodb_uri, mongoConnTimeoutMS);

        const server = app.listen(app.get('port'), () => {
            console.log('Server started on ' + app.get('port'));
        });

        APP_SINGLETON = app;
        SERVER = server;

        return app;
    }
}

function destroyApp() {
    if (APP_SINGLETON) {
        mongoose.connection.close();
        SERVER.close(() => {
            console.log('stopping app');
        });
        APP_SINGLETON = null;
        SERVER = null;
    }
}

function main() {
    console.log('in main')
    createApp();
}

module.exports = {
    createApp,
    destroyApp,
    process,
};

if (require.main === module) {
    main();
}