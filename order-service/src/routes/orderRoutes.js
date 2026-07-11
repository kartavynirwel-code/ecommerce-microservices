const express = require('express');
const { body } = require('express-validator');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
    body('shippingAddress').optional().isString(),
  ],
  createOrder
);

router.get('/my', getMyOrders);
router.get('/:id', getOrderById);

// Admin-only endpoints
router.get('/', requireAdmin, getAllOrders);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
