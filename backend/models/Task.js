// This represents one row in the `tasks` table —
// one task inside a specific weekly report.
// A single report can have many tasks (one-to-many).

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  report_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  planned_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  actual_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'done'),
    defaultValue: 'not_started',
  },
  time_planned_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  time_spent_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  output: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'tasks',
  timestamps: false,
});

module.exports = Task;