var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/contenido');
});

router.get('/login', (req, res, next) => {
  req.logout();
  res.render('login', { title: "ADAM - Iniciar Sesion"});
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/contenido', (req, res, next) => {
  res.render('contenido', { title: 'Contenido' });
});

router.get('/configuracion', (req, res, next) => {
  res.render('config', { title: 'Configuracion', registro: false });
});

router.get('/registro', (req, res, next) => {
  res.render('config', { title: 'Registro', registro: true });
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Has cerrado la sesion.');
  res.redirect('/login');
});

module.exports = router;
