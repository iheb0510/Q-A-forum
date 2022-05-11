const  Notification = require('../models/Notification') ;

module.exports = getUserUnseenNotifications = async (userId) => {
  const notifications = await Notification.find({
    sendto: userId,
  }).sort({ createdAt: '-1' });

  const unseenNotifications = notifications.filter(
    (notification) => notification.seen === false
  );

  return { unseenNotifications };
};