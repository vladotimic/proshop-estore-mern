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

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.status(StatusCodes.OK).json(updatedOrder);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error('Orders not found');
  }

  res.status(StatusCodes.OK).json(orders);
};

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
