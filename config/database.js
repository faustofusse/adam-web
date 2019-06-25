const mongoose = require('mongoose');

const uri = 'mongodb+srv://fausto:1234@adamcluster-0z0u0.mongodb.net/adam?retryWrites=true&w=majority';
//var uri = "mongodb://localhost:27017/adam";

mongoose.connect(uri, { useNewUrlParser: true }, function (err) {
    if (err) throw err;
    console.log('Connected to MongoDB.');
});

module.exports.uri = uri;
module.exports.mongoose = mongoose;