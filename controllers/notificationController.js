const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.findAll({ where: { user_id: req.user.id } });
  res.json(notifications);
};

exports.markRead = async (req, res) => {
  await Notification.update({ is_read: true }, { where: { user_id: req.user.id } });
  res.status(204).send();
};
