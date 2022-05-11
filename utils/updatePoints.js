const User = require('../models/User');

module.exports = updatePoints = async (userId, number) => {
  const user = await User.findById(userId);
  user.points += number;
  if (user.points < 50) {
    user.badge = 'Beginner';
  } else if (user.points < 100) {
    user.badge = 'Teacher';
  } else if (user.points < 150) {
    user.badge = 'Pundit';
  } else if (user.points < 200) {
    user.badge = 'Explainer';
  } else if (user.points < 250) {
    user.badge = 'Professionnel';
  } else {
    user.badge = 'Enlightened';
  }
  await user.save();
};
