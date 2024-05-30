const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./User');
const Item = require('./Item');

const Bid = sequelize.define('Bid', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    bidAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

Bid.belongsTo(Item, { foreignKey: 'item_id' });
Bid.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Bid;
