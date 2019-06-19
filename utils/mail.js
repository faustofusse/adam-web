const nodemailer = require("nodemailer");

function sendToNuevoUsuario(user, password, callback){

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adamproyecto1@gmail.com',
      pass: 'elmaspija'
    }
  });

  const mailOptions = {
    from: 'ADAM', // sender address
    to: user.email, // list of receivers
    subject: 'Bienvenido/a a ADAM', // Subject line
    html: 'Hola ' + user.name + '! Bienvenido/a a ADAM. Te informamos que un usuario fue creado a tu nombre. \n'
        + 'Puedes iniciar sesion en http://adam-proyecto.heroku.com/login con esta direccion de correo y \n'
        + 'la siguiente contraseña: ' + password
  };

  transporter.sendMail(mailOptions, callback);
}

module.exports.sendToNuevoUsuario = sendToNuevoUsuario;