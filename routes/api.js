const express = require('express');
const router = express.Router();

const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const dbConfig = require('../config/database');
const User = require('../models/user');
const Video = require('../models/video');
const Image = require('../models/image');
const File = require('../models/file');

const Mail = require('../utils/mail');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

// ------- MULTER ---------

const filesCollection = 'uploads';
const storage = new GridFsStorage({
    url: dbConfig.uri,
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
const upload = multer({ storage });

// -------- ROUTES ---------

// Listado de imagenes
router.get('/imagenes', (req, res) => {
    dbConfig.mongoose.connection.db.collection(filesCollection + '.files')
        .find().toArray((err, files) => {
            if (err) throw err;
            if (!files || files.length === 0)
                return res.send({ msg: 'No hay imagenes guardadas.' });
            let imagenes = files.filter(val => (val.contentType === 'image/png' || val.contentType === 'image/jpg' || val.contentType === 'image/jpeg'))
            if (imagenes.length === 0)
                return res.send({ msg: 'No hay imagenes guardadas.' });
            res.send({ imagenes });
        });
});

// Archivo de texto
router.get('/documentos/:id', (req, res) => {
    const _id = new ObjectID(req.params.id);
    const gfs = new mongodb.GridFSBucket(dbConfig.mongoose.connection.db, { bucketName: 'uploads' });
    dbConfig.mongoose.connection.db.collection(filesCollection + '.files').findOne({ _id }, (err, video) => {
        if (err) throw err;
        if (!video || video.contentType !== 'text/plain')
            return res.send({ msg: 'No existe un archivo de texto plano con ese id.' });
        // Stremear el texto:
        const downloadStream = gfs.openDownloadStream(_id);
        downloadStream.pipe(res);
    });
});

// Mostrar video (readStream de GridFS)
router.get('/videos/:id', (req, res) => {
    const _id = new ObjectID(req.params.id);
    const gfs = new mongodb.GridFSBucket(dbConfig.mongoose.connection.db, { bucketName: 'uploads' });
    dbConfig.mongoose.connection.db.collection(filesCollection + '.files').findOne({ _id }, (err, video) => {
        if (err) throw err;
        if (!video || video.contentType !== 'video/mp4')
            return res.send({ msg: 'No existe un video con ese id.' });
        // Stremear la imagen:
        const downloadStream = gfs.openDownloadStream(_id);
        downloadStream.pipe(res);
    });
});

// Mostrar imagen (readStream de GridFS)
router.get('/imagenes/:id', (req, res) => {
    const _id = new ObjectID(req.params.id);
    const gfs = new mongodb.GridFSBucket(dbConfig.mongoose.connection.db, { bucketName: 'uploads' });
    dbConfig.mongoose.connection.db.collection(filesCollection + '.files').findOne({ _id }, (err, imagen) => {
        if (err) throw err;
        if (!imagen || (imagen.contentType !== 'image/jpg' && imagen.contentType !== 'image/jpeg' && imagen.contentType !== 'image/png'))
            return res.send({ msg: 'No existe una imagen con ese id.' });
        // Stremear la imagen:
        const downloadStream = gfs.openDownloadStream(_id);
        downloadStream.pipe(res);
    });
});

// Subir archivo  
router.post('/archivos', upload.single('file'), (req, res) => {
    let description = req.body.description,
        keywords = req.body.keywords,
        file = req.file,
        fileId = file.id,
        name = file.originalname,
        type = file.contentType;
    let callback = (err, file) => {
        if (err) throw err;
        res.send({ msg: 'Archivo subido correctamente.' });
        console.log(file);
    }
    if (type === 'image/png' || type === 'image/jpg' || type === 'image/jpeg')
        Image.createImage({ description, keywords, fileId, type }, callback);
    else if (type === 'video/mp4')
        Video.createVideo({ description, keywords, fileId, type }, callback);
    else
        File.createFile({ fileId, name, type }, callback);
});

// Listado de archivos
router.get('/archivos', (req, res) => {
    dbConfig.mongoose.connection.db.collection(filesCollection + '.files').find().toArray((err, files) => {
        if (err) throw err;
        if (!files || files.length === 0)
            return res.send({ msg: 'No hay archivos guardados.' });
        else
            return res.send({ files });
    });
});

// Listado de usuarios
router.get('/usuarios', (req, res) => {
    User.find((err, usuarios) => {
        if (err) throw err;
        res.send({ usuarios });
    });
});

// Registrar un usuario
router.post('/usuarios', (req, res, next) => {
    var name = req.body.name,
        lastName = req.body.lastName,
        email = req.body.email,
        password = req.body.password;
    // req.checkBody(['name', 'lastName', 'email', 'password', 'repeatPassword'], 'Completa todos los campos').notEmpty();
    req.checkBody('email', 'El correo electronico no es valido').isEmail();
    if (password) req.checkBody('repeatPassword', 'Las contrasenas no coinciden').equals(password);
    else password = crearPassword(10);
    console.log(password);
    if (req.validationErrors()) {
        res.send({ errors: req.validationErrors() });
    } else {
        var newUser = new User({ name, lastName, email, password });
        User.findOne({ email: email }, function (err, user) {
            if (err) throw err;
            if (user) {
                res.send({ errors: [{ param: 'email', msg: 'El usuario ya existe' }] });
            } else {
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    console.log('Usuario creado: ' + user);
                    res.send({ msg: 'Usuario creado correctamente' });
                    Mail.sendToNuevoUsuario(newUser, password, (err, info) => {
                        if (err) console.log(err)
                        else console.log('Mail enviado a ' + newUser.email);
                    });
                });
            }
        });
    }
});

// Editar un usuario
router.put('/usuarios', (req, res) => {
    let user = req.body;
    let id = req.user ? req.user._id : user._id;
    if (req.body.email) req.checkBody('email', 'El correo electronico no es valido').isEmail();
    if (user.password !== undefined || user.repeatPassword !== undefined)
        req.checkBody('repeatPassword', 'Las contrasenas no coinciden').equals(user.password);
    else
        delete user.password;
    // delete user.repeatPassword;
    console.log(user);
    if (req.validationErrors())
        res.send({ errors: req.validationErrors() });
    else
        User.updateUser(id, user, (err, user) => {
            if (err) throw err;
            res.send({ msg: 'Usuario actualizado correctamente' });
        });
});

// Crear password aleatoria
function crearPassword(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
module.exports.upload = upload;