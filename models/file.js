var mongoose = require('mongoose');

var FileSchema = mongoose.Schema({
    name: { type: String },
    type: { type: String },
    fileId: { type: String }
    // fileId: { type: mongoose.Schema.Types.ObjectId }
});

var File = module.exports = mongoose.model('File', FileSchema);

// --------------- FUNCTIONS -------------------

module.exports.createFile = function (newFile, callback) {
    let file = new File(newFile);
    file.save(callback);
}