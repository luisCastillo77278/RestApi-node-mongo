const { Router } = require('express');
const { check } = require('express-validator');
const { validarjWT, validarCampos, tieneRol } = require('../middlewares');

const router = Router();

const productController = require('../controllers/product');
const { existProductInDb } = require('../helpers/db-validator');

router.get('/', productController.getProducts);

router.post(
  '/',
  [
    validarjWT,
    check('nombre').notEmpty().withMessage('El campo no debe ir vacio').bail(),
    check('precio')
      .isFloat()
      .withMessage('El campo debe de ser númerico')
      .bail(),
    validarCampos,
  ],
  productController.createProduct
);

router.get(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('El id debe ser in id de mongoDB')
      .bail()
      .custom(existProductInDb),
    validarCampos,
  ],
  productController.getProduct
);

router.put(
  '/:id',
  [
    validarjWT,
    check('id')
      .isMongoId()
      .withMessage('El id debe ser in id de mongoDB')
      .bail()
      .custom(existProductInDb)
      .bail(),
    check('nombre').notEmpty().withMessage('El campo no debe ir vacio').bail(),
    check('precio')
      .isFloat()
      .withMessage('El campo debe de ser númerico')
      .bail(),
    validarCampos,
  ],
  productController.putProduct
);

router.delete(
  '/:id',
  [
    validarjWT,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id')
      .isMongoId()
      .withMessage('El id debe ser in id de mongoDB')
      .bail()
      .custom(existProductInDb)
      .bail(),
    validarCampos,
  ],
  productController.deleteProduct
);

module.exports = router;
