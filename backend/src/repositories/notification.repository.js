const prisma = require('../config/prisma');

const NotificationRepository = {
  async create(data) {
    return prisma.notification.create({
      data,
    });
  },

  async findByUserId(userId, { pagination = {} }) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = { userId };

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getUnreadCount(userId) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  },

  async markAsRead(id) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  async delete(id) {
    return prisma.notification.delete({
      where: { id },
    });
  },
};

module.exports = NotificationRepository;
