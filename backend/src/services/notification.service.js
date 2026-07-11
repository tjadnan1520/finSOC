const notificationRepository = require('../repositories/notification.repository');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const ApiError = require('../utils/apiError');

const getNotifications = async (userId, { page, limit } = {}) => {
  const pagination = getPagination(page, limit);
  const result = await notificationRepository.findByUserId(userId, { pagination });
  return {
    data: result.data,
    pagination: getPaginationMeta(result.pagination.total, pagination.page, pagination.limit),
  };
};

const getUnreadCount = async (userId) => {
  return notificationRepository.getUnreadCount(userId);
};

const markAsRead = async (notificationId) => {
  const notification = await notificationRepository.markAsRead(notificationId);
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
};

const markAllAsRead = async (userId) => {
  const count = await notificationRepository.markAllAsRead(userId);
  return { count };
};

const deleteNotification = async (notificationId) => {
  try {
    await notificationRepository.delete(notificationId);
  } catch (error) {
    if (error.code === 'P2025') throw new ApiError(404, 'Notification not found');
    throw error;
  }
  return { message: 'Notification deleted successfully' };
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification };
