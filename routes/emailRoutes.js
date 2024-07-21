const express = require('express');
const { handleDeriveEmail } = require('../controllers/emailController');

const router = express.Router();

router.post('/derive-email', handleDeriveEmail);

module.exports = router;
