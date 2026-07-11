const { Router } = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const analyticsController = require('../controllers/analytics.controller');

const router = Router();

router.use(auth);
router.use(authorize('MANAGEMENT', 'OPERATOR'));

router.get('/overview', analyticsController.getOverview);
router.get('/kpis', analyticsController.getKPIs);
router.get('/forecast', analyticsController.getForecast);
router.get('/risk', analyticsController.getRisk);
router.get('/providers', analyticsController.getProviderAnalytics);
router.get('/liquidity', analyticsController.getLiquidityTrend);
router.get('/performance', analyticsController.getPerformanceMetrics);

module.exports = router;
