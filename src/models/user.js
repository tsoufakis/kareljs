const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Progress = new Schema({
    levelId: String,
    code: String,
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, index: { unique: true } },
    password: String,
    admin: Boolean,
    levels: [Progress]
}));
