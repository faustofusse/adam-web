var nodemailer = require('nodemailer');

function sendToNuevoUsuario(user, password, callback) {

    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'faustofusse@gmail.com',
            pass: 'F@usto5596g'
        }
    });

    // Definimos el email
    var mailOptions = {
        from: 'Adam',
        to: user.email,
        subject: 'Bienvenido a ADAM',
        text: 'Hola ' + user.name + '!' +
            '\n Te damos la bienvenida a ADAM. Ya puedes iniciar sesion en http://www.adam.heroku.com/login con la siguiente contraseña: ' + password + '.' +
            '\n Puedes cambiarla en la seccion de \"Configuracion\" \n' +
            '\n Usuario: ' + user.email +
            '\n Contraseña: ' + password
    };

    // Enviamos el email
    transporter.sendMail(mailOptions, callback);
};

module.exports.sendToNuevoUsuario = sendToNuevoUsuario;