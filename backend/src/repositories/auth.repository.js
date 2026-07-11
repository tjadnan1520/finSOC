const prisma = require('../config/prisma');

const AuthRepository = {
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        area: true,
      },
    });
  },

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        area: true,
      },
    });
  },

  async updateLastLogin(id) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
};

module.exports = AuthRepository;
