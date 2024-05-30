const Notification = require('../models/Notification');
const User = require('../models/User');

exports.notifyUsers = async (bid) => {
  const itemOwner = await User.findByPk(bid.item_id);
  if (itemOwner.id !== bid.user_id) {
    await Notification.create({
      user_id: itemOwner.id,
      message: `You have a new bid of $${bid.bid_amount} on your item.`,
    });
  }

  const outbidUsers = await Bid.findAll({
    where: { item_id: bid.item_id, bid_amount: { $lt: bid.bid_amount } },
  });

  for (const outbidUser of outbidUsers) {
    if (outbidUser.user_id !== bid.user_id) {
      await Notification.create({
        user_id: outbidUser.user_id,
        message: `You have been outbid on an item.`,
      });
    }
  }
};
