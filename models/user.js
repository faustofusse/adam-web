var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    name: { type: String },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
});

var User = module.exports = mongoose.model('User', UserSchema);

// --------------- FUNCTIONS -------------------

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.addPassword = function (newUser, googleUser, callback) {
    googleUser.name = newUser.name;
    googleUser.lastName = newUser.lastName;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            googleUser.password = hash;
            googleUser.save(callback);
        });
    });
};

module.exports.getUserByEmail = function (correo, callback){
    var query = {correo: correo};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) throw err;
        callback(null, isMatch);
    });
};