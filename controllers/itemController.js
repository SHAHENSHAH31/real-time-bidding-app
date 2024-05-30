const Item = require('../models/Item');
const { Op } = require('sequelize');

exports.getItems = async (req, res) => {
  const { page = 1, size = 10, search = '' } = req.query;
  const items = await Item.findAndCountAll({
    where: {
      name: { [Op.iLike]: `%${search}%` },
    },
    limit: size,
    offset: (page - 1) * size,
  });

  res.json({ items: items.rows, totalItems: items.count });
};

exports.getItem = async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }
  res.json(item);
};

exports.createItem = async (req, res) => {
  const { name, description, starting_price, end_time } = req.body;
  const image_url = req.file ? req.file.path : null;
 
    const item = await Item.create({ name, description, starting_price, current_price: starting_price, image_url, end_time });

  res.status(201).json(item);

  
};

exports.updateItem = async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  if (item.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const { name, description, starting_price, end_time } = req.body;
  const image_url = req.file ? req.file.path : null;

  await item.update({ name, description, starting_price, end_time, image_url });

  res.json(item);
};

exports.deleteItem = async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  if (item.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied.' });
  }

  await item.destroy();
  res.status(204).send();
};
