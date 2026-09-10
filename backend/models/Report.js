// This represents one row in the `reports` table —
// one team member's report for one specific week.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  week_start: {
    type: DataTypes.DATEONLY, // just a date, no time
    allowNull: false,
  },
  week_end: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'needs_correction', 'approved'),
    allowNull: false,
    defaultValue: 'draft',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  latest_comment: {
    type: DataTypes.TEXT,
  },
  version_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'reports',
  timestamps: false,
});

module.exports = Report;