const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { 
  authLogin, 
  googleSignIn
} = require('../controllers/auth');

const router = Router();

router.post('/login', [
  check('correo')
    .notEmpty().withMessage('El campo no debe ir vacio').bail()
    .isEmail().withMessage('El campo debe ser un email').bail()
  ,
  check('password')
    .isLength({min: 8}).withMessage('El campo debe contener minimo 8 caracteres').bail()
    .notEmpty().withMessage('El campo no debe ir vacio').bail()
  ,
  validarCampos
] ,authLogin );

router.post('/google', [
  check('id_token')
    .notEmpty().withMessage('token de google es necesario').bail()
  ,
  validarCampos
],googleSignIn);

module.exports = router;

