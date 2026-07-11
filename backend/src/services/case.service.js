const caseRepository = require('../repositories/case.repository');
const notificationRepository = require('../repositories/notification.repository');
const auditRepository = require('../repositories/audit.repository');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const ApiError = require('../utils/apiError');

const getCases = async (filters = {}, paginationOpts = {}) => {
  const pagination = getPagination(paginationOpts.page, paginationOpts.limit);
  const sort = paginationOpts.sort || {};

  const result = await caseRepository.findAll({
    filters,
    pagination: { page: pagination.page, limit: pagination.limit },
    sort,
  });

  return {
    data: result.data,
    pagination: getPaginationMeta(result.pagination.total, pagination.page, pagination.limit),
  };
};

const getCaseById = async (id) => {
  const caseRecord = await caseRepository.findById(id);
  if (!caseRecord) throw new ApiError(404, 'Case not found');
  return {
    ...caseRecord,
    notes: caseRecord.caseNotes || [],
  };
};

const assignCase = async (caseId, operatorId, assignedById) => {
  const caseRecord = await caseRepository.findById(caseId);
  if (!caseRecord) throw new ApiError(404, 'Case not found');
  if (caseRecord.status === 'RESOLVED') {
    throw new ApiError(400, 'Cannot assign a resolved case');
  }

  await caseRepository.assign(caseId, operatorId, assignedById);

  await caseRepository.updateStatus(caseId, 'ASSIGNED');

  await caseRepository.addTimelineEntry({
    caseId,
    action: 'ASSIGNED',
    description: `Case assigned to operator`,
    actorId: assignedById,
  });

  await notificationRepository.create({
    userId: operatorId,
    title: 'Case Assigned',
    message: `Case #${caseId.slice(0, 8)} has been assigned to you`,
    type: 'CASE',
    link: `/cases/${caseId}`,
  });

  await auditRepository.create({
    userId: assignedById,
    action: 'CASE_ASSIGNED',
    resource: 'Case',
    resourceId: caseId,
    oldValue: { assignedTo: caseRecord.assignedToId || null },
    newValue: { assignedTo: operatorId },
    ip: null,
  });

  return caseRepository.findById(caseId);
};

const acceptCase = async (caseId, operatorId) => {
  const caseRecord = await caseRepository.findById(caseId);
  if (!caseRecord) throw new ApiError(404, 'Case not found');
  if (caseRecord.assignedToId !== operatorId) {
    throw new ApiError(403, 'You are not assigned to this case');
  }
  if (caseRecord.status !== 'ASSIGNED') {
    throw new ApiError(400, 'Case must be in ASSIGNED status to accept');
  }

  await caseRepository.accept(caseId, operatorId);
  await caseRepository.updateStatus(caseId, 'ASSIGNED');

  await caseRepository.addTimelineEntry({
    caseId,
    action: 'ACCEPTED',
    description: 'Case accepted by operator',
    actorId: operatorId,
  });

  return caseRepository.findById(caseId);
};

const addCaseNote = async (caseId, authorId, content) => {
  const caseRecord = await caseRepository.findById(caseId);
  if (!caseRecord) throw new ApiError(404, 'Case not found');

  const note = await caseRepository.addNote({
    caseId,
    authorId,
    content,
  });

  await caseRepository.addTimelineEntry({
    caseId,
    action: 'NOTE_ADDED',
    description: 'A note was added to the case',
    actorId: authorId,
  });

  return note;
};

const resolveCase = async (caseId, actorId) => {
  const caseRecord = await caseRepository.findById(caseId);
  if (!caseRecord) throw new ApiError(404, 'Case not found');
  if (caseRecord.status === 'RESOLVED') throw new ApiError(400, 'Case is already resolved');

  await caseRepository.resolve(caseId);

  await caseRepository.addTimelineEntry({
    caseId,
    action: 'RESOLVED',
    description: 'Case resolved',
    actorId,
  });

  return caseRepository.findById(caseId);
};

const closeCase = async (caseId, actorId) => {
  const caseRecord = await caseRepository.findById(caseId);
  if (!caseRecord) throw new ApiError(404, 'Case not found');

  await caseRepository.close(caseId);

  await caseRepository.addTimelineEntry({
    caseId,
    action: 'RESOLVED',
    description: 'Case marked as resolved',
    actorId,
  });

  return caseRepository.findById(caseId);
};

const getCaseSummary = async () => {
  return caseRepository.getSummaryStats();
};

module.exports = { getCases, getCaseById, assignCase, acceptCase, addCaseNote, resolveCase, closeCase, getCaseSummary };
