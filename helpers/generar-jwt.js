const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => new Promise((resolve, reject) => {
  const payload = { uid };

  jwt.sign(payload, process.env.SECRETORPRIVATEKEY,
    {
      expiresIn: '4h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('El token no pudo ser generado');
      } else {
        resolve(token);
      }

    });

});


module.exports = generarJWT;