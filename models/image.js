var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
    name: { type: String },
});

var Image = module.exports = mongoose.model('Image', ImageSchema);

// --------------- FUNCTIONS -------------------

module.exports.createImage = function (newImg, callback) {
    
}