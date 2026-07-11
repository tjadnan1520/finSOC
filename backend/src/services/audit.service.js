const auditRepository = require('../repositories/audit.repository');

const logAction = async ({ userId, action, resource, resourceId, oldValue, newValue, ip }) => {
  return auditRepository.create({
    userId,
    action,
    resource,
    resourceId,
    oldValue: oldValue !== undefined ? JSON.parse(JSON.stringify(oldValue)) : undefined,
    newValue: newValue !== undefined ? JSON.parse(JSON.stringify(newValue)) : undefined,
    ip,
  });
};

module.exports = { logAction };
