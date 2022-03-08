import { StatusCodes } from 'http-status-codes';
import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems && orderItems.length === 0) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error('There is no order items');
  }

  const order = await Order.create({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(StatusCodes.CREATED).json({ order });
};

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Order not found');
  }

  res.status(StatusCodes.OK).json(order);
};

export { addOrderItems, getOrderById };
