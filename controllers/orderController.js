import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // Check stock availability and update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }
      
      if (item.isRental) {
        // For rentals, we don't reduce stock permanently
        continue;
      }
      
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`${product.name} is out of stock`);
      }
      
      // Reduce the stock
      product.countInStock -= item.qty;
      await product.save();
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Send order confirmation email
    const message = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <h2>Order Details:</h2>
      <p>Order ID: ${createdOrder._id}</p>
      <p>Total: $${totalPrice}</p>
      <h3>Items:</h3>
      <ul>
        ${orderItems.map(item => `<li>${item.name} x ${item.qty} - $${item.price * item.qty}</li>`).join('')}
      </ul>
      <p>You will receive another email when your order ships.</p>
    `;

    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Order Confirmation',
        message,
      });
    } catch (error) {
      console.error('Email could not be sent', error);
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Check if the order belongs to the logged in user or if user is admin
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      res.json(order);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    // Send delivery confirmation email
    const message = `
      <h1>Your Order Has Been Delivered</h1>
      <p>Your order (ID: ${order._id}) has been marked as delivered.</p>
      <p>If you have not received your order or have any issues, please contact our customer support.</p>
      <p>Thank you for shopping with us!</p>
    `;

    try {
      await sendEmail({
        email: order.user.email,
        subject: 'Order Delivered',
        message,
      });
    } catch (error) {
      console.error('Email could not be sent', error);
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!['pending', 'processing', 'shipped', 'delivered'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  
  const order = await Order.findById(req.params.id);
  
  if (order) {
    order.status = status;
    
    // If status is delivered, also update isDelivered
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    const updatedOrder = await order.save();
    
    // Send status update email
    const message = `
      <h1>Order Status Update</h1>
      <p>Your order (ID: ${order._id}) status has been updated to: ${status}</p>
      <p>Thank you for shopping with us!</p>
    `;
    
    try {
      await sendEmail({
        email: order.user.email,
        subject: 'Order Status Update',
        message,
      });
    } catch (error) {
      console.error('Email could not be sent', error);
    }
    
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};