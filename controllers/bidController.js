const Bid = require('../models/Bid');
const Item = require('../models/Item');
const notificationService = require('../services/notificationService');

exports.getBids = async (req, res) => {
  const bids = await Bid.findAll({ where: { item_id: req.params.itemId } });
  res.json(bids);
};

exports.placeBid = async (req, res) => {
  const item = await Item.findByPk(req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const { bid_amount } = req.body;
  if (bid_amount <= item.current_price) {
    return res.status(400).json({ error: 'Bid amount must be higher than current price.' });
  }

  const bid = await Bid.create({ item_id: req.params.itemId, user_id: req.user.id, bid_amount });
  await item.update({ current_price: bid_amount });

  // Notify users about bidding activities
  await notificationService.notifyUsers(bid);

  res.status(201).json(bid);
};
