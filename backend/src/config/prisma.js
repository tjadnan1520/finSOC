const { PrismaClient } = require('@prisma/client');
const config = require('./env');

const prisma = globalThis.prisma || new PrismaClient({
  log: config.app.env === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (config.app.env === 'development') {
  globalThis.prisma = prisma;
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
