const Notification = require('../models/Notification');

module.exports = getUserNotifications = async (userId) => {
  const notifications = await Notification.find({
    sendto: userId,
  }).sort({ createdAt: '-1' });

  return { notifications };
};
