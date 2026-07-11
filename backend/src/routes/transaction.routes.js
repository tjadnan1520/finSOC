const { Router } = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validator');
const transactionController = require('../controllers/transaction.controller');
const { cashInValidation, cashOutValidation } = require('../validators/transaction.validator');

const router = Router();

router.use(auth);

router.post('/cash-in', authorize('AGENT'), cashInValidation, validate, transactionController.cashIn);
router.post('/cash-out', authorize('AGENT'), cashOutValidation, validate, transactionController.cashOut);
router.get('/', transactionController.getTransactions);
router.get('/today-summary', transactionController.getTodaySummary);
router.get('/:id', transactionController.getTransaction);

module.exports = router;
