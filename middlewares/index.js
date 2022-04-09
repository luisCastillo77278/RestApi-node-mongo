
const validarCampos = require('./validar-campos');
const validarjWT = require('./validar-jwt');
const validarRole = require('./validar-role');
const validarUploads = require('./validar-uploads');

module.exports = {
  ...validarCampos,
  ...validarRole,
  ...validarjWT,
  ...validarUploads
};