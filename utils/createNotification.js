const Notification = require('../models/NotificationModel.js');

module.exports = createNotification = async (
  sentby,
  sendto,
  text,
  type,
  postType,
  postId
) => {
  const newNotification = await Notification.create({
    sentby,
    sendto,
    text,
    type,
    postType,
    postId,
  });

  return { newNotification };
};
