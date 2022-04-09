const { Router } = require('express');
const searchController = require('../controllers/search');

const router = Router();

router.get('/:coleccion/:termino', searchController.search);

module.exports = router;