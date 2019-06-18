var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Mail = require('../utils/mail');

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
                    /*Mail.sendToNuevoUsuario(newUser, password, (err, info)=>{
                        if (err) console.error(err);
                        console.log('Mail enviado');
                        console.log(info);
                    })*/
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

// Actualizar password de un usuario
// router.put('/password', (req, res) => {
//     let password = req.body.password;
//     req.checkBody('repeatPassword', 'Las contrasenas no coinciden').equals(password);
//     if (req.validationErrors()) {
//         res.send({ errors: req.validationErrors() });
//     } else {
//         User.updatePassword(req.body._id, password, (err, user) => {
//             res.send({ msg: 'Contrasena actualizada' });
//         });
//     }
// });

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

// Crear password aleatoria
function crearPassword(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = router;