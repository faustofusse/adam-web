var mongoose = require('mongoose');

var VideoSchema = mongoose.Schema({
    description: { type: String },
    keywords: [{ type: String }],
    fileId: { type: String }
    // fileId: { type: mongoose.Schema.Types.ObjectId }
});

var Video = module.exports = mongoose.model('Video', VideoSchema);

// --------------- FUNCTIONS -------------------

module.exports.createVideo = function (newVid, callback) {
    let video = new Video(newVid);
    video.save(callback);
}