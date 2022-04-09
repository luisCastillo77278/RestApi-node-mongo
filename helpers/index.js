const cargarArchivo = require('./subir-archivo');
const dbValidator = require('./db-validator');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');

module.exports = {
  ...cargarArchivo,
  ...dbValidator,
  ...generarJWT,
  ...googleVerify
};