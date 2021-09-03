const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();
//Middleware to protect routes from unauthorized users
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;