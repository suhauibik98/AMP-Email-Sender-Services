const express = require('express');
const requireRole = require('../middleware/requireRole');
const { baseSendEmail } = require('../controllers/emailController');


const router = express.Router();

router.post('/email' , requireRole('admin'), baseSendEmail);


module.exports = router;