const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const uri = 'mongodb+srv://fausto:1234@adamcluster-0z0u0.mongodb.net/adam?retryWrites=true&w=majority';
//var uri = "mongodb://localhost:27017/adam";
const filesCollection = 'uploads';

let gfs;

let startDB = async () => {
    await ngoose.connect(uri, { useNewUrlParser: true }, function (err) {
        if (err) throw err;
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        gfs.collection(filesCollection);
        
        console.log('Connected to MongoDB.');
    });
}

startDB();

gfs.files.find().toArray((err, files) => {
    if (err) throw err;
    if (!files || files.length === 0)
        console.log('No hay archivos guardados');
    else
        console.log(files);
});

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: filesCollection
                };
                resolve(fileInfo);
            });
        });
    }
});

module.exports.storage = storage;
module.exports.connection = mongoose.connection;
module.exports.gfs = gfs;