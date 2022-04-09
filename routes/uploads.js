const { Router } = require('express');
const { check } = require('express-validator');
const { 
  validarCampos,
  validarUploads
} = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

const uploadsController = require('../controllers/uploads');

router.post('/', [
  validarUploads
],uploadsController.cargarArchivo);

router.put('/:coleccion/:id', [
  validarUploads,
  check('id')
    .isMongoId()
    .withMessage('El id debe de ser un id de mongoDb valido')
    .bail(),
  check('coleccion')
    .custom( c => coleccionesPermitidas(c, ['user','productos']) )
    .bail(),
  validarCampos,
], uploadsController.actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
  check('id')
    .isMongoId()
    .withMessage('El id debe de ser un id de mongoDb valido')
    .bail(),
  check('coleccion')
    .custom( c => coleccionesPermitidas(c, ['user','productos']) )
    .bail(),
  validarCampos,
], uploadsController.mostrarImagen );

module.exports = router;