require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/db');
require('./models/Order');
require('./models/OrderItem');

const PORT = process.env.SERVER_PORT || 5001;

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log('order-service: database connection established');

    await sequelize.sync(); // creates tables if they do not exist yet

    app.listen(PORT, () => {
      console.log(`order-service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('order-service: unable to start', err);
    process.exit(1);
  }
}

start();
