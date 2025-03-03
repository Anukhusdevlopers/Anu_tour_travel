// controllers/inquiryController.js
const Inquiry = require('../models/ContactUs');

// ➤ POST: Create a new inquiry
exports.createInquiry = async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        const savedInquiry = await inquiry.save();
        res.status(201).json(savedInquiry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create inquiry', details: error.message });
    }
};

// ➤ GET: Fetch all inquiries
exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find();
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inquiries', details: error.message });
    }
};


