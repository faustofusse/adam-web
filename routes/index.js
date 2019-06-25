const express = require('express');
const passport = require('passport');
const router = express.Router();
const Image = require('../models/image');
const Video = require('../models/video');
const File = require('../models/file');

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
  Video.find((err, videos) => {
    if (err) throw err;
    if (videos)
      res.render('imagenes', { title: 'Videos', videos });
  });
});

router.get('/imagenes', ensureAuthenticated, (req, res) => {
  Image.find((err, images) => {
    if (err) throw err;
    if (images)
      res.render('imagenes', { title: 'Imagenes', images });
  });
});

router.get('/contenido', ensureAuthenticated, (req, res, next) => {
  File.find({ type: 'text/plain' }, (err, docs) => {
    if (err) throw err;
    console.log(docs);
    res.render('contenido', { title: 'Contenido', files: docs });
  });
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
