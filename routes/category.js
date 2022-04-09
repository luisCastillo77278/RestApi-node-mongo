const { Router } = require('express');
const { check } = require('express-validator');
const { 
  validarjWT, 
  validarCampos,
  tieneRol
} = require('../middlewares');
const { existCategoryInDb } = require('../helpers/db-validator');

const router = Router();

const categoriesControllers = require('../controllers/category');

router.get('/', categoriesControllers.categories);

router.post('/', [ 
  validarjWT,
  check('nombre')
    .notEmpty()
    .withMessage('El nombre requerido'),
  validarCampos
] ,categoriesControllers.createCategorie);

router.get('/:id',[
  check('id')
    .isMongoId().withMessage('El valor debe de ser un id de mongoDb').bail()
    .custom( existCategoryInDb ),
  validarCampos
],categoriesControllers.categoryById);

router.put('/:id',[
  validarjWT,
  check('id')
    .isMongoId().withMessage('El valor debe de ser un id de mongoDB').bail()
    .custom( existCategoryInDb ).bail(),
  check('nombre')
    .notEmpty().withMessage('El valor nombre es requerido').bail(),
  validarCampos
],categoriesControllers.putCategorie);

router.delete('/:id',[
  validarjWT,
  tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
  check('id')
    .isMongoId().withMessage('El valor debe de ser un id de mongoDB').bail()
    .custom( existCategoryInDb ).bail(),
  validarCampos
],categoriesControllers.deleteCategorie);

module.exports = router;