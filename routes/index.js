var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/contenido');
});

router.get('/login', (req, res, next) => {
  req.logout();
  res.render('login', { layout: 'login', title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/videos', ensureAuthenticated, (req, res) => {
  res.render('videos', { title: 'Videos' });
});

router.get('/imagenes', ensureAuthenticated, (req, res) => {
  res.render('imagenes', { title: 'Imagenes' });
});

router.get('/contenido', ensureAuthenticated, (req, res, next) => {
  res.render('contenido', { title: 'Contenido' });
});

router.get('/configuracion', ensureAuthenticated, (req, res, next) => {
  res.render('config', { title: 'Configuracion', config: true });
});

router.get('/registro', ensureAuthenticated, (req, res, next) => {
  res.render('config', { title: 'Registro', config: false });
});

router.get('/logout', (req, res) => {
  req.logout();
  // req.flash('success_msg', 'Has cerrado la sesion.');
  res.redirect('/login');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg', 'No has iniciado sesion');
    res.redirect(302, '/login');
  }
}

module.exports = router;
