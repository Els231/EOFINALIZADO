const express = require('express');
const router = express.Router();
const tutorialController = require('../controllers/tutorial.controller');

// Rutas CRUD
router.post('/', tutorialController.create);
router.get('/', tutorialController.findAll);
// Agregar más rutas según sea necesario

module.exports = router;