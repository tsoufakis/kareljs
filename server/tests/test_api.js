'use strict'

const tape = require('tape');
const request = require('supertest');
const server = require('../src/server.js');
const process = require('process');
const sinon = require('sinon');
let app = server.createApp();

class TestUser {
    constructor(name) {
        this.time = new Date().getTime();
        this.email = `${name}_${this.time}@gmail.com`;
        this.password = `${name}_password`;
        this.code1 = `/* ${name} */ move1();`;
        this.code2 = `/* ${name} */ move2();`;
        this.code3 = `/* ${name} */ move3();`;
    }

    testCreateUser() {
        tape('create user', (t) => {
            const postData = { email: this.email, password: this.password };

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
            const postData = { email: this.email, password: this.password };

            request(app)
                .post('/api/users')
                .send(postData)
                .expect(403, t.end);
        });

        tape('authentication', (t) => {
            const postData = { email: this.email, password: this.password };

            request(app).post('/api/authenticate').send(postData).end((err, res) => {
                t.ok(res.body.success, 'authenticated successfully');
                t.ok(res.body.token, 'received token');
                this.token = res.body.token;
                t.end();
            });
        });

        tape('auth failure', (t) => {
            const postData = { email: this.email, password: `${this.password}blah` };

            request(app)
                .post('/api/authenticate')
                .send(postData)
                .expect(401, t.end)
        });

        tape('token failure', (t) => {
            request(app)
                .get('/api/user')
                .query({token: `${this.token}nope`})
                .expect(401, t.end)
        });

        tape('reflection', (t) => {
            request(app).get('/api/user').query({token: this.token}).end((err, res) => {
                t.same(res.body, {success: true, user: {email: this.email}});
                t.end();
            });
        });

        tape('new token', (t) => {
            setTimeout(() => {
                request(app)
                    .get('/api/user/token')
                    .query({token: `${this.token}`})
                    .expect(200).end((err, res) => {
                        const newToken = res.body.token
                        t.ok(newToken, 'received new token')
                        t.notEqual(newToken, this.token, 'new token is different')
                        this.token = newToken
                        t.end()
                    })
            }, 1100)
        });
    }

    testSavingCodeAndProgress() {
        this._saveCode(1, this.code1, 'save first code');
        this._fetchCode(1, this.code1, 'fetch first code');
        this._saveCode(1, this.code2, 'update code');
        this._fetchCode(1, this.code2, 'fetch updated code');
        this._saveCode(3, this.code3, 'save code new level');
        this._fetchCode(3, this.code3, 'fetch code new level');

        this._getProgress(1, false, 'no progress on level1');
        this._saveProgress(1, 'save level 1 completed');
        this._getProgress(1, true, 'confirm save');

        this._getProgress(2, false, 'no progress on level2');
        this._saveProgress(2, 'save level 2 completed');
        this._getProgress(2, true, 'confirm save');

        tape('list all progress', (t) => {
            request(app)
                .get('/api/user/progress')
                .query({token: this.token})
                .expect(200)
                .end((err, res) => {
                    const levelIds = res.body.progress.map((el) => el.levelId);
                    t.same(levelIds, ['1', '3', '2']);
                    t.end()
                });
        });
    }

    testDeleteUser() {
        tape('delete user', (t) => {
            request(app).delete('/api/user').query({token: this.token}).end((err, res) => {
                t.ok(res.body.success, 'delete successful'); 
                t.end();
            });
        });

        tape('confirm deleted', (t) => {
            const postData = { email: this.email, password: this.password };
            request(app).post('/api/authenticate').send(postData).end((err, res) => {
                t.notOk(res.body.success, 'authentication fails post delete');
                t.end();
            });
        });
    }

    _getProgress(levelId, expectedValue, testName) {
        tape(testName, (t) => {
            request(app)
                .get(`/api/user/progress/${levelId}`)
                .query({token: this.token})
                .expect(200)
                .end((err, res) => {
                    t.same(res.body.progress.completed, expectedValue);
                    t.end();
                });
        });
    }

    _saveProgress(levelId, testName) {
        tape(testName, (t) => {
            const data = {
                token: this.token,
                completed: true
            };
            request(app)
                .put(`/api/user/progress/${levelId}`)
                .send(data)
                .expect(200, t.end);
        });
    }

    _saveCode(levelId, code, testName) {
        tape(testName, (t) => {
            const postData = { token: this.token, code: code };
            request(app)
                .put(`/api/user/code/${levelId}`)
                .send(postData)
                .expect(200, t.end);
        });
    }

    _fetchCode(levelId, expectedCode, testName) {
        tape(testName, (t) => {
            request(app)
                .get(`/api/user/code/${levelId}`)
                .query({token: this.token})
                .expect(200)
                .end((err, res) => {
                    t.same(res.body.code, expectedCode);
                    t.end();
                });
        });
    }
}

const bert = new TestUser('bert');
const ernie = new TestUser('ernie');
bert.testCreateUser();
ernie.testCreateUser();
bert.testSavingCodeAndProgress();
ernie.testSavingCodeAndProgress();
bert.testDeleteUser();
ernie.testDeleteUser();

tape('Process exits if mongo connection times out', (t) => {
    const stubExit = sinon.stub(process, 'exit').callsFake(() => {
        t.ok(stubExit.called, 'process.exit() was called');
        console.log('in stub');
        process.exit.restore();
        server.destroyApp(() => {
            t.end();
        });
    });
    server.destroyApp(() => {
        const app = server.createApp({
            mongodb_uri: 'mongodb://fakedb:27017/molemarch',
            mongoConnTimeoutMS: 1
        });
    });
});

tape.onFinish(() => {
    process.exit(0);
});
