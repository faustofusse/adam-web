var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
    req.checkBody('email', 'El correo electronico no es valido').isEmail();
    req.checkBody('repeatPassword', 'Las contrasenas no coinciden').equals(password);
    if (req.validationErrors()) {
        res.send({ errors: req.validationErrors() });
    } else {
        var newUser = new User({ name, lastName, email, password });
        User.findOne({ email: email }, function (err, user) {
            if (err) throw err;
            if (user && user.password) {
                res.send({ errors: [{ param: 'email', msg: 'El usuario ya existe' }] });
            } else {
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    console.log('Usuario creado: ' + user);
                    res.send({ msg: 'Usuario creado correctamente' });
                });
            }
        });
    }
});

// Actualizar password de un usuario
router.put('/password', (req, res) => {
    let password = req.body.password;
    req.checkBody('repeatPassword', 'Las contrasenas no coinciden').equals(password);
    if (req.validationErrors()) {
        res.send({ errors: req.validationErrors() });
    } else {
        User.updatePassword(req.body._id, password, (err, user) => {
            res.send({ msg: 'Contrasena actualizada' });
        });
    }
});

// Actualizar el contenido
router.post('/contenido', (req, res) => {

});

// Obtener el contenido
router.get('/contenido', (req, res) => {

});

// Subir imagen
router.post('/imagen', (req, res) => {

});

// Subir video
router.post('/video', (req, res) => {

});

module.exports = router;