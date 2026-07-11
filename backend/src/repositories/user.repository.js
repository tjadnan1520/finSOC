const prisma = require('../config/prisma');

const UserRepository = {
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        lastLoginAt: true,
        roleId: true,
        areaId: true,
        role: true,
        area: true,
      },
    });
  },

  async updateProfile(id, data) {
    const { name, email, phone, avatar } = data;
    return prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
      },
    });
  },

  async updatePassword(id, hashedPassword) {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },

  async findByRole(role) {
    return prisma.user.findMany({
      where: {
        role: {
          name: role,
        },
      },
      include: {
        role: true,
        area: true,
      },
    });
  },
};

module.exports = UserRepository;
