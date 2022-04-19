const { Router } = require('express');
const { check } = require('express-validator');

const {
  userGetAll,
  userPost,
  userDelete,
  userPut,
  userPatch,
  userGet,
} = require('../controllers/user');

const {
  esRolValido,
  emailExistDB,
  existIdInDb,
} = require('../helpers/db-validator');

const {
  validarCampos,
  validarjWT,
  tieneRol,
  // esAdminRol
} = require('../middlewares');

const router = Router();

router.get('/', userGetAll);

router.get(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('El valor debe de ser un id de mongoDb')
      .bail()
      .custom(existIdInDb)
      .bail(),
    validarCampos,
  ],
  userGet
);

router.put(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('El valor debe de ser un id de mongoDb')
      .bail()
      .custom(existIdInDb)
      .bail(),
    check('rol')
      .custom(esRolValido)
      .bail()
      .notEmpty()
      .withMessage('El campo rol es obligatorio')
      .bail(),
    validarCampos,
  ],
  userPut
);

router.post(
  '/',
  [
    check('correo')
      .isEmail()
      .withMessage('El correo no es valido')
      .bail()
      .notEmpty()
      .withMessage('El campo correo es obligatorio')
      .bail()
      .custom(emailExistDB)
      .bail(),
    check('nombre')
      .notEmpty()
      .withMessage('El campo nombre es obligatorio')
      .bail(),
    check('password')
      .notEmpty()
      .withMessage('El campo password es obligatorio')
      .bail()
      .isLength({ min: 8, max: 10 })
      .withMessage('El campo password debe contener minimo 8 caracteres')
      .bail(),
    // check('rol')
    // .notEmpty().withMessage('El campo rol es obligatorio').bail()
    // .isIn(['ADMIN_ROLE','USER_ROLE']).withMessage('No es un rol valido').bail()
    check('rol')
      .custom(esRolValido)
      .bail()
      .notEmpty()
      .withMessage('El campo ro es obligatorio')
      .bail(),
    validarCampos,
  ],
  userPost
);

router.delete(
  '/:id',
  [
    validarjWT,
    // esAdminRol, afuerza tiene que ser el rol admin
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id')
      .isMongoId()
      .withMessage('El valor debe de ser un id de mongoDb')
      .bail()
      .custom(existIdInDb)
      .bail(),
    validarCampos,
  ],
  userDelete
);

router.patch('/', userPatch);

module.exports = router;
