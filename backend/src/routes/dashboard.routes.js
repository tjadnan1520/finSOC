const { Router } = require('express');
const auth = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard.controller');

const router = Router();

router.use(auth);

router.get('/', dashboardController.getDashboard);
router.get('/summary', dashboardController.getSummary);
router.get('/kpis', dashboardController.getKPIs);
router.get('/liquidity', dashboardController.getLiquidity);

module.exports = router;
