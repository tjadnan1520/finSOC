const constants = require('./constants');

const getPagination = (page = 1, limit = constants.DEFAULT_PAGE_SIZE) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(
    constants.MAX_PAGE_SIZE,
    Math.max(1, parseInt(limit, 10) || constants.DEFAULT_PAGE_SIZE)
  );
  const skip = (pageNum - 1) * limitNum;

  return { skip, take: limitNum, page: pageNum, limit: limitNum };
};

const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { getPagination, getPaginationMeta };
