const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blocker = sequelize.define('Blocker', {
  report_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  is_key: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'blockers',
  timestamps: false,
});

module.exports = Blocker;