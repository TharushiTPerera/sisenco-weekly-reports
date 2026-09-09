// This file sets up the connection between our backend and the MySQL database.
// Sequelize reads the connection details from .env and creates one shared connection
// that the rest of the app (our models) will use.

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // set to console.log if you want to see every SQL query it runs
  }
);

module.exports = sequelize;