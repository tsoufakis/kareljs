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

const time = new Date().getTime();
const email = `testuser_${time}@gmail.com`;
const password = 'password';
const code1 = 'move();';
const code2 = 'move(); move();';
const code3 = 'move(); move(); move();';
let token;

tape('create user', (t) => {
    const postData = { email: email, password: 'password' };

    request(app)
        .post('/api/users')
        .send(postData)
        .expect(200)
        .end((err, res) => {
            t.ok(res.body.token, 'received token');
            t.end();
        });
});

tape('unique users', (t) => {
    const postData = { email: email, password: 'password' };

    request(app)
        .post('/api/users')
        .send(postData)
        .expect(403, t.end);
});

tape('authentication', (t) => {
    const postData = { email: email, password: 'password' };

    request(app).post('/api/authenticate').send(postData).end((err, res) => {
        t.ok(res.body.success, 'authenticated successfully');
        t.ok(res.body.token, 'received token');
        token = res.body.token;
        t.end();
    });
});

tape('reflection', (t) => {
    request(app).get('/api/user').query({token: token}).end((err, res) => {
        t.same(res.body, {success: true, user: {email: email}});
        t.end();
    });
});

function testSaveCode(levelId, code, testName) {
    tape(testName, (t) => {
        const postData = { token: token, code: code };
        request(app)
            .put(`/api/user/code/${levelId}`)
            .send(postData)
            .expect(200, t.end);
    });
}

function testFetchCode(levelId, expectedCode, testName) {
    tape(testName, (t) => {
        request(app)
            .get(`/api/user/code/${levelId}`)
            .query({token: token})
            .expect(200)
            .end((err, res) => {
                t.same(res.body.code, expectedCode);
                t.end();
            });
    });
}

testSaveCode(1, code1, 'save first code');
testFetchCode(1, code1, 'fetch first code');
testSaveCode(1, code2, 'update code');
testFetchCode(1, code2, 'fetch updated code');
testSaveCode(3, code3, 'save code new level');
testFetchCode(3, code3, 'fetch code new level');


tape('save progress', (t) => {
    const data = {
        token: token,
        completed: true
    };
    request(app)
        .put('/api/user/progress/1')
        .send(data)
        .expect(200, t.end);;
});


function testGetProgress(levelId, expectedValue, testName) {
    tape(testName, (t) => {
        request(app)
            .get(`/api/user/progress/${levelId}`)
            .query({token: token})
            .expect(200)
            .end((err, res) => {
                t.same(res.body.progress.completed, expectedValue);
                t.end();
            });
    });
}

testGetProgress(1, false, 'progress level1');

tape('list all progress', (t) => {
    request(app)
        .get('/api/user/progress')
        .query({token: token})
        .expect(200)
        .end((err, res) => {
            const levelIds = res.body.progress.map((el) => el.levelId);
            t.same(levelIds, ['1', '3']);
            t.end()
        });
});

tape('delete user', (t) => {
    request(app).delete('/api/user').query({token: token}).end((err, res) => {
        t.ok(res.body.success, 'delete successful'); 
        t.end();
    });
});

tape('confirm deleted', (t) => {
    const postData = { email: email, password: 'password' };
    request(app).post('/api/authenticate').send(postData).end((err, res) => {
        t.notOk(res.body.success, 'authentication fails post delete');
        t.end();
    });
});
