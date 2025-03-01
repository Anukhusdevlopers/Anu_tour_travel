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



// User Routes
router.post('/create-user-tour-and-travel', createUser);
router.get('/create-user-tour-and-travel', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product Routes


module.exports = router;
