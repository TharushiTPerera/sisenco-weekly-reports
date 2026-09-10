const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NextWeekTask = sequelize.define('NextWeekTask', {
  report_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'next_week_tasks',
  timestamps: false,
});

module.exports = NextWeekTask;