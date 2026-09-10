const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReportReview = sequelize.define('ReportReview', {
  report_id: { type: DataTypes.INTEGER, allowNull: false },
  reviewer_id: { type: DataTypes.INTEGER, allowNull: false },
  action: {
    type: DataTypes.ENUM('approved', 'requested_changes'),
    allowNull: false,
  },
  comment: { type: DataTypes.TEXT },
  reviewed_version: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'report_reviews',
  timestamps: false,
});

module.exports = ReportReview;
