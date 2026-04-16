const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Allow user login
router.post('/login', authController.login);

module.exports = router;
