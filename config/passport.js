var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// ----------------- LOCAL STRATEGY

passport.use(new LocalStrategy({
    usernameField:'correo',
    passwordField:'password'
}, 
function(correo, password, done) {
    User.getUserByEmail(correo, function(err, user){
        if (err) throw err;
        if (!user) return done(null, false, {message: "El correo electronico no ha sido registrado"})
        
        if (user.googleId && !user.password){
        return done(null, false, {message: "Inicia con Gooogle o registrate"});
        }else{
        User.comparePassword(password, user.password, function(err, isMatch){
            if (err) throw err;
            if (isMatch)
            return done(null, user);
            else
            return done(null, false, {message: "Contrasena invalida"});
        });
        }
    });
}));

//-------------------- PASSPORT SERIALIZE AND DESERIALIZE

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});