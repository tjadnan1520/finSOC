const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    timestamp: new Date().toISOString(),
  });
};

module.exports = notFound;
