'use strict'

const tape = require('tape');
const request = require('supertest');
const app = require('../src/server.js');

tape('hello world', (t) => {
    request(app)
        .get('/api')
        .end((err, res) => {
            t.same(res.body, {msg: 'api'});
            t.end();
        });
});
