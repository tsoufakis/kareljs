var mongoose = require('mongoose');
var express = require('express');
var jwt = require('jsonwebtoken');

var config = require('./config');
var User = require('./models/user');

var api = express.Router();
mongoose.connect(config.database);

// Public routes
api.get('/', (req, res) => {
    res.json({ msg: 'api' });
});

api.get('/setup', (req, res) => {
    const chris = new User({
        fistName: 'Chris',
        email: 'tsoufakis@gmail.com',
        password: 'password',
        admin: true
    });
    chris.save((err) => {
        if (err) { 
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true });
        }
    });
});

api.route('/user')
    .post(createUser)
    .get(getUser)
    .delete(dropUser);

function createUser(req, res) {
    user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save((err) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true });
        }
    });
}

function getUser(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            output = { email: user.email };
            res.json({ success: true, user: output });
        } else {
            res.json({ success: false }, msg: 'user not found');
        }
    });
}

function dropUser(req, res) {
    User.findOneAndRemove({ email: req.body.email }, (err) => {
        if (err) {
            res.json({ success: false }, msg: err);
        } else {
            res.json({ success: true });
        }
    });
}

api.post('/authenticate', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (user) {
            if (user.password === req.body.password) {
                const payload = { id: user._id, email: user.email, admin: user.admin };
                const token = jwt.sign(payload, config.secret, {
                    expiresIn: '1440m'
                });
                res.json({
                    success: true,
                    msg: 'enjoy',
                    token: token
                });
            } else {
                res.json({ success: false, msg: 'wrong password' });
            }
        } else {
            res.json({ success: false, msg: 'user not found' });
        }
    })
});

// Auth routes

api.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({ success: false, msg: 'failed to auth' });
            } else {
                req.decoded = decoded;
                console.log(decoded);
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'no token provided'
        });
    }
});

api.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        res.json(users);
    });
});

function getCode(req, res) {
    User.findById(req.decoded.id, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'could not find user' });
        } else {
            const level = user.savedCode.find((el) => {
                return el.level_id == req.params.level_id;
            });
            if (level) {
                res.json({ success: true, code: level.code });
            } else {
                res.json({ success: false, msg: 'no saved code' });
            }
        }
    });
}

api.route('/code/:level_id')
    .get(getCode)

    .put((req, res) => {
        User.findById(req.decoded.id, (err, user) => {
            if (err) {
                res.json({ success: false, msg: 'could not find user' });
            } else {
                const level = user.savedCode.find((el) => el.level_id == req.params.level_id);
                if (level) {
                    level.code = req.body.code
                } else {
                    user.savedCode.push({ level_id: req.params.level_id, code: req.body.code });
                }
                user.save((err) => {
                    if (err) {
                        res.json({ success: false, msg: 'could not save code' });
                    } else {
                        res.json({ success: true });
                    }
                });
            }
        });
    });

/* POST /authenticate
 *
 * GET /progress/
 * GET /progress/:level_id
 * PUT /progress/:level_id
 * DELETE /progress/:level_id
 *
 * GET /code/:level_id
 * PUT /code/:level_id
 */

module.exports = api;
