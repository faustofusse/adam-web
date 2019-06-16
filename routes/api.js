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
router.post('/usuario', (req, res) => {
    var nombre = req.body.name,
        apellido = req.body.lastName,
        correo = req.body.email,
        password = req.body.password;
    req.checkBody('email', 'El correo electronico no es valido').isEmail();
    req.checkBody('repeatPassword', 'Las contrasenas no coinciden').equals(password);
    if (req.validationErrors()) {
        res.send({ errors: errors });
        next();
    }
    var newUser = new User({ nombre, apellido, correo, password });
    User.findOne({ correo: correo }, function (err, user) {
        if (err) throw err;
        if (user && user.password) {
            res.send({ errors: ['El usuario ya existe'] });
            next();
        }
        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log('Usuario creado: ' + user);
            res.send({ msj: 'Usuario creado correctamente' });
        });
    });
});

// Actualizar password de un usuario
router.put('/password', (req, res) => {

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