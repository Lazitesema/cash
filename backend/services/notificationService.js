const sendNotification = async (userId, type, message) => {
  await prisma.notification.create({
    data: {
      userId,
      type,
      message,
      read: false
    }
  });
  
  // Add real-time notification logic here
};

module.exports = { sendNotification }; 