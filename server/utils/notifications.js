const User = require('../models/user.model');

const sendNotification = async (userId, notification) => {
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        notifications: {
          ...notification,
          timestamp: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = { sendNotification }; 