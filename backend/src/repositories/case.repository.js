const prisma = require('../config/prisma');

const CaseRepository = {
  async create(data) {
    return prisma.case.create({
      data,
      include: {
        alert: true,
        assignedTo: true,
      },
    });
  },

  async findAll({ filters = {}, pagination = {}, sort = {} }) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const where = buildWhereClause(filters);

    const orderBy = {};
    if (sort.field) {
      orderBy[sort.field] = sort.order || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          alert: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              notes: true,
              timeline: true,
            },
          },
        },
      }),
      prisma.case.count({ where }),
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

  async findById(id) {
    return prisma.case.findUnique({
      where: { id },
      include: {
        alert: {
          include: {
            transaction: true,
            aiAnalysis: true,
            evidence: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        timeline: {
          orderBy: { timestamp: 'desc' },
          include: {
            actor: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },

  async updateStatus(id, status) {
    return prisma.case.update({
      where: { id },
      data: { status },
    });
  },

  async assign(id, operatorId, assignedById) {
    const caseRecord = await prisma.case.update({
      where: { id },
      data: { assignedToId: operatorId },
    });

    await prisma.assignment.create({
      data: {
        caseId: id,
        operatorId,
        assignedById,
      },
    });

    return caseRecord;
  },

  async accept(id) {
    return prisma.case.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
      },
    });
  },

  async resolve(id) {
    return prisma.case.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  },

  async close(id) {
    return prisma.case.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });
  },

  async addNote(data) {
    return prisma.caseNote.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });
  },

  async getTimeline(caseId) {
    return prisma.timeline.findMany({
      where: { caseId },
      orderBy: { timestamp: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async addTimelineEntry(data) {
    return prisma.timeline.create({
      data,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async getSummaryStats() {
    const [statusCounts, priorityCounts] = await Promise.all([
      prisma.case.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.case.groupBy({
        by: ['priority'],
        _count: true,
      }),
    ]);

    return {
      byStatus: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      }, {}),
      byPriority: priorityCounts.reduce((acc, curr) => {
        acc[curr.priority] = curr._count;
        return acc;
      }, {}),
    };
  },
};

function buildWhereClause(filters) {
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.priority) {
    where.priority = filters.priority;
  }
  if (filters.assignedToId) {
    where.assignedToId = filters.assignedToId;
  }
  if (filters.search) {
    where.alert = {
      title: { contains: filters.search },
    };
  }
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.createdAt.lte = new Date(filters.dateTo);
    }
  }

  return where;
}

module.exports = CaseRepository;
