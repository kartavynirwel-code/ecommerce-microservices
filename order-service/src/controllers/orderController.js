const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const sequelize = require('../config/db');

async function createOrder(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
      0
    );

    const order = await Order.create(
      {
        userId: req.user.userId,
        username: req.user.username,
        status: 'PENDING',
        totalAmount,
        shippingAddress,
      },
      { transaction: t }
    );

    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    await OrderItem.bulkCreate(
      orderItems.map((i) => ({ ...i, order_id: order.id })),
      { transaction: t }
    );

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, { include: 'items' });
    return res.status(201).json(fullOrder);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.userId },
      include: 'items',
      order: [['created_at', 'DESC']],
    });
    return res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, { include: 'items' });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    return res.json(order);
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll({ include: 'items', order: [['created_at', 'DESC']] });
    return res.json(orders);
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    await order.save();
    return res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
