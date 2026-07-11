const { Router } = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const providerController = require('../controllers/provider.controller');

const router = Router();

router.use(auth);

router.get('/', providerController.getProviders);
router.get('/balances', providerController.getBalances);
router.get('/statistics/:id', providerController.getStatistics);
router.get('/performance', authorize('MANAGEMENT'), providerController.getPerformance);
router.get('/:id', providerController.getProvider);

module.exports = router;
