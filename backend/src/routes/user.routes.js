const { Router } = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const userController = require('../controllers/user.controller');

const router = Router();

router.use(auth);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);
router.get('/by-role/:role', authorize('MANAGEMENT', 'OPERATOR', 'AGENT'), userController.getUsersByRole);

module.exports = router;
