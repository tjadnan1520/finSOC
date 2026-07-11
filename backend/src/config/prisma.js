const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const config = require('./env');

let prisma;

if (config.app.env === 'development') {
  if (!globalThis.__prisma) {
    const adapter = new PrismaPg({ connectionString: config.database.url });
    globalThis.__prisma = new PrismaClient({ adapter });
  }
  prisma = globalThis.__prisma;
} else {
  const adapter = new PrismaPg({ connectionString: config.database.url });
  prisma = new PrismaClient({ adapter });
}

async function disconnect() {
  await prisma.$disconnect();
}

module.exports = prisma;
module.exports.disconnect = disconnect;
