const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
}, {
  tableName: 'projects',
  timestamps: false,
});

module.exports = Project;
