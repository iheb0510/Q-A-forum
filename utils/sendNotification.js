const io = require('../server.js');
const getUserUnseenNotifications = require('./getUserUnseenNotifications.js');

module.exports = sendNotification = async (event, userId, newNotification) => {
  // get unseen notifications
  const { unseenNotifications } = await getUserUnseenNotifications(userId);

  io.socket.local.emit(event, {
    toUserId: userId,
    newNotificationLength: unseenNotifications?.length,
    newNotification: newNotification,
  });
};
