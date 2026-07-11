const morgan = require('morgan');

const stream = {
  write: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      process.stdout.write(message);
    }
  },
};

const skip = () => process.env.NODE_ENV === 'test';

function getLogger(format) {
  return morgan(format || 'dev', { stream, skip });
}

module.exports = { getLogger };
