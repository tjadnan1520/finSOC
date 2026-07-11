const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const corsOptions = require('./config/cors');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/index');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(config.logging.level));
app.use(express.json({ limit: config.server.bodyLimit }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OK',
    data: {
      app: config.app.name,
      version: '1.0.0',
      environment: config.app.env,
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
