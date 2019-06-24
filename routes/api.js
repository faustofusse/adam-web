var express = require('express');
var router = express.Router();
var Mail = require('../utils/mail');
var User = require('../models/user');
var db = require('../config/database');
var gfs = db.gfs;

// ------- MULTER ---------

var multer = require('multer');
var storage = db.storage;
var upload = multer({ storage });

// -------- ROUTES ---------

// Subir archivo
router.post('/archivo', upload.single('file'), (req, res) => {
    let data = {
        description: req.body.description,
        keywords: req.body.keywords,
        file: req.file
    }
    console.log(req.body);
    res.send(data);
});

// Listado de archivos
router.get('/archivos', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if (err) throw err;
        if (!files || files.length === 0)
            return res.send({ msg: 'No hay archivos guardados.' });
        else
            return res.send({ files });
    });
});

// Subir imagen
router.post('/imagen', upload.single('image'), (req, res) => {
    console.log(req.body.description);
    console.log(req.body.keywords);
    console.log(req.file);
    res.send({ msg: 'OK' });
});

// Listado de usuarios
router.get('/usuarios', (req, res) => {
    User.find((err, usuarios) => {
        if (err) throw err;
        res.send({ usuarios });
    });
});

// Registrar un usuario
router.post('/usuario', (req, res, next) => {
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

router.put('/usuario', (req, res) => {
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