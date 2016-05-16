const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, index: { unique: true } },
    password: String,
    admin: Boolean,
    completedLevels: [{ level_id: Number, date: Date }],
    savedCode: [{ level_id: Number, code: String }]
}));
