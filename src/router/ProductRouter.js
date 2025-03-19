const express = require('express');
const router = express.Router();

// Import Controllers
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const inquiryController = require('../controllers/ContactUsController');




const { createOrder ,getPaymentStatus,getAllOrders,updateOrderStatus,rejectOrder} = require('../controllers/OrderController');
const { createorderByRozerpay, verifyPaymentByRozerpay,getAllTransactionByRozerpay } = require('../controllers/rozarpayController');

router.post('/update-order-status/:orderId', updateOrderStatus);
router.post('/reject-order/:orderId', rejectOrder);

router.get('/payment-status', getPaymentStatus);
router.get('/all-orders', getAllOrders);

router.post('/create-order', createOrder);
// ➤ Create a new inquiry
router.post('/contact-us', inquiryController.createInquiry);

// ➤ Get all inquiries
router.get('/contact-us', inquiryController.getAllInquiries);

// User Routes
router.post('/create-user-tour-and-travel', createUser);
router.get('/create-user-tour-and-travel', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product Routes


// rozarpay payments
router.post('/createOrder',createorderByRozerpay);
router.post('/verifyPayment',verifyPaymentByRozerpay);
router.get('/getallOrders',getAllTransactionByRozerpay)

module.exports = router;
