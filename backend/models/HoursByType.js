const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HoursByType = sequelize.define('HoursByType', {
  report_id: { type: DataTypes.INTEGER, allowNull: false },
  task_type: { type: DataTypes.STRING, allowNull: false },
  hours: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
}, {
  tableName: 'hours_by_type',
  timestamps: false,
});

module.exports = HoursByType;