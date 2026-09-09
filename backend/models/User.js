// This file defines the "User" model — a JavaScript representation
// of the `users` table we created in MySQL. Sequelize uses this
// to let us do things like User.create() or User.findOne() instead
// of writing raw SQL.

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('team_member', 'manager'),
    allowNull: false,
    defaultValue: 'team_member',
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
