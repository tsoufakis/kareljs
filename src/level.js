var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LevelSchema = new Schema({
    name: String
});
module.exports = mongoose.model('Level', LevelSchema)
