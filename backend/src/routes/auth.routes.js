const { Router } = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');
const authController = require('../controllers/auth.controller');
const { loginValidation } = require('../validators/auth.validator');

const router = Router();

router.post('/login', loginValidation, validate, authController.login);
router.get('/me', auth, authController.getCurrentUser);
router.post('/logout', auth, authController.logout);

module.exports = router;
