const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/User');
require('dotenv').config();

exports.createOrder = async (req, res) => {
  const url = 'https://sandbox.cashfree.com/pg/orders';
  const headers = {
    'Content-Type': 'application/json',
    'x-client-id': process.env.CASHFREE_APP_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    'x-api-version': '2022-09-01',
  };

  try {
    const { amount, id } = req.body;  // User ka _id le rahe hain
    const orderId = `order_${Date.now()}`;

    // ✅ Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ orderData mein user ka poora data bhej do
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: user._id,
        customer_email: user.email || '',
        customer_phone: user.phone || '',
      },
      user_details: {
        name: user.name,
        dob: user.dob,
        gender: user.gender,
        email:user.email,
        phone:user.phone,
        fatherName: user.fatherName,
        motherName: user.motherName,
        nationality: user.nationality,
        aadharNo: user.aadharNo,
        travelHistory: user.travelHistory,
        declaration: user.declaration,
      },
    };

    // ✅ Send request to Cashfree
    const response = await axios.post(url, orderData, { headers });

    // ✅ Save order in DB
    const newOrder = new Order({
      orderId,
      amount,
      currency: 'INR',
      user: user._id,
      status: 'PENDING',
      paymentResponse: response.data,
    });
    await newOrder.save();

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Order creation failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Payment order creation failed', details: error.response?.data });
  }
};


// ✅ Payment Status Check Controller
exports.getPaymentStatus = async (req, res) => {
    const { orderId, sessionId } = req.query;

    if (!orderId || !sessionId) {
        return res.status(400).json({ success: false, message: 'Order ID and Session ID are required' });
    }

    try {
        // 🕵️ Find Order by orderId
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // ✅ Check sessionId in paymentResponse
        if (order.paymentResponse?.payment_session_id !== sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID does not match' });
        }

        // 📝 Send Response
        res.json({
            success: true,
            orderId: order.orderId,
            sessionId: order.paymentResponse.payment_session_id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            paymentResponse: order.paymentResponse,
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// ✅ Get All Orders Controller (For Admin Panel)
exports.getAllOrders = async (req, res) => {
    try {
        // 🕵️ Fetch all orders with user details populated
        const orders = await Order.find().populate('user');

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        // 📝 Send Response
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
