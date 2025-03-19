const crypto = require('crypto');
const Razorpay = require('razorpay');// Adjust the path as needed
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new Razorpay order and store it in MongoDB using the Order model
exports.createorder = async (req, res) => {
  try {
    const options = {
      amount: 50000, // Amount in paise (₹500)
      currency: "INR",
      payment_capture: 1, // Auto capture the payment
    };

    // Create order on Razorpay
    const order = await razorpay.orders.create(options);

    // Create and save an order document in MongoDB
    // We assume req.user is set by your authentication middleware
    const newOrder = new Order({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      user: req.user._id, // Reference to the User model
      status: order.status || 'PENDING', // Default status as PENDING
      paymentResponse: {}, // Initially empty until payment verification
    });
    await newOrder.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify Razorpay payment signature and update the corresponding order in MongoDB
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate signature on the server side using HMAC with SHA256
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Find the order by orderId
      const order = await Order.findOne({ orderId: razorpay_order_id });
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      // Update the order status and store the payment response details
      order.status = "VERIFIED";
      order.paymentResponse = req.body; // Save complete payment response for future reference
      await order.save();

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// Endpoint to retrieve all orders (transactions) from MongoDB
exports.getAllTransaction = async (req, res) => {
  try {
    // Optionally, you can filter orders by a specific user: { user: req.user._id }
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
