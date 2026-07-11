const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const notification = require('../services/notification.service');

const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const pagination = { page: parseInt(page) || 1, limit: parseInt(limit) || 10 };
  const result = await notification.getNotifications(req.user.id, pagination);
  return successResponse(res, result);
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notification.getUnreadCount(req.user.id);
  return successResponse(res, result);
});

const markAsRead = asyncHandler(async (req, res) => {
  await notification.markAsRead(req.params.id);
  return successResponse(res, null, 'Notification marked as read');
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notification.markAllAsRead(req.user.id);
  return successResponse(res, null, 'All notifications marked as read');
});

const deleteNotification = asyncHandler(async (req, res) => {
  await notification.deleteNotification(req.params.id);
  return successResponse(res, null, 'Notification deleted');
});

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification };
