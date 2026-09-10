const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  report_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  is_key: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'achievements',
  timestamps: false,
});

module.exports = Achievement;