const mongoose = require('mongoose');  // Yeh zaroori hai! ✔️

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User table se reference
    status: { type: String, default: 'PENDING' },
    paymentResponse: Object,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
