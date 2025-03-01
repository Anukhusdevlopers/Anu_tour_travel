const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db'); // Import MongoDB connection function

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const productRoutes = require('./src/router/ProductRouter');
app.use('/api/products', productRoutes);

// Start Server
const PORT = process.env.PORT || 7000;

// Connect to Database and Start Server
connectDB(); // Call the MongoDB connection function
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
