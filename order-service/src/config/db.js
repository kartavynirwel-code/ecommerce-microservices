const { Sequelize } = require('sequelize');

// All connection details come from environment variables.
// Nothing is hardcoded - see .env.example for the expected keys.
const sequelize = new Sequelize(
  process.env.DB_NAME || 'order_db',
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
