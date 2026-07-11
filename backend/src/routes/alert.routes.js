const { Router } = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validator');
const alertController = require('../controllers/alert.controller');
const { assignAlertValidation, resolveAlertValidation } = require('../validators/alert.validator');

const router = Router();

router.use(auth);

router.get('/', alertController.getAlerts);
router.get('/summary', alertController.getAlertSummary);
router.get('/:id', alertController.getAlert);
router.patch('/assign', authorize('OPERATOR', 'MANAGEMENT'), assignAlertValidation, validate, alertController.assignAlert);
router.patch('/:id/resolve', authorize('OPERATOR', 'MANAGEMENT'), alertController.resolveAlert);
router.patch('/:id/close', authorize('OPERATOR', 'MANAGEMENT'), alertController.closeAlert);

module.exports = router;
