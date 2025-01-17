const express = require('express');
const supabase = require('../services/supabaseClient');
const { loginAdmin, signUpUser } = require('../controllers/auth');
const { getUsers, addUser } = require('../controllers/userController'); // Assuming you have a userController
const { getBanks, addBank } = require('../controllers/bankController'); // Assuming you have a bankController
const { getWithdrawals, updateWithdrawalStatus } = require('../controllers/withdrawalController'); // Assuming you have a withdrawalController

const router = express.Router();

// Authentication Routes
router.post('/loginAdmin', loginAdmin);
router.post('/signUpUser', signUpUser);

// User Management Routes
router.get('/users', getUsers); // Fetch all users
router.post('/users', addUser); // Add a new user

// Bank Management Routes
router.get('/banks', getBanks); // Fetch all banks
router.post('/banks', addBank); // Add a new bank

// Withdrawal Management Routes
router.get('/withdrawals', getWithdrawals); // Fetch all withdrawal requests
router.post('/withdrawals', updateWithdrawalStatus); // Approve or reject withdrawal requests

module.exports = router;
