var mongoose = require('mongoose');
var express = require('express');
var jwt = require('jsonwebtoken');

var config = require('./config');
var User = require('./models/user');

var api = express.Router();

mongoose.connect(config.database);

/* POST /authenticate
 *
 * GET  /user
 * POST /users
 * GET  /user/progress
 * GET  /user/progress/:level_id
 * PUT  /user/progress/:level_id
 * GET  /user/code/:level_id
 * PUT  /user/code/:level_id
 */


api.get('/', (req, res) => res.json({ msg: 'api' }));


api.post('/authenticate', authenticate);
api.post('/users', createUser);

api.use('/user', tokenValidationMiddleware);
api.use('/user', userLookupMiddleware);

api.route('/user').get(getUser).delete(deleteUser);

api.route('/user/code/:level_id').get(getCode).put(putCode);

api.route('/user/progress').get(getProgress);
api.route('/user/progress/:level_id').get(getProgress).put(putProgress);

api.route('/user/levels').get(listLevels);


function createUser(req, res) {
    user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save((err) => {
        const token = makeAuthToken(user);
        if (err) {
            res.status(403);
            res.json({ msg: 'Could not create user' });
        } else {
            res.json({ success: true, token: token });
        }
    });
}

function getUser(req, res) {
    const output = { email: req.user.email };
    res.json({ success: true, user: output });
}

function deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.decoded.id }, (err) => {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true });
        }
    });
}

function makeAuthToken(user) {
    const payload = { id: user._id, email: user.email, admin: user.admin };
    return jwt.sign(payload, config.secret, {
        expiresIn: '1440m'
    });
}

function authenticate(req, res) {
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
}

function tokenValidationMiddleware(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({ success: false, msg: 'failed to auth' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            msg: 'no token provided'
        });
    }
}

function userLookupMiddleware(req, res, next) {
    User.findById(req.decoded.id, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'could not find user' });
        } else {
            req.user = user;
            next();
        }
    });
}

function getCode(req, res) {
    const level = req.user.levels.find((el) => el.levelId == req.params.level_id);
    if (level) {
        res.json({ success: true, code: level.code });
    } else {
        res.json({ success: false, msg: 'no saved code' });
    }
}

function putCode(req, res) {
    const user = req.user;
    const level = user.levels.find((el) => el.levelId === req.params.level_id);
    if (level) {
        level.code = req.body.code
    } else {
        user.levels.push({ levelId: req.params.level_id, code: req.body.code });
    }
    user.save((err) => {
        if (err) {
            res.sendStatus(403);
            res.json({ msg: 'could not save code' });
        } else {
            res.json({ success: true });
        }
    });
}

function getProgress(req, res) {
    const user = req.user;
    const levelId = req.params.level_id;
    var progress;
    if (levelId) {
        progress = user.levels.find((x) => x.levelId === levelId) || {levelId: levelId, completed: false};
    } else {
        progress = user.levels.map((x) => ({ levelId: x.levelId, completed: x.completed }))
    }
    res.json({ progress: progress });
}

function putProgress(req, res) {
    const user = req.user;
    const levelId = req.params.level_id;
    const completed = req.body.completed;
    const level = user.levels.find((x) => x.levelId === levelId);

    if (level) {
        level.completed = req.body.completed;
    } else {
        user.levels.push({ levelId: levelId, completed: completed });
    }
    res.json({});
}

function listLevels(req, res) {
    res.json({ levels: req.user.levels });
}

module.exports = api;
