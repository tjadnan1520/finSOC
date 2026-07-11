const { Router } = require('express');

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const transactionRoutes = require('./transaction.routes');
const providerRoutes = require('./provider.routes');
const alertRoutes = require('./alert.routes');
const caseRoutes = require('./case.routes');
const analyticsRoutes = require('./analytics.routes');
const userRoutes = require('./user.routes');
const notificationRoutes = require('./notification.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/transactions', transactionRoutes);
router.use('/providers', providerRoutes);
router.use('/alerts', alertRoutes);
router.use('/cases', caseRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
