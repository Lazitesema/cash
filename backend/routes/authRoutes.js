const express = require('express');
const supabase = require('../services/supabaseClient');
const { loginAdmin, signUpUser, logoutUser } = require('../controllers/auth');
const { getUsers, addUser, deleteUser, updateUser } = require('../controllers/userController');
const { getBanks, addBank, deleteBank } = require('../controllers/bankController'); // Assuming you have a bankController
const { getWithdrawals, updateWithdrawalStatus } = require('../controllers/withdrawalController'); // Assuming you have a withdrawalController

const router = express.Router();

// Authentication Routes
router.post('/loginAdmin', loginAdmin);
router.post('/signUpUser', signUpUser);
router.post('/logout', logoutUser); // User logout

// User Management Routes
router.get('/users', getUsers); // Fetch all users
router.post('/users', addUser); // Add a new user
router.delete('/users/:id', deleteUser); // Delete a user
router.put('/users/:id', updateUser); // Update a user

// Bank Management Routes
router.get('/banks', getBanks); // Fetch all banks
router.post('/banks', addBank); // Add a new bank
router.delete('/banks/:id', deleteBank); // Delete a bank

// Withdrawal Management Routes
router.get('/withdrawals', getWithdrawals); // Fetch all withdrawal requests
router.post('/withdrawals', updateWithdrawalStatus); // Approve or reject withdrawal requests

module.exports = router;
