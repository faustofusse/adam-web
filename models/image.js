var mongoose = require('mongoose');

var ImageSchema = mongoose.Schema({
    description: { type: String },
    keywords: [{ type: String }],
    type: { type: String },
    fileId: { type: String }
    // fileId: { type: mongoose.Schema.Types.ObjectId }
});

var Image = module.exports = mongoose.model('Image', ImageSchema);

// --------------- FUNCTIONS -------------------

module.exports.createImage = function (newImg, callback) {
    let image = new Image(newImg);
    image.save(callback);
}