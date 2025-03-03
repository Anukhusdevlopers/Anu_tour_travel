// models/Inquiry.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    firstName: { type: String,  },
    lastName: { type: String,  },
    email: { type: String,  },
    phone: { type: String, required: true },
    subject: { type: String, },
    message: { type: String, },
    inquiryType: { type: String, },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactUs', inquirySchema);
