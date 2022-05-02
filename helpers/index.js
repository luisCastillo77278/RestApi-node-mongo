const cargarArchivo = require('./subir-archivo');
const dbValidator = require('./db-validator');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const comprovarJWT = require('./comprobar-jwt');

module.exports = {
  ...cargarArchivo,
  ...dbValidator,
  ...googleVerify,
  ...comprovarJWT,
  ...generarJWT
};