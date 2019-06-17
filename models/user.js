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

module.exports.updateUser = function (id, user, callback) {
    if (user.password)
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                console.log('se actualiza la contra bolu');
                user.password = hash;
                User.findOneAndUpdate({ _id: id }, user, callback);
            });
        });
    else
        User.findOneAndUpdate({ _id: id }, user, callback);
}

module.exports.getUserByEmail = function (email, callback) {
    var query = { email };
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

// module.exports.updatePassword = (id, password, callback) => {
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(password, salt, (err, hash) => {
//             User.findOneAndUpdate({ _id: id }, { password: hash }, callback);
//         });
//     });
// }

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};